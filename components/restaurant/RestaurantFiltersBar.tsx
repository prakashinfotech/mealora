'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { RestaurantFilters } from '@/types'

interface FilterOption {
  label: string
  param: string
  value: string
}

const SORT_OPTIONS: FilterOption[] = [
  { label: 'Relevance', param: 'sortBy', value: '' },
  { label: 'Rating', param: 'sortBy', value: 'rating' },
  { label: 'Fastest delivery', param: 'sortBy', value: 'delivery_time' },
  { label: 'Cost: Low to High', param: 'sortBy', value: 'cost_low' },
]

const FILTER_CHIPS: FilterOption[] = [
  { label: 'Pure Veg', param: 'isPureVeg', value: 'true' },
  { label: '4.0+ Rating', param: 'rating', value: '4.0' },
  { label: 'Under 30 min', param: 'maxDeliveryTime', value: '30' },
]

interface Props {
  activeFilters: RestaurantFilters
}

export function RestaurantFiltersBar({ activeFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (param: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(param, value)
      } else {
        params.delete(param)
      }
      params.delete('page') // Reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const isActive = (param: string, value: string) => {
    return searchParams.get(param) === value
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {/* Sort */}
      <div className="relative shrink-0">
        <select
          value={activeFilters.sortBy ?? ''}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="appearance-none bg-white border border-swiggy-border rounded-full px-4 py-2 pr-8 text-sm font-semibold text-swiggy-black focus:outline-none focus:ring-2 focus:ring-brand-orange/30 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-swiggy-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Filter chips */}
      {FILTER_CHIPS.map((chip) => (
        <button
          key={chip.label}
          onClick={() =>
            updateFilter(chip.param, isActive(chip.param, chip.value) ? '' : chip.value)
          }
          className={cn(
            'shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-150',
            isActive(chip.param, chip.value)
              ? 'bg-brand-orange text-white border-brand-orange'
              : 'bg-white text-swiggy-black border-swiggy-border hover:border-swiggy-black'
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
