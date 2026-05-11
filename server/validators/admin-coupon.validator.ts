import {
  AdminCouponSchema,
  UpdateAdminCouponSchema,
  AdminCouponFiltersSchema,
} from '@shared/schemas'
import type {
  AdminCouponInput,
  UpdateAdminCouponInput,
  AdminCouponFilters,
} from '@shared/schemas'

export const validateAdminCouponCreate = (body: unknown): AdminCouponInput =>
  AdminCouponSchema.parse(body)

export const validateAdminCouponUpdate = (body: unknown): UpdateAdminCouponInput =>
  UpdateAdminCouponSchema.parse(body)

export const validateAdminCouponFilters = (params: unknown): AdminCouponFilters =>
  AdminCouponFiltersSchema.parse(params)
