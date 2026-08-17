import Link from 'next/link'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export interface ProfileOrder {
  id: string
  total: number
  status: OrderStatus
  createdAt: string
  restaurant: { id: string; name: string; imageUrl: string; area: string }
  items: { name: string; quantity: number }[]
}

interface OrderPreviewCardProps {
  order: ProfileOrder
}

export function OrderPreviewCard({ order }: OrderPreviewCardProps) {
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const itemsSummary = order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')

  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex gap-4 p-4 rounded-xl hover:bg-app-gray-bg transition-colors group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={order.restaurant.imageUrl}
        alt={order.restaurant.name}
        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-app-gray-bg"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-app-black text-sm group-hover:text-brand-primary transition-colors truncate">
            {order.restaurant.name}
          </p>
          <span className={cn('text-xs font-semibold shrink-0', ORDER_STATUS_COLORS[order.status])}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
        <p className="text-xs text-app-gray mt-0.5 truncate">{itemsSummary}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-app-gray-light">{date}</span>
          <span className="text-app-gray-light text-xs">·</span>
          <span className="text-xs font-semibold text-app-black">{formatPrice(order.total)}</span>
        </div>
      </div>
    </Link>
  )
}
