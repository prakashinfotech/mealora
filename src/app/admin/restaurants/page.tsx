import Link from 'next/link'
import { RestaurantListClient } from '@/components/admin/restaurants/RestaurantListClient'

export const metadata = { title: 'Restaurants' }

export default function AdminRestaurantsPage() {
  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Restaurants</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage all listed restaurants.</p>
        </div>
        <Link
          href="/admin/restaurants/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Restaurant
        </Link>
      </div>

      {/* Client component owns all interactive state */}
      <RestaurantListClient />
    </div>
  )
}
