import {
  AdminRestaurantSchema,
  UpdateAdminRestaurantSchema,
  AdminRestaurantFiltersSchema,
} from '@shared/schemas'

export const validateAdminRestaurantCreate = (body: unknown) =>
  AdminRestaurantSchema.parse(body)

export const validateAdminRestaurantUpdate = (body: unknown) =>
  UpdateAdminRestaurantSchema.parse(body)

export const validateAdminRestaurantFilters = (params: Record<string, string | undefined>) =>
  AdminRestaurantFiltersSchema.parse(params)
