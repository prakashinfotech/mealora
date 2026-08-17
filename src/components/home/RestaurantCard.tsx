import Link from 'next/link'
import Image from 'next/image'
import { formatDeliveryTime, formatPrice, formatCount } from '@/lib/utils'
import type { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-app-gray-bg">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Delivery time */}
          <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-app-black text-[11px] font-black px-2 py-1 rounded-lg shadow">
            {formatDeliveryTime(restaurant.avgDeliveryTime)}
          </div>

          {/* Closed overlay */}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/60 px-4 py-1.5 rounded-full">
                Currently Closed
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {restaurant.isPureVeg && (
              <span className="bg-app-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                PURE VEG
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 pb-4">
          <h3 className="font-black text-app-black truncate text-[15px]">{restaurant.name}</h3>

          {/* Rating row */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-0.5 bg-app-green text-white text-xs font-bold px-1.5 py-0.5 rounded">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-app-gray text-xs">•</span>
            <span className="text-app-gray-light text-xs">{formatCount(restaurant.ratingCount)}+ ratings</span>
          </div>

          {/* Cuisines */}
          <p className="text-app-gray text-xs mt-1.5 truncate leading-relaxed">
            {restaurant.cuisines.join(' • ')}
          </p>

          {/* Bottom row */}
          <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-app-border">
            {restaurant.deliveryFee === 0 ? (
              <span className="text-xs font-semibold text-app-green">Free delivery</span>
            ) : (
              <span className="text-xs text-app-gray">{formatPrice(restaurant.deliveryFee)} delivery</span>
            )}
            <span className="text-app-border text-xs">•</span>
            <span className="text-xs text-app-gray">
              Min. {formatPrice(restaurant.minOrderAmount)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
