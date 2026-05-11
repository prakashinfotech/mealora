import { prisma } from '@/lib/prisma'

export const menuRepository = {
  findByIds: async (ids: string[]) =>
    prisma.menuItem.findMany({
      where: { id: { in: ids }, isAvailable: true },
      select: { id: true, name: true, price: true },
    }),

  searchItems: async (query: string, limit = 8) =>
    prisma.menuItem.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        isAvailable: true,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        isVeg: true,
        category: {
          select: {
            restaurantId: true,
            restaurant: { select: { id: true, name: true } },
          },
        },
      },
      take: limit,
    }),
}
