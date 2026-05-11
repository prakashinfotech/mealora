import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { AdminMenuItemInput, UpdateAdminMenuItemInput, UpdateAdminMenuCategoryInput } from '@shared/schemas'

export const adminMenuCategorySelect = {
  id: true,
  restaurantId: true,
  name: true,
  slug: true,
  description: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { items: true } },
} satisfies Prisma.MenuCategorySelect

export const adminMenuItemSelect = {
  id: true,
  categoryId: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  isVeg: true,
  isAvailable: true,
  isActive: true,
  isBestSeller: true,
  isRecommended: true,
  preparationTime: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true } },
} satisfies Prisma.MenuItemSelect

type CreateCategoryData = {
  restaurantId: string
  name: string
  slug: string
  description?: string
  sortOrder: number
  isActive: boolean
}

export const adminMenuRepository = {
  // ─── Categories ──────────────────────────────────────────────────

  findCategories: async (restaurantId: string, isActive?: boolean) =>
    prisma.menuCategory.findMany({
      where: { restaurantId, ...(isActive !== undefined ? { isActive } : {}) },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: adminMenuCategorySelect,
    }),

  findCategoryById: async (id: string, restaurantId: string) =>
    prisma.menuCategory.findFirst({
      where: { id, restaurantId },
      select: adminMenuCategorySelect,
    }),

  findCategoryBySlug: async (slug: string, restaurantId: string) =>
    prisma.menuCategory.findFirst({
      where: { slug, restaurantId },
      select: { id: true },
    }),

  createCategory: async (data: CreateCategoryData) =>
    prisma.menuCategory.create({ data, select: adminMenuCategorySelect }),

  updateCategory: async (id: string, data: UpdateAdminMenuCategoryInput) =>
    prisma.menuCategory.update({ where: { id }, data, select: adminMenuCategorySelect }),

  deleteCategory: async (id: string) =>
    prisma.menuCategory.delete({ where: { id } }),

  // ─── Items ────────────────────────────────────────────────────────

  findItems: async (where: Prisma.MenuItemWhereInput, skip: number, take: number) =>
    prisma.menuItem.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      skip,
      take,
      select: adminMenuItemSelect,
    }),

  countItems: async (where: Prisma.MenuItemWhereInput) =>
    prisma.menuItem.count({ where }),

  findItemById: async (id: string, restaurantId: string) =>
    prisma.menuItem.findFirst({
      where: { id, category: { restaurantId } },
      select: adminMenuItemSelect,
    }),

  createItem: async (data: AdminMenuItemInput) =>
    prisma.menuItem.create({ data, select: adminMenuItemSelect }),

  updateItem: async (id: string, data: UpdateAdminMenuItemInput) =>
    prisma.menuItem.update({ where: { id }, data, select: adminMenuItemSelect }),

  deleteItem: async (id: string) =>
    prisma.menuItem.delete({ where: { id } }),

  // ─── Safety checks ────────────────────────────────────────────────

  countOrderItemsByCategory: async (categoryId: string) =>
    prisma.orderItem.count({ where: { menuItem: { categoryId } } }),

  countOrderItemsByItem: async (menuItemId: string) =>
    prisma.orderItem.count({ where: { menuItemId } }),
}
