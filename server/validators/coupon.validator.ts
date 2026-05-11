import { CouponValidateSchema } from '@shared/schemas'

export function validateCouponInput(body: unknown) {
  return CouponValidateSchema.parse(body)
}
