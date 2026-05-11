import { adminOrderRepository } from '@server/repositories/admin-order.repository'
import type { AdminOrderFilters, AdminUpdateOrderStatusInput } from '@shared/schemas'
import type { Prisma } from '@prisma/client'
import type { PaginatedResponse } from '@shared/interfaces'

function buildWhere(filters: AdminOrderFilters): Prisma.OrderWhereInput {
  const and: Prisma.OrderWhereInput[] = []

  if (filters.search) {
    const s = filters.search
    and.push({
      OR: [
        { id: { contains: s, mode: 'insensitive' } },
        { user: { name: { contains: s, mode: 'insensitive' } } },
        { user: { email: { contains: s, mode: 'insensitive' } } },
        { restaurant: { name: { contains: s, mode: 'insensitive' } } },
      ],
    })
  }

  if (filters.status !== 'all') and.push({ status: filters.status as Prisma.EnumOrderStatusFilter })
  if (filters.paymentStatus !== 'all') and.push({ paymentStatus: filters.paymentStatus as Prisma.EnumPaymentStatusFilter })
  if (filters.paymentMode !== 'all') and.push({ paymentMode: filters.paymentMode as Prisma.EnumPaymentModeFilter })
  if (filters.restaurantId) and.push({ restaurantId: filters.restaurantId })
  if (filters.city) and.push({ restaurant: { city: { equals: filters.city, mode: 'insensitive' } } })

  if (filters.dateFrom || filters.dateTo) {
    const dateFilter: Prisma.DateTimeFilter = {}
    if (filters.dateFrom) dateFilter.gte = new Date(filters.dateFrom)
    if (filters.dateTo) {
      const to = new Date(filters.dateTo)
      to.setHours(23, 59, 59, 999)
      dateFilter.lte = to
    }
    and.push({ createdAt: dateFilter })
  }

  return and.length ? { AND: and } : {}
}

function buildOrderBy(sort: string): Prisma.OrderOrderByWithRelationInput {
  switch (sort) {
    case 'oldest': return { createdAt: 'asc' }
    case 'total_desc': return { total: 'desc' }
    case 'total_asc': return { total: 'asc' }
    default: return { createdAt: 'desc' }
  }
}

export const adminOrderService = {
  listOrders: async (filters: AdminOrderFilters): Promise<PaginatedResponse<Record<string, unknown>>> => {
    const { page, limit } = filters
    const skip = (page - 1) * limit
    const where = buildWhere(filters)
    const orderBy = buildOrderBy(filters.sort)

    const [items, total] = await Promise.all([
      adminOrderRepository.findMany(where, orderBy, skip, limit),
      adminOrderRepository.count(where),
    ])

    return { items: items as Record<string, unknown>[], total, page, limit, hasMore: page * limit < total }
  },

  findById: async (id: string) => {
    const order = await adminOrderRepository.findById(id)
    if (!order) throw new Error('Order not found.')
    return order
  },

  updateStatus: async (id: string, input: AdminUpdateOrderStatusInput) => {
    const existing = await adminOrderRepository.findById(id)
    if (!existing) throw new Error('Order not found.')
    return adminOrderRepository.updateStatus(id, input.status, input.note)
  },

  getStats: () => adminOrderRepository.getStats(),
}
