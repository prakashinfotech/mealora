import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CITIES, DEFAULT_CITY, getCityEntry } from '@/lib/cities'

interface CityState {
  city: string
  stateAbbr: string
  setCity: (name: string) => void
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      city: DEFAULT_CITY,
      stateAbbr: getCityEntry(DEFAULT_CITY)?.state ?? 'KA',
      setCity: (name: string) => {
        const entry = getCityEntry(name)
        set({ city: name, stateAbbr: entry?.state ?? '' })
      },
    }),
    { name: 'swiggy-city' }
  )
)

export { CITIES }
