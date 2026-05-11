import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'
import { adminMenuService } from '@server/services/admin-menu.service'
import { ItemListClient } from '@/components/admin/menu/ItemListClient'
import { MenuBreadcrumb } from '@/components/admin/menu/MenuBreadcrumb'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  return { title: 'Menu Items' }
}

export default async function MenuItemsPage({ params }: Props) {
  let restaurant
  try {
    restaurant = await adminRestaurantService.findById(params.id)
  } catch {
    notFound()
  }

  const allCategories = await adminMenuService.listCategories(params.id, { isActive: 'all' })
  const categories = allCategories.map((c) => ({ id: c.id, name: c.name }))

  return (
    <div className="max-w-7xl">
      <MenuBreadcrumb
        restaurantId={params.id}
        restaurantName={restaurant.name}
        section="Items"
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/restaurants/${params.id}/menu`}
            className="text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Menu Items</h2>
            <p className="text-sm text-slate-500">{restaurant.name}</p>
          </div>
        </div>

        <Link
          href={`/admin/restaurants/${params.id}/menu/items/new`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Item
        </Link>
      </div>

      {categories.length === 0 && (
        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          No categories yet.{' '}
          <Link
            href={`/admin/restaurants/${params.id}/menu/categories`}
            className="font-semibold underline"
          >
            Create a category first
          </Link>{' '}
          before adding items.
        </div>
      )}

      <ItemListClient restaurantId={params.id} categories={categories} />
    </div>
  )
}
