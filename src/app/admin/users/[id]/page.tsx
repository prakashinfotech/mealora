import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminUserService } from '@server/services/admin-user.service'
import { AdminBadge, ORDER_STATUS_VARIANT } from '@/components/admin/ui/AdminBadge'
import { UserRoleUpdater } from '@/components/admin/users/UserRoleUpdater'
import { formatPrice } from '@/lib/utils'

export const revalidate = 0

interface Props {
  params: { id: string }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500 shrink-0 w-28">{label}</span>
      <span className="text-xs text-slate-800 font-medium text-right break-all">{value ?? '—'}</span>
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

export default async function AdminUserDetailPage({ params }: Props) {
  let user: Awaited<ReturnType<typeof adminUserService.findById>>

  try {
    user = await adminUserService.findById(params.id)
  } catch {
    notFound()
  }

  const initials = (user.name ?? user.email)
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="mb-1">
          <Link href="/admin/users" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Users
          </Link>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user.name ?? '(No name)'}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <StatPill label="Total Orders" value={user.stats.totalOrders} />
        <StatPill label="Total Spent" value={user.stats.totalSpent > 0 ? formatPrice(user.stats.totalSpent) : '—'} />
        <StatPill label="Coupons Used" value={user.stats.couponsUsed} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recent orders */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Recent Orders</h3>
              <Link
                href={`/admin/orders?search=${encodeURIComponent(user.email)}`}
                className="text-xs text-brand-primary hover:underline font-medium"
              >
                View all →
              </Link>
            </div>
            {user.orders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">No orders yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Restaurant</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {user.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-xs font-semibold text-brand-primary hover:underline"
                        >
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">{order._count.items} item{order._count.items !== 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-700">{order.restaurant.name}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-800 text-right">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3">
                        <AdminBadge variant={ORDER_STATUS_VARIANT[order.status] ?? 'slate'}>
                          {order.status.replace(/_/g, ' ')}
                        </AdminBadge>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Saved Addresses <span className="text-slate-400 font-normal">({user.addresses.length})</span>
            </h3>
            {user.addresses.length === 0 ? (
              <p className="text-xs text-slate-400">No addresses saved.</p>
            ) : (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">{addr.label}</span>
                        {addr.isDefault && (
                          <AdminBadge variant="green">Default</AdminBadge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                      <p className="text-xs text-slate-500">{addr.city}, {addr.state} – {addr.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5">
          {/* Role management */}
          <UserRoleUpdater userId={user.id} currentRole={user.role} />

          {/* Profile info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Profile</h3>
            <InfoRow label="Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />
            <InfoRow
              label="Last updated"
              value={new Date(user.updatedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            />
          </div>

          {/* Payment summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Activity Summary</h3>
            <InfoRow label="Total orders" value={user.stats.totalOrders} />
            <InfoRow
              label="Total spent"
              value={user.stats.totalSpent > 0 ? formatPrice(user.stats.totalSpent) : '—'}
            />
            <InfoRow label="Coupons used" value={user.stats.couponsUsed} />
            <InfoRow label="Addresses" value={user.addresses.length} />
          </div>
        </div>
      </div>
    </div>
  )
}
