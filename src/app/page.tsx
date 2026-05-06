import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSearch } from '@/components/home/HeroSearch'
import { CategoryCarousel } from '@/components/home/CategoryCarousel'
import { RestaurantCard } from '@/components/home/RestaurantCard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getFeaturedRestaurants() {
  try {
    return await prisma.restaurant.findMany({
      where: { isOpen: true },
      orderBy: { rating: 'desc' },
      take: 8,
    })
  } catch {
    return []
  }
}

async function getTopRatedRestaurants() {
  try {
    return await prisma.restaurant.findMany({
      where: { rating: { gte: 4.0 } },
      orderBy: { ratingCount: 'desc' },
      take: 6,
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featured, topRated] = await Promise.all([
    getFeaturedRestaurants(),
    getTopRatedRestaurants(),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <HeroSearch />
        <CategoryCarousel />

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
          <hr className="border-swiggy-border" />
        </div>

        {/* Featured Restaurants */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Restaurants near you</h2>
            <Link href="/restaurants" className="text-sm font-semibold text-brand-orange hover:underline">
              See all
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16 text-swiggy-gray">
              <p className="text-lg font-medium">No restaurants found</p>
              <p className="text-sm mt-1">Run the seed script to populate data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </section>

        {/* Top Rated */}
        {topRated.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
            <h2 className="section-title mb-6">Top rated near you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {topRated.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-14 mb-4">
          <div className="bg-brand-orange-light rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-swiggy-black">Partner with us</h3>
              <p className="text-swiggy-gray text-sm mt-1">Register your restaurant and grow with Swiggy.</p>
            </div>
            <Link href="#" className="btn-primary shrink-0">
              Register your restaurant
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
