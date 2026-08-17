import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSearch } from '@/components/home/HeroSearch'
import { PromoCards } from '@/components/home/PromoCards'
import { CategoryCarousel } from '@/components/home/CategoryCarousel'
import { RestaurantCard } from '@/components/home/RestaurantCard'
import { restaurantService } from '@server/services/restaurant.service'
import { buildRestaurantsUrl } from '@/lib/navigation'
import { DEFAULT_CITY } from '@/lib/cities'
import { CitySync } from '@/components/home/CitySync'
import Link from 'next/link'

interface PageProps {
  searchParams: { city?: string }
}

export default async function HomePage({ searchParams }: PageProps) {
  const city = searchParams.city ?? DEFAULT_CITY
  const [featured, topRated] = await Promise.all([
    restaurantService.getFeatured(8, city),
    restaurantService.getTopRated(4.0, 6, city),
  ])

  return (
    <>
      <CitySync serverCity={city} />
      <Navbar />
      <main className="bg-white">
        {/* Hero + Promo block share the orange background */}
        <HeroSearch />
        <PromoCards />

        {/* Category carousel */}
        <CategoryCarousel />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <hr className="border-app-border" />
        </div>

        {/* Featured Restaurants */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-app-black">Restaurants in {city}</h2>
              <p className="text-sm text-app-gray mt-0.5">Discover the best food &amp; drinks</p>
            </div>
            <Link
              href={buildRestaurantsUrl({ city })}
              className="text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-colors flex items-center gap-1"
            >
              See all →
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16 bg-app-gray-bg rounded-2xl">
              <p className="text-lg font-bold text-app-black">No restaurants found</p>
              <p className="text-sm text-app-gray mt-1">Run the seed script to populate data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <hr className="border-app-border" />
        </div>

        {/* Top Rated */}
        {topRated.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-app-black">Top rated in {city}</h2>
                <p className="text-sm text-app-gray mt-0.5">Highest rated restaurants in {city}</p>
              </div>
              <Link
                href={buildRestaurantsUrl({ city, sortBy: 'rating' })}
                className="text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-colors flex items-center gap-1"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {topRated.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <hr className="border-app-border" />
        </div>

        {/* Partner CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-brand-primary rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -left-4 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-black text-white">Partner with us</h3>
              <p className="text-orange-100 text-sm mt-1">
                Register your restaurant and reach millions of hungry customers.
              </p>
            </div>
            <Link
              href="#"
              className="relative shrink-0 bg-white text-brand-primary font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-md"
            >
              Register your restaurant →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
