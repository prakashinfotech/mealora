import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminOrderService } from '@server/services/admin-order.service'
import { AdminBadge, ORDER_STATUS_VARIANT, PAYMENT_STATUS_VARIANT } from '@/components/admin/ui/AdminBadge'
import { OrderStatusUpdater } from '@/components/admin/orders/OrderStatusUpdater'
import { formatPrice } from '@/lib/utils'

export const revalidate = 0

interface Props {
  params: { id: string }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500 shrink-0 w-32">{label}</span>
      <span className="text-xs text-slate-800 font-medium text-right">{value}</span>
    </div>
  )
}

export default async function AdminOrderDetailPage({ params }: Props) {
  let order: Awaited<ReturnType<typeof adminOrderService.findById>>

  try {
    order = await adminOrderService.findById(params.id)
  } catch {
    notFound()
  }

  const createdAt = new Date(order.createdAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/orders" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              ← Orders
            </Link>
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-mono">
            #{order.id.slice(-8).toUpperCase()}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{createdAt}</p>
        </div>
        <div className="flex items-center gap-2">
          <AdminBadge variant={PAYMENT_STATUS_VARIANT[order.paymentStatus] ?? 'slate'}>
            {order.paymentStatus}
          </AdminBadge>
          <AdminBadge variant={ORDER_STATUS_VARIANT[order.status] ?? 'slate'}>
            {order.status.replace(/_/g, ' ')}
          </AdminBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — main details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Order Items</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3 text-slate-800 font-medium text-xs">{item.name}</td>
                    <td className="px-5 py-3 text-slate-600 text-xs text-right">{item.quantity}</td>
                    <td className="px-5 py-3 text-slate-600 text-xs text-right">{formatPrice(item.price)}</td>
                    <td className="px-5 py-3 text-slate-800 font-semibold text-xs text-right">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bill breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Bill Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Taxes & Charges</span>
                <span>{formatPrice(order.taxes)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Timeline</h3>
            {order.timeline.length === 0 ? (
              <p className="text-xs text-slate-400">No timeline entries yet.</p>
            ) : (
              <ol className="relative border-l border-slate-200 space-y-4 ml-2">
                {order.timeline.map((entry) => (
                  <li key={entry.id} className="ml-4">
                    <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-brand-primary border-2 border-white" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <AdminBadge variant={ORDER_STATUS_VARIANT[entry.status] ?? 'slate'}>
                          {entry.status.replace(/_/g, ' ')}
                        </AdminBadge>
                        {entry.message && (
                          <p className="text-xs text-slate-500 mt-1">{entry.message}</p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">
                        {new Date(entry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        {' '}
                        {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5">
          {/* Status updater */}
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />

          {/* Customer */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Customer</h3>
            <InfoRow label="Name" value={order.user.name ?? '—'} />
            <InfoRow label="Email" value={order.user.email} />
            {order.user.phone && <InfoRow label="Phone" value={order.user.phone} />}
          </div>

          {/* Restaurant */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Restaurant</h3>
            <InfoRow label="Name" value={order.restaurant.name} />
            <InfoRow label="Area" value={order.restaurant.area} />
            <InfoRow label="City" value={order.restaurant.city} />
            <div className="mt-3">
              <Link
                href={`/admin/restaurants/${order.restaurant.id}`}
                className="text-xs text-brand-primary hover:underline font-medium"
              >
                View restaurant →
              </Link>
            </div>
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Delivery Address</h3>
              <p className="text-xs text-slate-600 font-medium">{order.address.label}</p>
              <p className="text-xs text-slate-500 mt-1">{order.address.line1}</p>
              {order.address.line2 && <p className="text-xs text-slate-500">{order.address.line2}</p>}
              <p className="text-xs text-slate-500">{order.address.city}, {order.address.state} – {order.address.pincode}</p>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Payment</h3>
            <InfoRow label="Mode" value={order.paymentMode.replace(/_/g, ' ')} />
            <InfoRow label="Status" value={
              <AdminBadge variant={PAYMENT_STATUS_VARIANT[order.paymentStatus] ?? 'slate'}>
                {order.paymentStatus}
              </AdminBadge>
            } />
            {order.otp && <InfoRow label="OTP" value={<span className="font-mono font-bold">{order.otp}</span>} />}
            {order.razorpayOrderId && (
              <InfoRow label="Razorpay Order" value={
                <span className="font-mono text-xs break-all">{order.razorpayOrderId}</span>
              } />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
