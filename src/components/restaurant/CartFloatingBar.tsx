'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartFloatingBar() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const totalItems = useCartStore((s) => s.totalItems())

  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-4xl mx-auto px-4 pb-4 pointer-events-none animate-slide-up-bar">
      <Link
        href="/cart"
        className="pointer-events-auto flex items-center justify-between bg-swiggy-green text-white px-5 py-4 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="bg-white text-swiggy-green text-xs font-black w-6 h-6 rounded flex items-center justify-center">
            {totalItems}
          </span>
          <span className="font-semibold text-sm">
            {totalItems} item{totalItems !== 1 ? 's' : ''} added
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{formatPrice(subtotal)}</span>
          <span className="font-bold text-sm">→ View Cart</span>
        </div>
      </Link>
    </div>
  )
}
