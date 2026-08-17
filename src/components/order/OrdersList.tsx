'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

type OrderSummary = {
  id: string
  status: keyof typeof ORDER_STATUS_LABELS
  total: number
  discount: number
  createdAt: string
  restaurant: { id: string; name: string; imageUrl: string; area: string }
  items: { name: string; quantity: number }[]
}

interface Props {
  initialOrders: OrderSummary[]
  initialHasMore: boolean
  initialPage: number
}

export function OrdersList({ initialOrders, initialHasMore, initialPage }: Props) {
  const [orders, setOrders] = useState(initialOrders)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetch(`/api/orders?page=${nextPage}&limit=10`)
      const data = await res.json()
      if (!data.success) return
      setOrders((prev) => [...prev, ...data.data.items])
      setHasMore(data.data.hasMore)
      setPage(nextPage)
    } finally {
      setLoading(false)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl">
        <span className="text-6xl">🍽️</span>
        <p className="text-lg font-bold text-app-black mt-4">No orders yet</p>
        <p className="text-app-gray text-sm mt-1">Start exploring restaurants!</p>
        <Link href="/restaurants" className="btn-primary inline-block mt-5">Browse restaurants</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow p-4"
          >
            <div className="flex gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-app-gray-bg shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.restaurant.imageUrl}
                  alt={order.restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-app-black">{order.restaurant.name}</h3>
                  <span className={cn('text-xs font-semibold shrink-0', ORDER_STATUS_COLORS[order.status])}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className="text-sm text-app-gray mt-0.5 truncate">
                  {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-app-gray-light flex-wrap">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-app-black">{formatPrice(order.total)}</span>
                  {order.discount > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-app-green font-semibold">Saved {formatPrice(order.discount)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 rounded-xl border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading…
              </span>
            ) : (
              'Load More Orders'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
