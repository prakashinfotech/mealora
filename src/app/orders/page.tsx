import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { orderService } from '@server/services/order.service'
import { OrderSuccessBanner } from '@/components/order/OrderSuccessBanner'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'My Orders' }

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const orders = await orderService.listForUser(session.user.id)

  return (
    <>
      <Navbar />
      <main className="bg-swiggy-gray-bg py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-black text-swiggy-black mb-6">My Orders</h1>

          <OrderSuccessBanner />

          {orders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl">
              <span className="text-6xl">🍽️</span>
              <p className="text-lg font-bold text-swiggy-black mt-4">No orders yet</p>
              <p className="text-swiggy-gray text-sm mt-1">Start exploring restaurants!</p>
              <Link href="/restaurants" className="btn-primary inline-block mt-5">Browse restaurants</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-swiggy-gray-bg shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.restaurant.imageUrl}
                        alt={order.restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-swiggy-black">{order.restaurant.name}</h3>
                        <span className={cn('text-xs font-semibold shrink-0', ORDER_STATUS_COLORS[order.status])}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <p className="text-sm text-swiggy-gray mt-0.5 truncate">
                        {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-swiggy-gray-light flex-wrap">
                        <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span className="font-semibold text-swiggy-black">{formatPrice(order.total)}</span>
                        {order.discount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-swiggy-green font-semibold">Saved {formatPrice(order.discount)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
