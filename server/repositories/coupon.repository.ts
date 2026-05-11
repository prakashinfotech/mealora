import { prisma } from '@/lib/prisma'

export const couponRepository = {
  findByCode: async (code: string) =>
    prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), isActive: true },
    }),

  findAll: async () =>
    prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { discountValue: 'desc' },
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        discountType: true,
        discountValue: true,
        minOrderAmount: true,
        maxDiscount: true,
        expiresAt: true,
      },
    }),
}
