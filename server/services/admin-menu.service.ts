import { adminMenuRepository } from '@server/repositories/admin-menu.repository'
import { adminRestaurantRepository } from '@server/repositories/admin-restaurant.repository'
import { slugify } from '@shared/helpers'
import type {
  AdminMenuCategoryInput,
  UpdateAdminMenuCategoryInput,
  AdminMenuCategoryFilters,
  AdminMenuItemInput,
  UpdateAdminMenuItemInput,
  AdminMenuItemFilters,
} from '@shared/schemas'
import type { Prisma } from '@prisma/client'
import type { PaginatedResponse } from '@shared/interfaces'

function buildItemWhere(restaurantId: string, filters: AdminMenuItemFilters): Prisma.MenuItemWhereInput {
  const and: Prisma.MenuItemWhereInput[] = [{ category: { restaurantId } }]

  if (filters.search) and.push({ name: { contains: filters.search, mode: 'insensitive' } })
  if (filters.categoryId) and.push({ categoryId: filters.categoryId })
  if (filters.isVeg !== 'all') and.push({ isVeg: filters.isVeg === 'true' })
  if (filters.isActive !== 'all') and.push({ isActive: filters.isActive === 'true' })
  if (filters.isAvailable !== 'all') and.push({ isAvailable: filters.isAvailable === 'true' })

  return { AND: and }
}

export const adminMenuService = {
  // ─── Categories ──────────────────────────────────────────────────

  listCategories: async (restaurantId: string, filters: AdminMenuCategoryFilters) => {
    const isActive =
      filters.isActive === 'all' ? undefined : filters.isActive === 'true'
    return adminMenuRepository.findCategories(restaurantId, isActive)
  },

  findCategoryById: async (id: string, restaurantId: string) => {
    const cat = await adminMenuRepository.findCategoryById(id, restaurantId)
    if (!cat) throw new Error('Category not found.')
    return cat
  },

  createCategory: async (restaurantId: string, input: AdminMenuCategoryInput) => {
    const restaurant = await adminRestaurantRepository.findById(restaurantId)
    if (!restaurant) throw new Error('Restaurant not found.')

    const baseSlug = input.slug || slugify(input.name)
    let slug = baseSlug
    let suffix = 1
    while (await adminMenuRepository.findCategoryBySlug(slug, restaurantId)) {
      slug = `${baseSlug}-${suffix++}`
    }

    return adminMenuRepository.createCategory({
      restaurantId,
      name: input.name,
      slug,
      description: input.description,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
    })
  },

  updateCategory: async (id: string, restaurantId: string, input: UpdateAdminMenuCategoryInput) => {
    const existing = await adminMenuRepository.findCategoryById(id, restaurantId)
    if (!existing) throw new Error('Category not found.')

    let data: UpdateAdminMenuCategoryInput = { ...input }

    if (input.slug && input.slug !== existing.slug) {
      const conflict = await adminMenuRepository.findCategoryBySlug(input.slug, restaurantId)
      if (conflict && conflict.id !== id) {
        throw new Error('Slug is already in use by another category.')
      }
    } else if (!input.slug && input.name && input.name !== existing.name) {
      // Auto-update slug when name changes and slug wasn't explicitly set
      const baseSlug = slugify(input.name)
      let slug = baseSlug
      let suffix = 1
      while (true) {
        const conflict = await adminMenuRepository.findCategoryBySlug(slug, restaurantId)
        if (!conflict || conflict.id === id) break
        slug = `${baseSlug}-${suffix++}`
      }
      data = { ...data, slug }
    }

    return adminMenuRepository.updateCategory(id, data)
  },

  deleteCategory: async (id: string, restaurantId: string) => {
    const category = await adminMenuRepository.findCategoryById(id, restaurantId)
    if (!category) throw new Error('Category not found.')

    const orderCount = await adminMenuRepository.countOrderItemsByCategory(id)
    if (orderCount > 0) {
      throw new Error(
        'Cannot delete this category — it contains items that appear in existing orders. Deactivate it instead.',
      )
    }

    return adminMenuRepository.deleteCategory(id)
  },

  // ─── Items ────────────────────────────────────────────────────────

  listItems: async (
    restaurantId: string,
    filters: AdminMenuItemFilters,
  ): Promise<PaginatedResponse<Record<string, unknown>>> => {
    const { page, limit } = filters
    const skip = (page - 1) * limit
    const where = buildItemWhere(restaurantId, filters)

    const [items, total] = await Promise.all([
      adminMenuRepository.findItems(where, skip, limit),
      adminMenuRepository.countItems(where),
    ])

    return { items: items as Record<string, unknown>[], total, page, limit, hasMore: page * limit < total }
  },

  findItemById: async (id: string, restaurantId: string) => {
    const item = await adminMenuRepository.findItemById(id, restaurantId)
    if (!item) throw new Error('Item not found.')
    return item
  },

  createItem: async (restaurantId: string, input: AdminMenuItemInput) => {
    const category = await adminMenuRepository.findCategoryById(input.categoryId, restaurantId)
    if (!category) throw new Error('Category not found or does not belong to this restaurant.')
    return adminMenuRepository.createItem(input)
  },

  updateItem: async (id: string, restaurantId: string, input: UpdateAdminMenuItemInput) => {
    const existing = await adminMenuRepository.findItemById(id, restaurantId)
    if (!existing) throw new Error('Item not found.')

    if (input.categoryId && input.categoryId !== existing.categoryId) {
      const category = await adminMenuRepository.findCategoryById(input.categoryId, restaurantId)
      if (!category) throw new Error('Category not found or does not belong to this restaurant.')
    }

    return adminMenuRepository.updateItem(id, input)
  },

  deleteItem: async (id: string, restaurantId: string) => {
    const existing = await adminMenuRepository.findItemById(id, restaurantId)
    if (!existing) throw new Error('Item not found.')

    const orderCount = await adminMenuRepository.countOrderItemsByItem(id)
    if (orderCount > 0) {
      throw new Error(
        'Cannot delete this item — it appears in existing orders. Deactivate it instead.',
      )
    }

    return adminMenuRepository.deleteItem(id)
  },
}
