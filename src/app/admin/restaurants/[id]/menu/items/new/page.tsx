import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'
import { adminMenuService } from '@server/services/admin-menu.service'
import { ItemForm } from '@/components/admin/menu/ItemForm'
import { MenuBreadcrumb } from '@/components/admin/menu/MenuBreadcrumb'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  return { title: 'Add Menu Item' }
}

export default async function NewMenuItemPage({ params }: Props) {
  let restaurant
  try {
    restaurant = await adminRestaurantService.findById(params.id)
  } catch {
    notFound()
  }

  const allCategories = await adminMenuService.listCategories(params.id, { isActive: 'all' })
  const categories = allCategories.map((c) => ({ id: c.id, name: c.name }))

  return (
    <div className="max-w-3xl">
      <MenuBreadcrumb
        restaurantId={params.id}
        restaurantName={restaurant.name}
        section="Add Item"
      />

      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/admin/restaurants/${params.id}/menu/items`}
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Add Menu Item</h2>
          <p className="text-sm text-slate-500">{restaurant.name}</p>
        </div>
      </div>

      <ItemForm mode="create" restaurantId={params.id} categories={categories} />
    </div>
  )
}
