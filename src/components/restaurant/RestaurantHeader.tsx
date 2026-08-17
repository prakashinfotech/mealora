import Image from 'next/image'
import { formatDeliveryTime, formatPrice, formatCount } from '@/lib/utils'
import type { Restaurant } from '@/types'

interface Props {
  restaurant: Restaurant
}

export function RestaurantHeader({ restaurant }: Props) {
  return (
    <div className="bg-white border-b border-app-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-5 items-start">
          {/* Cover image */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-2xl overflow-hidden bg-app-gray-bg border border-app-border shadow-sm">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 144px, 112px"
              priority
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + status */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-app-black leading-tight">{restaurant.name}</h1>
              <div className="flex items-center gap-2 shrink-0">
                {restaurant.isPureVeg && (
                  <span className="text-[10px] font-bold text-app-green border border-app-green px-2 py-0.5 rounded">
                    PURE VEG
                  </span>
                )}
                {!restaurant.isOpen && (
                  <span className="text-xs font-bold bg-red-100 text-app-red px-2 py-1 rounded-lg">
                    Closed
                  </span>
                )}
              </div>
            </div>

            {/* Cuisines */}
            <p className="text-app-gray text-sm mt-1 line-clamp-1">
              {restaurant.cuisines.join(' • ')}
            </p>

            {/* Area */}
            <p className="text-app-gray-light text-xs mt-0.5">{restaurant.area}</p>

            {/* Stats row */}
            <div className="flex items-stretch gap-4 mt-3 pt-3 border-t border-app-border">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <span className="bg-app-green text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {restaurant.rating.toFixed(1)}
                </span>
                <span className="text-xs text-app-gray-light">
                  {formatCount(restaurant.ratingCount)}+ ratings
                </span>
              </div>

              <div className="w-px bg-app-border" />

              <div>
                <p className="text-xs font-bold text-app-black">{formatDeliveryTime(restaurant.avgDeliveryTime)}</p>
                <p className="text-[10px] text-app-gray-light">Delivery time</p>
              </div>

              <div className="w-px bg-app-border" />

              <div>
                <p className="text-xs font-bold text-app-black">
                  {restaurant.deliveryFee === 0 ? 'Free' : formatPrice(restaurant.deliveryFee)}
                </p>
                <p className="text-[10px] text-app-gray-light">Delivery fee</p>
              </div>

              {restaurant.minOrderAmount > 0 && (
                <>
                  <div className="w-px bg-app-border" />
                  <div>
                    <p className="text-xs font-bold text-app-black">{formatPrice(restaurant.minOrderAmount)}</p>
                    <p className="text-[10px] text-app-gray-light">Min. order</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {restaurant.description && (
          <p className="mt-4 text-sm text-app-gray leading-relaxed border-t border-app-border pt-4">
            {restaurant.description}
          </p>
        )}
      </div>
    </div>
  )
}
