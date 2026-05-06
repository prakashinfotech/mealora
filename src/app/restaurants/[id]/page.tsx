import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RestaurantHeader } from '@/components/restaurant/RestaurantHeader'
import { MenuSection } from '@/components/restaurant/MenuSection'
import { CartFloatingBar } from '@/components/restaurant/CartFloatingBar'
import { restaurantService } from '@server/services/restaurant.service'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const restaurant = await restaurantService.findById(params.id)
  if (!restaurant) return {}
  return {
    title: `${restaurant.name} — Order Online`,
    description: `Order ${restaurant.cuisines.join(', ')} from ${restaurant.name} in ${restaurant.area}.`,
  }
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const restaurant = await restaurantService.findByIdWithMenu(params.id)

  if (!restaurant) notFound()

  const categoriesWithItems = restaurant.categories.filter((c) => c.items.length > 0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-swiggy-gray-bg pb-24">
        <RestaurantHeader restaurant={restaurant} />

        {/* Category jump nav */}
        {categoriesWithItems.length > 1 && (
          <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {categoriesWithItems.map((cat) => (
                <a
                  key={cat.id}
                  href={`#category-${cat.id}`}
                  className="shrink-0 px-4 py-1.5 text-xs font-semibold bg-white border border-swiggy-border text-swiggy-black rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="max-w-4xl mx-auto mt-4 bg-white rounded-2xl overflow-hidden shadow-card">
          {categoriesWithItems.length === 0 ? (
            <p className="text-center py-16 text-swiggy-gray text-sm">
              No menu items available right now.
            </p>
          ) : (
            categoriesWithItems.map((cat) => (
              <MenuSection
                key={cat.id}
                category={cat}
                restaurant={{ id: restaurant.id, name: restaurant.name }}
              />
            ))
          )}
        </div>
      </main>

      <CartFloatingBar />
      <Footer />
    </>
  )
}
