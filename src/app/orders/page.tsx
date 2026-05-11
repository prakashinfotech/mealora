import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { orderService } from '@server/services/order.service'
import { OrderSuccessBanner } from '@/components/order/OrderSuccessBanner'
import { OrdersList } from '@/components/order/OrdersList'

export const metadata = { title: 'My Orders' }

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { items, hasMore, page } = await orderService.listForUser(session.user.id, { page: 1, limit: 10 })

  return (
    <>
      <Navbar />
      <main className="bg-swiggy-gray-bg py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-black text-swiggy-black mb-6">My Orders</h1>

          <OrderSuccessBanner />

          <OrdersList
            initialOrders={items.map((o) => ({ ...o, createdAt: o.createdAt.toISOString() }))}
            initialHasMore={hasMore}
            initialPage={page}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
