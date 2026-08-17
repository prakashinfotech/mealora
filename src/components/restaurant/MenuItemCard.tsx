'use client'

import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { getMenuItemImage, isGenericPlaceholder } from '@/lib/menuImages'
import { VegBadge } from '@/components/ui/Badge'
import type { MenuItem, Restaurant } from '@/types'

interface Props {
  item: MenuItem
  restaurant: Pick<Restaurant, 'id' | 'name'>
}

export function MenuItemCard({ item, restaurant }: Props) {
  const { items, addItem, incrementItem, decrementItem } = useCartStore()
  const cartItem = items.find((i) => i.menuItemId === item.id)
  const quantity = cartItem?.quantity ?? 0
  const displayImage = isGenericPlaceholder(item.imageUrl)
    ? getMenuItemImage(item.name, item.isVeg)
    : item.imageUrl

  return (
    <div className={`flex gap-4 py-5 border-b border-app-border last:border-b-0 ${!item.isAvailable ? 'opacity-50' : ''}`}>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <VegBadge isVeg={item.isVeg} />
          {item.isBestSeller && (
            <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded">
              BESTSELLER
            </span>
          )}
        </div>

        <h4 className="font-semibold text-app-black text-sm leading-tight">{item.name}</h4>
        <p className="font-bold text-app-black mt-1">{formatPrice(item.price)}</p>

        {item.description && (
          <p className="text-xs text-app-gray mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Image + Add button */}
      <div className="shrink-0 flex flex-col items-center gap-2">
        <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-app-gray-bg">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={item.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
          )}
        </div>

        {item.isAvailable && (
          quantity === 0 ? (
            <button
              aria-label={`Add ${item.name} to cart`}
              onClick={() =>
                addItem({
                  menuItemId: item.id,
                  name: item.name,
                  price: item.price,
                  imageUrl: item.imageUrl,
                  isVeg: item.isVeg,
                  restaurantId: restaurant.id,
                  restaurantName: restaurant.name,
                })
              }
              className="w-24 py-1.5 border-2 border-brand-primary text-brand-primary text-sm font-bold rounded-lg hover:bg-brand-primary-light transition-colors"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center w-24 justify-between bg-brand-primary rounded-lg px-2 py-1">
              <button
                aria-label={`Remove one ${item.name}`}
                onClick={() => decrementItem(item.id)}
                className="text-white font-black text-lg leading-none w-6 h-6 flex items-center justify-center"
              >
                −
              </button>
              <span className="text-white font-bold text-sm" aria-live="polite">{quantity}</span>
              <button
                aria-label={`Add one more ${item.name}`}
                onClick={() => incrementItem(item.id)}
                className="text-white font-black text-lg leading-none w-6 h-6 flex items-center justify-center"
              >
                +
              </button>
            </div>
          )
        )}
        {!item.isAvailable && (
          <span className="text-[10px] font-medium text-app-red">Not available</span>
        )}
      </div>
    </div>
  )
}
