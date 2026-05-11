import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { OrderStatus } from '@shared/interfaces'

// Lightweight select for the list view
export const adminOrderListSelect = {
  id: true,
  status: true,
  paymentMode: true,
  paymentStatus: true,
  total: true,
  discount: true,
  couponCode: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true } },
  restaurant: { select: { id: true, name: true, area: true, city: true } },
  _count: { select: { items: true } },
} satisfies Prisma.OrderSelect

// Full select for the detail view
export const adminOrderDetailSelect = {
  id: true,
  status: true,
  paymentMode: true,
  paymentStatus: true,
  subtotal: true,
  deliveryFee: true,
  taxes: true,
  discount: true,
  total: true,
  couponCode: true,
  otp: true,
  razorpayOrderId: true,
  razorpayPaymentId: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, email: true, phone: true } },
  restaurant: { select: { id: true, name: true, area: true, city: true, imageUrl: true } },
  address: true,
  items: { orderBy: { id: 'asc' as const } },
  timeline: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.OrderSelect

const DEFAULT_STATUS_MESSAGES: Record<string, string> = {
  ACCEPTED: 'Order accepted by restaurant.',
  PREPARING: 'Restaurant is preparing your order.',
  READY: 'Order is ready for pickup.',
  OUT_FOR_DELIVERY: 'Order is out for delivery.',
  DELIVERED: 'Order delivered successfully.',
  CANCELLED: 'Order has been cancelled.',
}

export const adminOrderRepository = {
  findMany: async (
    where: Prisma.OrderWhereInput,
    orderBy: Prisma.OrderOrderByWithRelationInput,
    skip: number,
    take: number,
  ) =>
    prisma.order.findMany({
      where,
      orderBy,
      skip,
      take,
      select: adminOrderListSelect,
    }),

  count: async (where: Prisma.OrderWhereInput) =>
    prisma.order.count({ where }),

  findById: async (id: string) =>
    prisma.order.findUnique({ where: { id }, select: adminOrderDetailSelect }),

  updateStatus: async (id: string, status: OrderStatus, note?: string) =>
    prisma.order.update({
      where: { id },
      data: {
        status,
        timeline: {
          create: {
            status,
            message: note || DEFAULT_STATUS_MESSAGES[status] || undefined,
          },
        },
      },
      select: adminOrderDetailSelect,
    }),

  // Aggregate stats for dashboard
  getStats: async () => {
    const [totalOrders, revenueResult, activeOrders, todayOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.order.count({
        where: { status: { notIn: ['DELIVERED', 'CANCELLED'] } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
    ])
    return {
      totalOrders,
      revenue: revenueResult._sum.total ?? 0,
      activeOrders,
      todayOrders,
    }
  },
}
