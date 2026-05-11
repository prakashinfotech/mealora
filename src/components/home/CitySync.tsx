'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCityStore } from '@/store/cityStore'

interface Props {
  serverCity: string
}

// Detects a mismatch between what the server rendered (based on URL) and the
// city stored in localStorage (Zustand persist). On mismatch, replaces the URL
// with the correct city so the server re-renders with the user's actual city.
// Renders nothing — purely a side-effect component.
export function CitySync({ serverCity }: Props) {
  const city = useCityStore((s) => s.city)
  const hasHydrated = useCityStore((s) => s._hasHydrated)
  const router = useRouter()

  useEffect(() => {
    if (hasHydrated && city !== serverCity) {
      router.replace(`/?city=${city}`)
    }
  }, [hasHydrated, city, serverCity, router])

  return null
}
