import {
  AdminUserFiltersSchema,
  AdminUpdateUserRoleSchema,
} from '@shared/schemas'
import type {
  AdminUserFilters,
  AdminUpdateUserRoleInput,
} from '@shared/schemas'

export const validateAdminUserFilters = (params: unknown): AdminUserFilters =>
  AdminUserFiltersSchema.parse(params)

export const validateAdminUpdateUserRole = (body: unknown): AdminUpdateUserRoleInput =>
  AdminUpdateUserRoleSchema.parse(body)
