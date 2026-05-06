import type { RegisterUserInput } from '@shared/interfaces'

export function validateRegisterInput(body: unknown): RegisterUserInput {
  const data = body as Partial<RegisterUserInput>

  if (!data.name?.trim()) throw new Error('Name is required.')
  if (!data.email?.trim()) throw new Error('Email is required.')
  if (!data.password) throw new Error('Password is required.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('Invalid email address.')

  return data as RegisterUserInput
}
