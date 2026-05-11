import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const adminUserListSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  createdAt: true,
  _count: { select: { orders: true } },
} satisfies Prisma.UserSelect

export const adminUserDetailSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  addresses: {
    select: {
      id: true, label: true, line1: true, line2: true,
      city: true, state: true, pincode: true, isDefault: true,
    },
    orderBy: { isDefault: 'desc' as const },
  },
  orders: {
    select: {
      id: true, status: true, paymentStatus: true,
      total: true, couponCode: true, createdAt: true,
      restaurant: { select: { id: true, name: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: 'desc' as const },
    take: 5,
  },
} satisfies Prisma.UserSelect

export const adminUserRepository = {
  findMany: async (
    where: Prisma.UserWhereInput,
    orderBy: Prisma.UserOrderByWithRelationInput,
    skip: number,
    take: number,
  ) =>
    prisma.user.findMany({ where, orderBy, skip, take, select: adminUserListSelect }),

  count: async (where: Prisma.UserWhereInput) =>
    prisma.user.count({ where }),

  findById: async (id: string) =>
    prisma.user.findUnique({ where: { id }, select: adminUserDetailSelect }),

  // Aggregate total spent (paid orders only) for a batch of user IDs
  getSpendingByUserIds: async (userIds: string[]) =>
    prisma.order.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),

  // Full spending + order count stats for a single user
  getUserStats: async (userId: string) => {
    const [totalOrders, spendingResult, couponsUsed] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.aggregate({
        where: { userId, paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { userId, couponCode: { not: null } },
      }),
    ])
    return {
      totalOrders,
      totalSpent: spendingResult._sum.total ?? 0,
      couponsUsed,
    }
  },

  updateRole: async (id: string, role: 'CUSTOMER' | 'ADMIN') =>
    prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true },
    }),
}
