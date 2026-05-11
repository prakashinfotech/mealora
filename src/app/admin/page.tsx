import { StatCard } from '@/components/admin/ui/StatCard'
import { adminOrderService } from '@server/services/admin-order.service'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'
import { formatPrice } from '@/lib/utils'

export const metadata = { title: 'Dashboard' }
export const revalidate = 60

const icons = {
  orders: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  ),
  revenue: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  restaurants: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
  active: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
}

export default async function AdminDashboardPage() {
  const [orderStats, restaurantStats] = await Promise.all([
    adminOrderService.getStats(),
    adminRestaurantService.getStats(),
  ])

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Live stats across all orders and restaurants.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={orderStats.totalOrders.toLocaleString()}
          sub={`${orderStats.todayOrders} today`}
          icon={icons.orders}
        />
        <StatCard
          label="Revenue"
          value={formatPrice(Number(orderStats.revenue))}
          sub="From paid orders"
          icon={icons.revenue}
        />
        <StatCard
          label="Restaurants"
          value={restaurantStats.total.toLocaleString()}
          sub={`${restaurantStats.active} active`}
          icon={icons.restaurants}
        />
        <StatCard
          label="Active Orders"
          value={orderStats.activeOrders.toLocaleString()}
          sub="In progress now"
          icon={icons.active}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Manage Restaurants', href: '/admin/restaurants', desc: 'Add, edit, toggle open/closed' },
          { label: 'Manage Orders', href: '/admin/orders', desc: 'View and update order status' },
          { label: 'Manage Coupons', href: '/admin/coupons', desc: 'Create and deactivate coupons' },
          { label: 'Manage Users', href: '/admin/users', desc: 'View users and assign roles' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-brand-orange/50 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-orange transition-colors">
              {item.label}
            </p>
            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            <span className="text-xs text-brand-orange font-semibold mt-3 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
              Go →
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
