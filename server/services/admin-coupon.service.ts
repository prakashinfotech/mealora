import { adminCouponRepository } from '@server/repositories/admin-coupon.repository'
import type { AdminCouponInput, UpdateAdminCouponInput, AdminCouponFilters } from '@shared/schemas'
import type { Prisma } from '@prisma/client'
import type { PaginatedResponse } from '@shared/interfaces'

function buildWhere(filters: AdminCouponFilters): Prisma.CouponWhereInput {
  const and: Prisma.CouponWhereInput[] = []

  if (filters.search) {
    and.push({
      OR: [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { title: { contains: filters.search, mode: 'insensitive' } },
      ],
    })
  }

  if (filters.isActive !== 'all') and.push({ isActive: filters.isActive === 'true' })
  if (filters.discountType !== 'all') and.push({ discountType: filters.discountType as 'PERCENTAGE' | 'FLAT' })

  if (filters.expired === 'true') {
    and.push({ expiresAt: { lt: new Date() } })
  } else if (filters.expired === 'false') {
    and.push({ OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] })
  }

  return and.length ? { AND: and } : {}
}

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  return new Date(value)
}

export const adminCouponService = {
  list: async (filters: AdminCouponFilters): Promise<PaginatedResponse<Record<string, unknown>>> => {
    const { page, limit } = filters
    const skip = (page - 1) * limit
    const where = buildWhere(filters)

    const [items, total] = await Promise.all([
      adminCouponRepository.findMany(where, { createdAt: 'desc' }, skip, limit),
      adminCouponRepository.count(where),
    ])

    return { items: items as Record<string, unknown>[], total, page, limit, hasMore: page * limit < total }
  },

  findById: async (id: string) => {
    const coupon = await adminCouponRepository.findById(id)
    if (!coupon) throw new Error('Coupon not found.')
    return coupon
  },

  create: async (input: AdminCouponInput) => {
    const existing = await adminCouponRepository.findByCode(input.code)
    if (existing) throw new Error(`Coupon code "${input.code}" is already in use.`)

    return adminCouponRepository.create({
      ...input,
      expiresAt: toDate(input.expiresAt),
    })
  },

  update: async (id: string, input: UpdateAdminCouponInput) => {
    const coupon = await adminCouponRepository.findById(id)
    if (!coupon) throw new Error('Coupon not found.')

    if (input.code && input.code !== coupon.code) {
      const conflict = await adminCouponRepository.findByCode(input.code)
      if (conflict && conflict.id !== id) {
        throw new Error(`Coupon code "${input.code}" is already in use.`)
      }
    }

    // expiresAt: explicit empty string from form → null (clear expiry)
    const expiresAt = 'expiresAt' in input
      ? (input.expiresAt ? new Date(input.expiresAt) : null)
      : undefined

    return adminCouponRepository.update(id, { ...input, expiresAt })
  },

  setActive: async (id: string, isActive: boolean) => {
    const coupon = await adminCouponRepository.findById(id)
    if (!coupon) throw new Error('Coupon not found.')
    return adminCouponRepository.setActive(id, isActive)
  },
}
