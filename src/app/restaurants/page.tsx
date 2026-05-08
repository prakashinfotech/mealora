import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RestaurantCard } from '@/components/home/RestaurantCard'
import { RestaurantFiltersBar } from '@/components/restaurant/RestaurantFiltersBar'
import { restaurantService } from '@server/services/restaurant.service'
import type { RestaurantFilters } from '@shared/interfaces'
import { toTitleCase } from '@/lib/utils'
import { DEFAULT_CITY } from '@/lib/cities'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

function buildPageUrl(searchParams: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams()
  for (const [key, val] of Object.entries(searchParams)) {
    if (val && key !== 'page') params.set(key, String(val))
  }
  params.set('page', String(page))
  return `/restaurants?${params.toString()}`
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const filters: RestaurantFilters = {
    search: searchParams.search as string | undefined,
    cuisine: searchParams.cuisine as string | undefined,
    city: searchParams.city as string | undefined,
    rating: searchParams.rating ? Number(searchParams.rating) : undefined,
    maxDeliveryTime: searchParams.maxDeliveryTime ? Number(searchParams.maxDeliveryTime) : undefined,
    isPureVeg: searchParams.isPureVeg === 'true',
    sortBy: searchParams.sortBy as RestaurantFilters['sortBy'],
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: 12,
  }

  const { items: restaurants, total, page, limit, hasMore } = await restaurantService.list(filters)
  const totalPages = Math.ceil(total / limit)

  const cityLabel = filters.city ?? DEFAULT_CITY
  const heading = filters.search
    ? `Results for "${filters.search}"`
    : filters.cuisine
    ? `${toTitleCase(filters.cuisine)} restaurants in ${cityLabel}`
    : `Restaurants in ${cityLabel}`

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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-10">
                  <p className="text-sm text-swiggy-gray">
                    Showing <span className="font-semibold text-swiggy-black">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="font-semibold text-swiggy-black">{total}</span> restaurants
                  </p>

                  <div className="flex items-center gap-2">
                    {page > 1 ? (
                      <Link
                        href={buildPageUrl(searchParams, page - 1)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-swiggy-border bg-white text-swiggy-black hover:border-brand-orange hover:text-brand-orange transition-colors"
                      >
                        ← Prev
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-swiggy-border bg-white text-swiggy-gray-light cursor-not-allowed">
                        ← Prev
                      </span>
                    )}

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                          key={p}
                          href={buildPageUrl(searchParams, p)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                            p === page
                              ? 'bg-brand-orange text-white'
                              : 'border border-swiggy-border bg-white text-swiggy-black hover:border-brand-orange hover:text-brand-orange'
                          }`}
                        >
                          {p}
                        </Link>
                      ))}
                    </div>

                    {hasMore ? (
                      <Link
                        href={buildPageUrl(searchParams, page + 1)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-swiggy-border bg-white text-swiggy-black hover:border-brand-orange hover:text-brand-orange transition-colors"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-swiggy-border bg-white text-swiggy-gray-light cursor-not-allowed">
                        Next →
                      </span>
                    )}
                  </div>
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
