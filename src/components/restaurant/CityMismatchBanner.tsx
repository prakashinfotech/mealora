'use client'

import Link from 'next/link'
import { useCityStore } from '@/store/cityStore'

interface Props {
  restaurantCity: string
}

export function CityMismatchBanner({ restaurantCity }: Props) {
  const currentCity = useCityStore((s) => s.city)

  if (currentCity.toLowerCase() === restaurantCity.toLowerCase()) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Heads up!</span> This restaurant is in{' '}
          <span className="font-semibold">{restaurantCity}</span>, but you&apos;re browsing{' '}
          <span className="font-semibold">{currentCity}</span>.
        </p>
        <Link
          href={`/restaurants?city=${encodeURIComponent(currentCity)}`}
          className="shrink-0 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-colors"
        >
          Browse {currentCity} restaurants →
        </Link>
      </div>
    </div>
  )
}
