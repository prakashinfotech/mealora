import { CreateOrderSchema } from '@shared/schemas'
export { CreateOrderSchema }

export function validateCreateOrderInput(body: unknown) {
  return CreateOrderSchema.parse(body)
}
