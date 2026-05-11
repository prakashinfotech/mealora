import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { OrderStatus, PaginationParams } from '@shared/interfaces'

const orderInclude = {
  restaurant: { select: { id: true, name: true, imageUrl: true, area: true } },
  address: true,
  items: true,
  timeline: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.OrderInclude

export const orderRepository = {
  findByUser: async (userId: string, { page = 1, limit = 10 }: PaginationParams = {}) => {
    const skip = (page - 1) * limit
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          restaurant: { select: { id: true, name: true, imageUrl: true, area: true } },
          items: { select: { name: true, quantity: true } },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ])
    return { orders, total }
  },

  findByIdForUser: async (id: string, userId: string) =>
    prisma.order.findFirst({
      where: { id, userId },
      include: orderInclude,
    }),

  create: async (data: Prisma.OrderUncheckedCreateInput) =>
    prisma.order.create({
      data,
      include: orderInclude,
    }),

  updateStatus: async (id: string, status: OrderStatus, message?: string) =>
    prisma.order.update({
      where: { id },
      data: {
        status,
        timeline: { create: { status, message } },
      },
    }),
}
