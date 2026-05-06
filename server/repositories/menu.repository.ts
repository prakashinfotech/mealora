import { prisma } from '@/lib/prisma'

export const menuRepository = {
  searchItems: async (query: string, limit = 8) =>
    prisma.menuItem.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        isAvailable: true,
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
