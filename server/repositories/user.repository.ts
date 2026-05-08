import { prisma } from '@/lib/prisma'

export const userRepository = {
  findByEmail: async (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findById: async (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, image: true, role: true, createdAt: true },
    }),

  create: async (data: { name: string; email: string; password: string; phone?: string }) =>
    prisma.user.create({
      data,
      select: { id: true, name: true, email: true },
    }),

  update: async (id: string, data: { name?: string; phone?: string | null }) =>
    prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, image: true, createdAt: true },
    }),
}
