// Centralised URL builders — every navigation link goes through here so city
// is never silently dropped.

export interface RestaurantsUrlParams {
  city?: string
  cuisine?: string
  search?: string
  sortBy?: string
  rating?: string | number
  maxDeliveryTime?: string | number
  isPureVeg?: boolean
  page?: number
}

export function buildRestaurantsUrl(params: RestaurantsUrlParams = {}): string {
  const p = new URLSearchParams()
  if (params.city) p.set('city', params.city)
  if (params.cuisine) p.set('cuisine', params.cuisine)
  if (params.search) p.set('search', params.search)
  if (params.sortBy) p.set('sortBy', params.sortBy)
  if (params.rating != null) p.set('rating', String(params.rating))
  if (params.maxDeliveryTime != null) p.set('maxDeliveryTime', String(params.maxDeliveryTime))
  if (params.isPureVeg) p.set('isPureVeg', 'true')
  if (params.page && params.page > 1) p.set('page', String(params.page))
  const qs = p.toString()
  return qs ? `/restaurants?${qs}` : '/restaurants'
}

export function buildRestaurantDetailUrl(id: string): string {
  return `/restaurants/${id}`
}
