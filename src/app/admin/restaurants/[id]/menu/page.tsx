import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'
import { adminMenuService } from '@server/services/admin-menu.service'
import { MenuBreadcrumb } from '@/components/admin/menu/MenuBreadcrumb'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  return { title: 'Menu Management' }
}

export default async function MenuOverviewPage({ params }: Props) {
  let restaurant
  try {
    restaurant = await adminRestaurantService.findById(params.id)
  } catch {
    notFound()
  }

  const categories = await adminMenuService.listCategories(params.id, { isActive: 'all' })
  const totalCategories = categories.length
  const totalItems = categories.reduce((sum, c) => sum + c._count.items, 0)
  const activeCategories = categories.filter((c) => c.isActive).length

  return (
    <div className="max-w-3xl">
      <MenuBreadcrumb restaurantId={params.id} restaurantName={restaurant.name} />

      <div className="flex items-start gap-3 mb-8">
        <Link
          href="/admin/restaurants"
          className="text-slate-400 hover:text-slate-700 transition-colors mt-1"
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Categories', value: totalCategories },
          { label: 'Active Categories', value: activeCategories },
          { label: 'Total Items', value: totalItems },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/admin/restaurants/${params.id}/menu/categories`}
          className="group bg-white rounded-xl border border-slate-200 px-6 py-5 hover:border-brand-orange hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-orange">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="font-semibold text-slate-800">Categories</p>
          <p className="text-xs text-slate-400 mt-0.5">{totalCategories} total</p>
        </Link>

        <Link
          href={`/admin/restaurants/${params.id}/menu/items`}
          className="group bg-white rounded-xl border border-slate-200 px-6 py-5 hover:border-brand-orange hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-orange">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="font-semibold text-slate-800">Menu Items</p>
          <p className="text-xs text-slate-400 mt-0.5">{totalItems} total</p>
        </Link>
      </div>
    </div>
  )
}
