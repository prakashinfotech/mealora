import Link from 'next/link'
import { RestaurantForm } from '@/components/admin/restaurants/RestaurantForm'

export const metadata = { title: 'Add Restaurant' }

export default function NewRestaurantPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/restaurants"
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Add Restaurant</h2>
          <p className="text-sm text-slate-500">Fill in the details to list a new restaurant.</p>
        </div>
      </div>

      <RestaurantForm mode="create" />
    </div>
  )
}
