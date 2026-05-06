import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { OrderStatus } from '@shared/interfaces'

const orderInclude = {
  restaurant: { select: { id: true, name: true, imageUrl: true, area: true } },
  address: true,
  items: true,
  timeline: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.OrderInclude

export const orderRepository = {
  findByUser: async (userId: string) =>
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true, imageUrl: true, area: true } },
        items: { select: { name: true, quantity: true } },
      },
    }),

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
