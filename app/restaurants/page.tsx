import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RestaurantCard } from '@/components/home/RestaurantCard'
import { RestaurantFiltersBar } from '@/components/restaurant/RestaurantFiltersBar'
import { prisma } from '@/lib/prisma'
import type { RestaurantFilters } from '@/types'
import type { Prisma } from '@prisma/client'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getRestaurants(filters: RestaurantFilters) {
  const where: Prisma.RestaurantWhereInput = {}

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { cuisines: { has: filters.search } },
      { area: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters.cuisine) {
    where.cuisines = { hasSome: [filters.cuisine] }
  }

  if (filters.rating) {
    where.rating = { gte: filters.rating }
  }

  if (filters.maxDeliveryTime) {
    where.avgDeliveryTime = { lte: filters.maxDeliveryTime }
  }

  if (filters.isPureVeg === true) {
    where.isPureVeg = true
  }

  const orderByMap: Record<string, Prisma.RestaurantOrderByWithRelationInput> = {
    rating: { rating: 'desc' },
    delivery_time: { avgDeliveryTime: 'asc' },
    cost_low: { deliveryFee: 'asc' },
    cost_high: { deliveryFee: 'desc' },
  }

  const orderBy: Prisma.RestaurantOrderByWithRelationInput = filters.sortBy
    ? (orderByMap[filters.sortBy] ?? { rating: 'desc' })
    : { rating: 'desc' }

  const page = filters.page ?? 1
  const limit = filters.limit ?? 12

  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.restaurant.count({ where }),
  ])

  return { restaurants, total, page, limit }
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const filters: RestaurantFilters = {
    search: searchParams.search as string | undefined,
    cuisine: searchParams.cuisine as string | undefined,
    rating: searchParams.rating ? Number(searchParams.rating) : undefined,
    maxDeliveryTime: searchParams.maxDeliveryTime ? Number(searchParams.maxDeliveryTime) : undefined,
    isPureVeg: searchParams.isPureVeg === 'true',
    sortBy: searchParams.sortBy as RestaurantFilters['sortBy'],
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: 12,
  }

  const { restaurants, total, page, limit } = await getRestaurants(filters)
  const hasMore = page * limit < total

  const heading = filters.search
    ? `Results for "${filters.search}"`
    : filters.cuisine
    ? `${filters.cuisine} restaurants`
    : 'Restaurants near you'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-swiggy-gray-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-swiggy-black">{heading}</h1>
            <p className="text-swiggy-gray text-sm mt-1">{total} restaurants</p>
          </div>

          {/* Filters */}
          <RestaurantFiltersBar activeFilters={filters} />

          {/* Grid */}
          {restaurants.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl mt-6">
              <span className="text-5xl">😕</span>
              <p className="text-lg font-bold text-swiggy-black mt-4">No restaurants found</p>
              <p className="text-swiggy-gray text-sm mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
                {restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>

              {/* Load more / pagination hint */}
              {hasMore && (
                <div className="text-center mt-10">
                  <p className="text-swiggy-gray text-sm">
                    Showing {restaurants.length} of {total} restaurants
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
