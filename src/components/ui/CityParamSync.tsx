'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCityStore } from '@/store/cityStore'
import { getCityEntry } from '@/lib/cities'

// Reads ?city= from the URL on every navigation and syncs it into the Zustand
// city store so the navbar, hero, and all client components stay consistent
// with whatever city the URL (and therefore the server data) is using.
function CityParamSyncInner() {
  const searchParams = useSearchParams()
  const setCity = useCityStore((s) => s.setCity)
  const cityParam = searchParams.get('city')

  useEffect(() => {
    if (!cityParam) return
    if (!getCityEntry(cityParam)) return // ignore unknown / malformed values
    setCity(cityParam)
  }, [cityParam, setCity])

  return null
}

export function CityParamSync() {
  return (
    <Suspense fallback={null}>
      <CityParamSyncInner />
    </Suspense>
  )
}
