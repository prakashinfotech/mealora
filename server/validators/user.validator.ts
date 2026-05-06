import { RegisterUserSchema } from '@shared/schemas'
export { RegisterUserSchema }

export function validateRegisterInput(body: unknown) {
  return RegisterUserSchema.parse(body)
}
