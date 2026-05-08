export const CITIES = [
  { name: 'Bangalore', state: 'KA' },
  { name: 'Mumbai',    state: 'MH' },
  { name: 'Delhi',     state: 'DL' },
  { name: 'Hyderabad', state: 'TS' },
  { name: 'Chennai',   state: 'TN' },
  { name: 'Pune',      state: 'MH' },
  { name: 'Ahmedabad', state: 'GJ' },
  { name: 'Vadodara',  state: 'GJ' },
] as const

export type CityEntry = typeof CITIES[number]
export type CityName  = CityEntry['name']

export const DEFAULT_CITY: CityName = 'Bangalore'

export function getCityEntry(name: string): CityEntry | undefined {
  return CITIES.find((c) => c.name === name)
}
