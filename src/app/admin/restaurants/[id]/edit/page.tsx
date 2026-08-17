import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'
import { RestaurantForm } from '@/components/admin/restaurants/RestaurantForm'

interface Props {
  params: { id: string }
}

export async function generateMetadata() {
  return { title: `Edit Restaurant` }
}

export default async function EditRestaurantPage({ params }: Props) {
  let restaurant
  try {
    restaurant = await adminRestaurantService.findById(params.id)
  } catch {
    notFound()
  }

  const defaultValues = {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description ?? '',
    imageUrl: restaurant.imageUrl ?? '',
    bannerUrl: restaurant.bannerUrl ?? '',
    cuisines: restaurant.cuisines,
    city: restaurant.city,
    area: restaurant.area,
    address: restaurant.address,
    rating: restaurant.rating,
    ratingCount: restaurant.ratingCount,
    avgDeliveryTime: restaurant.avgDeliveryTime,
    deliveryFee: restaurant.deliveryFee,
    minOrderAmount: restaurant.minOrderAmount,
    isPureVeg: restaurant.isPureVeg,
    isOpen: restaurant.isOpen,
    isActive: restaurant.isActive,
    isFeatured: restaurant.isFeatured,
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/restaurants"
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{restaurant.name}</h2>
          <p className="text-sm text-slate-500">{restaurant.area}, {restaurant.city}</p>
        </div>
      </div>

      <RestaurantForm mode="edit" defaultValues={defaultValues} />
    </div>
  )
}
