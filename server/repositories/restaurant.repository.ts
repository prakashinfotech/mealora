import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const restaurantRepository = {
  findMany: async (
    where: Prisma.RestaurantWhereInput,
    orderBy: Prisma.RestaurantOrderByWithRelationInput,
    skip: number,
    take: number
  ) =>
    prisma.restaurant.findMany({ where, orderBy, skip, take }),

  count: async (where: Prisma.RestaurantWhereInput) =>
    prisma.restaurant.count({ where }),

  findById: async (id: string) =>
    prisma.restaurant.findUnique({ where: { id } }),

  findByIdWithMenu: async (id: string) =>
    prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              where: { isActive: true, isAvailable: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    }),

  searchByName: async (query: string, limit = 5) =>
    prisma.restaurant.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { area: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, imageUrl: true, cuisines: true, rating: true, area: true },
      take: limit,
    }),

  getFeatured: async (limit: number, city?: string) =>
    prisma.restaurant.findMany({
      where: {
        isActive: true,
        isOpen: true,
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
      },
      orderBy: { rating: 'desc' },
      take: limit,
    }),

  getTopRated: async (minRating: number, limit: number, city?: string) =>
    prisma.restaurant.findMany({
      where: {
        isActive: true,
        rating: { gte: minRating },
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
      },
      orderBy: { ratingCount: 'desc' },
      take: limit,
    }),
}
