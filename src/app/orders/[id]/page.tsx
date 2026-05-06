import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { OrderTracker } from '@/components/order/OrderTracker'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

export const metadata: Metadata = { title: 'Order Tracking' }

// Revalidate frequently while order is active
export const revalidate = 10

async function getOrder(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    include: {
      restaurant: { select: { id: true, name: true, imageUrl: true, area: true } },
      address: true,
      items: true,
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  })
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const order = await getOrder(params.id, session.user.id)
  if (!order) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-swiggy-gray-bg py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-swiggy-gray mb-6">
            <Link href="/" className="hover:text-brand-orange">Home</Link>
            <span>›</span>
            <Link href="/orders" className="hover:text-brand-orange">My Orders</Link>
            <span>›</span>
            <span className="text-swiggy-black font-medium truncate">#{order.id.slice(-8).toUpperCase()}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tracker */}
            <div className="lg:col-span-2 space-y-4">
              <OrderTracker orderId={order.id} initialStatus={order.status} />

              {/* OTP */}
              {order.otp && order.status === 'OUT_FOR_DELIVERY' && (
                <div className="bg-brand-orange-light border border-orange-200 rounded-2xl p-5 text-center">
                  <p className="text-sm text-swiggy-gray mb-1">Share this OTP with the delivery partner</p>
                  <p className="text-4xl font-black text-brand-orange tracking-widest">{order.otp}</p>
                </div>
              )}

              {/* Restaurant */}
              <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-swiggy-gray-bg shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={order.restaurant.imageUrl} alt={order.restaurant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-swiggy-black">{order.restaurant.name}</p>
                  <p className="text-xs text-swiggy-gray">{order.restaurant.area}</p>
                </div>
                <Link
                  href={`/restaurants/${order.restaurant.id}`}
                  className="shrink-0 text-xs font-semibold text-brand-orange border border-brand-orange px-3 py-1.5 rounded-lg hover:bg-brand-orange-light"
                >
                  Reorder
                </Link>
              </div>
            </div>

            {/* Right: order details */}
            <div className="space-y-4">
              {/* Items */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-swiggy-black mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-swiggy-black truncate mr-2">
                        {item.name} <span className="text-swiggy-gray">× {item.quantity}</span>
                      </span>
                      <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-swiggy-border mt-3 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-swiggy-gray">
                    <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-swiggy-gray">
                    <span>Delivery fee</span>
                    <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-swiggy-gray">
                    <span>Taxes</span><span>{formatPrice(order.taxes)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-swiggy-black pt-1 border-t border-swiggy-border">
                    <span>Total</span><span>{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-swiggy-border text-xs text-swiggy-gray">
                  <p>Payment: <span className="font-medium text-swiggy-black">{order.paymentMode.replace(/_/g, ' ')}</span></p>
                  <p className="mt-1">Order ID: <span className="font-mono font-medium text-swiggy-black">#{order.id.slice(-12).toUpperCase()}</span></p>
                </div>
              </div>

              {/* Delivery address */}
              {order.address && (
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <h3 className="font-bold text-swiggy-black mb-2">Delivery Address</h3>
                  <p className="text-xs font-bold text-brand-orange uppercase">{order.address.label}</p>
                  <p className="text-sm text-swiggy-black mt-1">{order.address.line1}</p>
                  <p className="text-xs text-swiggy-gray">{order.address.city}, {order.address.pincode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
