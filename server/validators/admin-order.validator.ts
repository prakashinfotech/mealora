import {
  AdminOrderFiltersSchema,
  AdminUpdateOrderStatusSchema,
} from '@shared/schemas'
import type {
  AdminOrderFilters,
  AdminUpdateOrderStatusInput,
} from '@shared/schemas'

export const validateAdminOrderFilters = (params: unknown): AdminOrderFilters =>
  AdminOrderFiltersSchema.parse(params)

export const validateAdminUpdateOrderStatus = (body: unknown): AdminUpdateOrderStatusInput =>
  AdminUpdateOrderStatusSchema.parse(body)
