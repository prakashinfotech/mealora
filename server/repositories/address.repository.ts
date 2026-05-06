import { prisma } from '@/lib/prisma'
import type { CreateAddressInput } from '@shared/interfaces'

export const addressRepository = {
  findByUser: async (userId: string) =>
    prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    }),

  findById: async (id: string) =>
    prisma.address.findUnique({ where: { id } }),

  clearDefaults: async (userId: string) =>
    prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),

  create: async (userId: string, input: CreateAddressInput) =>
    prisma.address.create({
      data: { userId, ...input },
    }),
}
