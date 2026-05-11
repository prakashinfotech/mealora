import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { AdminRestaurantInput, UpdateAdminRestaurantInput } from '@shared/schemas'

// Full restaurant shape returned to admin — includes admin-only fields
export const adminRestaurantSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  bannerUrl: true,
  cuisines: true,
  rating: true,
  ratingCount: true,
  avgDeliveryTime: true,
  deliveryFee: true,
  minOrderAmount: true,
  isPureVeg: true,
  isOpen: true,
  isActive: true,
  isFeatured: true,
  city: true,
  area: true,
  address: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RestaurantSelect

export const adminRestaurantRepository = {
  findMany: async (
    where: Prisma.RestaurantWhereInput,
    skip: number,
    take: number,
  ) =>
    prisma.restaurant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: adminRestaurantSelect,
    }),

  count: async (where: Prisma.RestaurantWhereInput) =>
    prisma.restaurant.count({ where }),

  findById: async (id: string) =>
    prisma.restaurant.findUnique({ where: { id }, select: adminRestaurantSelect }),

  findBySlug: async (slug: string) =>
    prisma.restaurant.findUnique({ where: { slug }, select: { id: true } }),

  create: async (data: AdminRestaurantInput) =>
    prisma.restaurant.create({
      data: { ...data, imageUrl: data.imageUrl || '' },
      select: adminRestaurantSelect,
    }),

  update: async (id: string, data: UpdateAdminRestaurantInput) =>
    prisma.restaurant.update({ where: { id }, data, select: adminRestaurantSelect }),

  setActive: async (id: string, isActive: boolean) =>
    prisma.restaurant.update({
      where: { id },
      data: { isActive },
      select: { id: true, isActive: true },
    }),
}
