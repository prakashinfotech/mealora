'use client'

import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { VegBadge } from '@/components/ui/Badge'
import type { CartItem as CartItemType } from '@/types'

export function CartItemRow({ item }: { item: CartItemType }) {
  const { incrementItem, decrementItem } = useCartStore()

  return (
    <div className="flex items-center gap-4 py-4 border-b border-app-border last:border-b-0">
      {/* Image */}
      {item.imageUrl ? (
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-app-gray-bg">
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-lg shrink-0 bg-app-gray-bg flex items-center justify-center text-2xl">
          🍽️
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <VegBadge isVeg={item.isVeg} />
        </div>
        <p className="font-semibold text-app-black text-sm truncate">{item.name}</p>
        <p className="text-app-gray text-xs">{formatPrice(item.price)} each</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2 border-2 border-brand-primary rounded-lg px-2 py-1">
          <button
            onClick={() => decrementItem(item.menuItemId)}
            className="text-brand-primary font-black text-lg leading-none w-5 h-5 flex items-center justify-center"
          >
            −
          </button>
          <span className="text-app-black font-bold text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => incrementItem(item.menuItemId)}
            className="text-brand-primary font-black text-lg leading-none w-5 h-5 flex items-center justify-center"
          >
            +
          </button>
        </div>
        <span className="font-bold text-app-black text-sm w-16 text-right">
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
    </div>
  )
}
