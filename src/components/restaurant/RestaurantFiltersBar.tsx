'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
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

// Step and bounds for the price stepper
const PRICE_MIN = 0
const PRICE_MAX = 500
const PRICE_STEP = 50
const PRICE_DEFAULT = 200  // pre-filled value when user first activates the filter

interface Props {
  activeFilters: RestaurantFilters
}

export function RestaurantFiltersBar({ activeFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state so the stepper feels instant; URL is updated on each click
  const [maxCost, setMaxCost] = useState<number | null>(
    activeFilters.maxCost ?? null
  )

  // Keep local state in sync when the URL changes (e.g. browser back)
  useEffect(() => {
    setMaxCost(activeFilters.maxCost ?? null)
  }, [activeFilters.maxCost])

  const updateFilter = useCallback(
    (param: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(param, value)
      } else {
        params.delete(param)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const isActive = (param: string, value: string) =>
    searchParams.get(param) === value

  // ── Price stepper helpers ────────────────────────────────────────────────────

  const activatePriceFilter = () => {
    const initial = PRICE_DEFAULT
    setMaxCost(initial)
    updateFilter('maxCost', String(initial))
  }

  const clearPriceFilter = () => {
    setMaxCost(null)
    updateFilter('maxCost', '')
  }

  const stepPrice = (direction: 'up' | 'down') => {
    const current = maxCost ?? PRICE_DEFAULT
    const next =
      direction === 'up'
        ? Math.min(current + PRICE_STEP, PRICE_MAX)
        : Math.max(current - PRICE_STEP, PRICE_MIN)
    setMaxCost(next)
    updateFilter('maxCost', String(next))
  }

  const priceActive = maxCost !== null

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {/* Sort */}
      <div className="relative shrink-0">
        <select
          value={activeFilters.sortBy ?? ''}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="appearance-none bg-white border border-app-border rounded-full px-4 py-2 pr-8 text-sm font-semibold text-app-black focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-gray"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
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
              ? 'bg-brand-primary text-white border-brand-primary'
              : 'bg-white text-app-black border-app-border hover:border-app-black'
          )}
        >
          {chip.label}
        </button>
      ))}

      {/* ── Price range stepper ───────────────────────────────────────────────── */}
      {!priceActive ? (
        // Inactive: single chip to activate
        <button
          onClick={activatePriceFilter}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-app-border bg-white text-app-black hover:border-app-black transition-colors duration-150"
        >
          <span>₹ Budget</span>
        </button>
      ) : (
        // Active: inline stepper pill
        <div className="shrink-0 flex items-center gap-0 rounded-full border border-brand-primary bg-white overflow-hidden">
          {/* Decrement */}
          <button
            onClick={() => stepPrice('down')}
            disabled={maxCost === PRICE_MIN}
            aria-label="Decrease budget"
            className={cn(
              'flex items-center justify-center w-8 h-9 text-lg font-bold transition-colors',
              maxCost === PRICE_MIN
                ? 'text-app-gray-light cursor-not-allowed'
                : 'text-brand-primary hover:bg-brand-primary/10 active:bg-brand-primary/20'
            )}
          >
            −
          </button>

          {/* Value display */}
          <div className="flex items-center gap-1 px-2 select-none">
            <span className="text-xs font-semibold text-app-gray">Under</span>
            <span className="text-sm font-black text-brand-primary">
              {maxCost === PRICE_MAX ? `₹${PRICE_MAX}+` : `₹${maxCost}`}
            </span>
          </div>

          {/* Increment */}
          <button
            onClick={() => stepPrice('up')}
            disabled={maxCost === PRICE_MAX}
            aria-label="Increase budget"
            className={cn(
              'flex items-center justify-center w-8 h-9 text-lg font-bold transition-colors',
              maxCost === PRICE_MAX
                ? 'text-app-gray-light cursor-not-allowed'
                : 'text-brand-primary hover:bg-brand-primary/10 active:bg-brand-primary/20'
            )}
          >
            +
          </button>

          {/* Clear */}
          <button
            onClick={clearPriceFilter}
            aria-label="Clear budget filter"
            className="flex items-center justify-center w-7 h-9 text-app-gray hover:text-app-black transition-colors border-l border-brand-primary/30"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
