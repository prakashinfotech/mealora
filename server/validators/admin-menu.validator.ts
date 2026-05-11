import {
  AdminMenuCategorySchema,
  UpdateAdminMenuCategorySchema,
  AdminMenuCategoryFiltersSchema,
  AdminMenuItemSchema,
  UpdateAdminMenuItemSchema,
  AdminMenuItemFiltersSchema,
} from '@shared/schemas'
import type {
  AdminMenuCategoryInput,
  UpdateAdminMenuCategoryInput,
  AdminMenuCategoryFilters,
  AdminMenuItemInput,
  UpdateAdminMenuItemInput,
  AdminMenuItemFilters,
} from '@shared/schemas'

export const validateAdminMenuCategoryCreate = (body: unknown): AdminMenuCategoryInput =>
  AdminMenuCategorySchema.parse(body)

export const validateAdminMenuCategoryUpdate = (body: unknown): UpdateAdminMenuCategoryInput =>
  UpdateAdminMenuCategorySchema.parse(body)

export const validateAdminMenuCategoryFilters = (params: unknown): AdminMenuCategoryFilters =>
  AdminMenuCategoryFiltersSchema.parse(params)

export const validateAdminMenuItemCreate = (body: unknown): AdminMenuItemInput =>
  AdminMenuItemSchema.parse(body)

export const validateAdminMenuItemUpdate = (body: unknown): UpdateAdminMenuItemInput =>
  UpdateAdminMenuItemSchema.parse(body)

export const validateAdminMenuItemFilters = (params: unknown): AdminMenuItemFilters =>
  AdminMenuItemFiltersSchema.parse(params)
