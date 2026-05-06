import { CreateAddressSchema } from '@shared/schemas'
export { CreateAddressSchema }

export function validateCreateAddressInput(body: unknown) {
  return CreateAddressSchema.parse(body)
}
