import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CITIES, DEFAULT_CITY, getCityEntry } from '@/lib/cities'

interface CityState {
  city: string
  stateAbbr: string
  _hasHydrated: boolean
  setCity: (name: string) => void
  setHasHydrated: (v: boolean) => void
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      city: DEFAULT_CITY,
      stateAbbr: getCityEntry(DEFAULT_CITY)?.state ?? 'KA',
      _hasHydrated: false,
      setCity: (name: string) => {
        const entry = getCityEntry(name)
        set({ city: name, stateAbbr: entry?.state ?? '' })
      },
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
    }),
    {
      name: 'swiggy-city',
      // Only persist city data — _hasHydrated must always start false
      partialize: (state) => ({ city: state.city, stateAbbr: state.stateAbbr }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export { CITIES }
