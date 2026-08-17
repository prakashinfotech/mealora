import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { OrderTracker } from '@/components/order/OrderTracker'
import { formatPrice } from '@/lib/utils'
import { orderService } from '@server/services/order.service'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

export const metadata: Metadata = { title: 'Order Tracking' }

// Revalidate frequently while order is active
export const revalidate = 10

export default async function OrderTrackingPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const order = await orderService.findForUser(params.id, session.user.id)
  if (!order) notFound()

  return (
    <>
      <Navbar />
      <main className="bg-app-gray-bg py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-app-gray mb-6">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span>›</span>
            <Link href="/orders" className="hover:text-brand-primary">My Orders</Link>
            <span>›</span>
            <span className="text-app-black font-medium truncate">#{order.id.slice(-8).toUpperCase()}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tracker */}
            <div className="lg:col-span-2 space-y-4">
              <OrderTracker orderId={order.id} initialStatus={order.status} />

              {/* OTP */}
              {order.otp && order.status === 'OUT_FOR_DELIVERY' && (
                <div className="bg-brand-primary-light border border-orange-200 rounded-2xl p-5 text-center">
                  <p className="text-sm text-app-gray mb-1">Share this OTP with the delivery partner</p>
                  <p className="text-4xl font-black text-brand-primary tracking-widest">{order.otp}</p>
                </div>
              )}

              {/* Restaurant */}
              <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-app-gray-bg shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={order.restaurant.imageUrl} alt={order.restaurant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-app-black">{order.restaurant.name}</p>
                  <p className="text-xs text-app-gray">{order.restaurant.area}</p>
                </div>
                <Link
                  href={`/restaurants/${order.restaurant.id}`}
                  className="shrink-0 text-xs font-semibold text-brand-primary border border-brand-primary px-3 py-1.5 rounded-lg hover:bg-brand-primary-light"
                >
                  Reorder
                </Link>
              </div>
            </div>

            {/* Right: order details */}
            <div className="space-y-4">
              {/* Items */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-app-black mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-app-black truncate mr-2">
                        {item.name} <span className="text-app-gray">× {item.quantity}</span>
                      </span>
                      <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon badge */}
                {order.couponCode && order.discount > 0 && (
                  <div className="mt-3 flex items-center gap-2 bg-app-green/10 border border-app-green/25 rounded-xl px-3 py-2">
                    <svg className="w-3.5 h-3.5 text-app-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-app-green">
                        {order.couponCode} applied
                      </p>
                      <p className="text-xs text-app-green font-medium">
                        You saved {formatPrice(order.discount)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-app-border mt-3 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-app-gray">
                    <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-app-gray">
                    <span>Delivery fee</span>
                    <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-app-gray">
                    <span>Taxes</span><span>{formatPrice(order.taxes)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-app-green font-medium">
                      <span>Coupon discount</span>
                      <span>−{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-app-black pt-1.5 border-t border-app-border">
                    <span>Total</span><span>{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-app-border text-xs text-app-gray">
                  <p>Payment: <span className="font-medium text-app-black">{order.paymentMode.replace(/_/g, ' ')}</span></p>
                  <p className="mt-1">Order ID: <span className="font-mono font-medium text-app-black">#{order.id.slice(-12).toUpperCase()}</span></p>
                </div>
              </div>

              {/* Delivery address */}
              {order.address && (
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <h3 className="font-bold text-app-black mb-2">Delivery Address</h3>
                  <p className="text-xs font-bold text-brand-primary uppercase">{order.address.label}</p>
                  <p className="text-sm text-app-black mt-1">{order.address.line1}</p>
                  <p className="text-xs text-app-gray">{order.address.city}, {order.address.pincode}</p>
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
