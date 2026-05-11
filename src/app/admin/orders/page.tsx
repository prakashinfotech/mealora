import { OrderListClient } from '@/components/admin/orders/OrderListClient'

export const metadata = { title: 'Orders' }

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Orders</h2>
        <p className="text-sm text-slate-500 mt-0.5">View and manage all customer orders.</p>
      </div>
      <OrderListClient />
    </div>
  )
}
