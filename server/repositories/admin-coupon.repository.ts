import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const adminCouponSelect = {
  id: true,
  code: true,
  title: true,
  description: true,
  discountType: true,
  discountValue: true,
  minOrderAmount: true,
  maxDiscount: true,
  isActive: true,
  expiresAt: true,
  usageLimit: true,
  usedCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CouponSelect

export const adminCouponRepository = {
  findMany: async (
    where: Prisma.CouponWhereInput,
    orderBy: Prisma.CouponOrderByWithRelationInput,
    skip: number,
    take: number,
  ) =>
    prisma.coupon.findMany({ where, orderBy, skip, take, select: adminCouponSelect }),

  count: async (where: Prisma.CouponWhereInput) =>
    prisma.coupon.count({ where }),

  findById: async (id: string) =>
    prisma.coupon.findUnique({ where: { id }, select: adminCouponSelect }),

  findByCode: async (code: string) =>
    prisma.coupon.findUnique({ where: { code }, select: { id: true, code: true } }),

  create: async (data: {
    code: string
    title: string
    description?: string
    discountType: 'PERCENTAGE' | 'FLAT'
    discountValue: number
    minOrderAmount?: number
    maxDiscount?: number
    isActive?: boolean
    expiresAt?: Date
    usageLimit?: number
  }) =>
    prisma.coupon.create({
      data: {
        code: data.code,
        title: data.title,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscount,
        isActive: data.isActive ?? true,
        expiresAt: data.expiresAt,
        usageLimit: data.usageLimit,
      },
      select: adminCouponSelect,
    }),

  update: async (id: string, data: {
    code?: string
    title?: string
    description?: string
    discountType?: 'PERCENTAGE' | 'FLAT'
    discountValue?: number
    minOrderAmount?: number
    maxDiscount?: number
    isActive?: boolean
    expiresAt?: Date | null
    usageLimit?: number
  }) =>
    prisma.coupon.update({
      where: { id },
      data: {
        ...(data.code !== undefined && { code: data.code }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.discountType !== undefined && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.minOrderAmount !== undefined && { minOrderAmount: data.minOrderAmount }),
        ...(data.maxDiscount !== undefined && { maxDiscount: data.maxDiscount }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...('expiresAt' in data && { expiresAt: data.expiresAt }),
        ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
      },
      select: adminCouponSelect,
    }),

  setActive: async (id: string, isActive: boolean) =>
    prisma.coupon.update({
      where: { id },
      data: { isActive },
      select: { id: true, isActive: true },
    }),
}
