import { restaurantRepository } from '@server/repositories/restaurant.repository'
import { menuRepository } from '@server/repositories/menu.repository'
import type { RestaurantFilters, PaginatedResponse, IRestaurant } from '@shared/interfaces'
import type { Prisma } from '@prisma/client'
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '@shared/constants'
import { toTitleCase } from '@shared/helpers'

const ORDER_BY_MAP: Record<string, Prisma.RestaurantOrderByWithRelationInput> = {
  rating: { rating: 'desc' },
  delivery_time: { avgDeliveryTime: 'asc' },
  cost_low: { deliveryFee: 'asc' },
  cost_high: { deliveryFee: 'desc' },
}

function buildWhereClause(filters: RestaurantFilters): Prisma.RestaurantWhereInput {
  const where: Prisma.RestaurantWhereInput = { isActive: true }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { area: { contains: filters.search, mode: 'insensitive' } },
      { cuisines: { hasSome: [filters.search] } },
    ]
  }

  if (filters.cuisine) {
    const normalized = toTitleCase(filters.cuisine)
    // hasSome is case-sensitive; normalize input + broaden to category name match
    const cuisineOr: Prisma.RestaurantWhereInput[] = [
      { cuisines: { hasSome: [normalized] } },
      { categories: { some: { name: { contains: filters.cuisine, mode: 'insensitive' } } } },
    ]
    if (normalized !== filters.cuisine) cuisineOr.push({ cuisines: { hasSome: [filters.cuisine] } })
    where.AND = [{ OR: cuisineOr }]
  }
  if (filters.rating) where.rating = { gte: filters.rating }
  if (filters.maxDeliveryTime) where.avgDeliveryTime = { lte: filters.maxDeliveryTime }
  if (filters.isPureVeg === true) where.isPureVeg = true
  if (filters.city) where.city = { equals: filters.city, mode: 'insensitive' }
  if (filters.maxCost != null) where.minOrderAmount = { lte: filters.maxCost }

  return where
}

export const restaurantService = {
  list: async (
    filters: RestaurantFilters
  ): Promise<PaginatedResponse<IRestaurant>> => {
    const page = filters.page ?? 1
    const limit = Math.min(filters.limit ?? DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT)
    const where = buildWhereClause(filters)
    const orderBy: Prisma.RestaurantOrderByWithRelationInput =
      (filters.sortBy ? ORDER_BY_MAP[filters.sortBy] : undefined) ?? { rating: 'desc' }

    const [items, total] = await Promise.all([
      restaurantRepository.findMany(where, orderBy, (page - 1) * limit, limit),
      restaurantRepository.count(where),
    ])

    return { items, total, page, limit, hasMore: page * limit < total }
  },

  findById: async (id: string) =>
    restaurantRepository.findById(id),

  findByIdWithMenu: async (id: string) =>
    restaurantRepository.findByIdWithMenu(id),

  search: async (query: string) => {
    if (!query || query.length < 2) return { restaurants: [], menuItems: [] }

    const [restaurants, menuItems] = await Promise.all([
      restaurantRepository.searchByName(query),
      menuRepository.searchItems(query),
    ])

    return { restaurants, menuItems }
  },

  getFeatured: async (limit = 8, city?: string) =>
    restaurantRepository.getFeatured(limit, city),

  getTopRated: async (minRating = 4.0, limit = 6, city?: string) =>
    restaurantRepository.getTopRated(minRating, limit, city),
}
