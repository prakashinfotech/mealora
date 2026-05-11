import { CreatePaymentOrderSchema, VerifyPaymentSchema } from '@shared/schemas'

export function validateCreatePaymentOrderInput(body: unknown) {
  return CreatePaymentOrderSchema.parse(body)
}

export function validateVerifyPaymentInput(body: unknown) {
  return VerifyPaymentSchema.parse(body)
}
