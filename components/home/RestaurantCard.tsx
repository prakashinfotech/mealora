import Link from 'next/link'
import Image from 'next/image'
import { formatDeliveryTime, formatPrice } from '@/lib/utils'
import type { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} className="group block">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative h-44 overflow-hidden rounded-t-2xl bg-swiggy-gray-bg">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Delivery time pill */}
          <div className="absolute bottom-2 left-2 bg-white text-swiggy-black text-xs font-bold px-2 py-1 rounded-md shadow">
            {formatDeliveryTime(restaurant.avgDeliveryTime)}
          </div>
          {/* Closed overlay */}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">Currently Closed</span>
            </div>
          )}
          {restaurant.isPureVeg && (
            <div className="absolute top-2 left-2 bg-swiggy-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              PURE VEG
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-bold text-swiggy-black truncate">{restaurant.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-0.5">
            <span className="inline-flex items-center gap-1 bg-swiggy-green text-white text-xs font-bold px-1.5 py-0.5 rounded">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-swiggy-gray-light text-xs">({restaurant.ratingCount}+)</span>
          </div>

          {/* Cuisines */}
          <p className="text-swiggy-gray text-xs mt-1 truncate">
            {restaurant.cuisines.join(', ')}
          </p>

          {/* Bottom row */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-swiggy-border">
            <span className="text-xs text-swiggy-gray">
              {restaurant.deliveryFee === 0 ? (
                <span className="text-swiggy-green font-medium">Free delivery</span>
              ) : (
                `${formatPrice(restaurant.deliveryFee)} delivery`
              )}
            </span>
            <span className="text-swiggy-border">•</span>
            <span className="text-xs text-swiggy-gray">
              Min. {formatPrice(restaurant.minOrderAmount)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
