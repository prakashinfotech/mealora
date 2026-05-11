import { adminRestaurantRepository } from '@server/repositories/admin-restaurant.repository'
import { slugify } from '@shared/helpers'
import type { AdminRestaurantInput, UpdateAdminRestaurantInput, AdminRestaurantFilters } from '@shared/schemas'
import type { Prisma } from '@prisma/client'
import type { PaginatedResponse } from '@shared/interfaces'

function buildWhere(filters: AdminRestaurantFilters): Prisma.RestaurantWhereInput {
  const where: Prisma.RestaurantWhereInput = {}

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { area: { contains: filters.search, mode: 'insensitive' } },
      { city: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters.city) {
    where.city = { equals: filters.city, mode: 'insensitive' }
  }

  if (filters.isActive === 'true') where.isActive = true
  if (filters.isActive === 'false') where.isActive = false
  // 'all' → no filter

  return where
}

export const adminRestaurantService = {
  list: async (filters: AdminRestaurantFilters): Promise<PaginatedResponse<Record<string, unknown>>> => {
    const { page, limit } = filters
    const skip = (page - 1) * limit
    const where = buildWhere(filters)

    const [items, total] = await Promise.all([
      adminRestaurantRepository.findMany(where, skip, limit),
      adminRestaurantRepository.count(where),
    ])

    return { items: items as Record<string, unknown>[], total, page, limit, hasMore: page * limit < total }
  },

  findById: async (id: string) => {
    const restaurant = await adminRestaurantRepository.findById(id)
    if (!restaurant) throw new Error('Restaurant not found.')
    return restaurant
  },

  create: async (input: AdminRestaurantInput) => {
    // Ensure slug is unique; auto-append suffix if needed
    const baseSlug = input.slug || slugify(input.name)
    let slug = baseSlug
    let suffix = 1

    while (await adminRestaurantRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${suffix}`
      suffix++
    }

    return adminRestaurantRepository.create({ ...input, slug })
  },

  update: async (id: string, input: UpdateAdminRestaurantInput) => {
    // If slug is being changed, verify it's not taken by another restaurant
    if (input.slug) {
      const existing = await adminRestaurantRepository.findBySlug(input.slug)
      if (existing && existing.id !== id) {
        throw new Error('Slug is already in use by another restaurant.')
      }
    }
    return adminRestaurantRepository.update(id, input)
  },

  setActive: async (id: string, isActive: boolean) => {
    const restaurant = await adminRestaurantRepository.findById(id)
    if (!restaurant) throw new Error('Restaurant not found.')
    return adminRestaurantRepository.setActive(id, isActive)
  },

  getStats: () => adminRestaurantRepository.getStats(),
}
