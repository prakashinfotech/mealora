import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RestaurantHeader } from '@/components/restaurant/RestaurantHeader'
import { MenuSection } from '@/components/restaurant/MenuSection'
import { CategoryNav } from '@/components/restaurant/CategoryNav'
import { CityMismatchBanner } from '@/components/restaurant/CityMismatchBanner'
import { CartFloatingBar } from '@/components/restaurant/CartFloatingBar'
import { restaurantService } from '@server/services/restaurant.service'
import type { Metadata } from 'next'
import type { MenuCategoryWithItems } from '@/types'

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

// Merge same-named categories so duplicate seed data doesn't create duplicate sections
function mergeCategories(categories: MenuCategoryWithItems[]): MenuCategoryWithItems[] {
  const seen = new Map<string, MenuCategoryWithItems>()
  const order: string[] = []

  for (const cat of categories) {
    if (cat.items.length === 0) continue
    const key = cat.name.toLowerCase().trim()
    if (seen.has(key)) {
      const existing = seen.get(key)!
      existing.items = [...existing.items, ...cat.items]
    } else {
      seen.set(key, { ...cat, items: [...cat.items] })
      order.push(key)
    }
  }

  return order.map((k) => seen.get(k)!)
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const restaurant = await restaurantService.findByIdWithMenu(params.id)

  if (!restaurant) notFound()

  const categories = mergeCategories(restaurant.categories)

  return (
    <>
      <Navbar />
      <CityMismatchBanner restaurantCity={restaurant.city} />
      <main className="bg-app-gray-bg pb-24">
        <RestaurantHeader restaurant={restaurant} />

        {/* Sticky category jump nav */}
        <CategoryNav categories={categories.map((c) => ({ id: c.id, name: c.name }))} />

        {/* Menu */}
        <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-6 pb-4">
          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl text-center py-20">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-base font-bold text-app-black">No menu items available</p>
              <p className="text-sm text-app-gray mt-1">Check back soon — the kitchen is warming up!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              {categories.map((cat) => (
                <MenuSection
                  key={cat.id}
                  category={cat}
                  restaurant={{ id: restaurant.id, name: restaurant.name }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CartFloatingBar />
      <Footer />
    </>
  )
}
