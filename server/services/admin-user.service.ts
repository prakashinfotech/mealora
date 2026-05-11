import { adminUserRepository } from '@server/repositories/admin-user.repository'
import type { AdminUserFilters, AdminUpdateUserRoleInput } from '@shared/schemas'
import type { Prisma } from '@prisma/client'
import type { PaginatedResponse } from '@shared/interfaces'

function buildWhere(filters: AdminUserFilters): Prisma.UserWhereInput {
  const and: Prisma.UserWhereInput[] = []

  if (filters.search) {
    const s = filters.search
    and.push({
      OR: [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ],
    })
  }

  if (filters.role !== 'all') and.push({ role: filters.role as 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN' })

  return and.length ? { AND: and } : {}
}

function buildOrderBy(sort: string): Prisma.UserOrderByWithRelationInput {
  switch (sort) {
    case 'oldest':  return { createdAt: 'asc' }
    case 'name_asc': return { name: 'asc' }
    default:        return { createdAt: 'desc' }
  }
}

export const adminUserService = {
  list: async (filters: AdminUserFilters): Promise<PaginatedResponse<Record<string, unknown>>> => {
    const { page, limit } = filters
    const skip = (page - 1) * limit
    const where = buildWhere(filters)
    const orderBy = buildOrderBy(filters.sort)

    const [users, total] = await Promise.all([
      adminUserRepository.findMany(where, orderBy, skip, limit),
      adminUserRepository.count(where),
    ])

    // Attach total-spent per user with a single grouped aggregate
    const userIds = users.map((u) => u.id)
    const spendingRows = userIds.length
      ? await adminUserRepository.getSpendingByUserIds(userIds)
      : []

    const spendingMap = new Map(spendingRows.map((r) => [r.userId, r._sum.total ?? 0]))

    const items = users.map((u) => ({
      ...u,
      totalSpent: spendingMap.get(u.id) ?? 0,
      createdAt: u.createdAt.toISOString(),
    }))

    return { items: items as Record<string, unknown>[], total, page, limit, hasMore: page * limit < total }
  },

  findById: async (id: string) => {
    const user = await adminUserRepository.findById(id)
    if (!user) throw new Error('User not found.')

    const stats = await adminUserRepository.getUserStats(id)

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      orders: user.orders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
      })),
      addresses: user.addresses,
      stats,
    }
  },

  updateRole: async (id: string, input: AdminUpdateUserRoleInput, requestingUserId: string) => {
    if (id === requestingUserId) {
      throw new Error('You cannot change your own role.')
    }

    const user = await adminUserRepository.findById(id)
    if (!user) throw new Error('User not found.')

    return adminUserRepository.updateRole(id, input.role)
  },
}
