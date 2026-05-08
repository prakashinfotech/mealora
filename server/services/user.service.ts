import bcrypt from 'bcryptjs'
import { userRepository } from '@server/repositories/user.repository'
import type { RegisterUserInput } from '@shared/interfaces'
import { MIN_PASSWORD_LENGTH, BCRYPT_ROUNDS } from '@shared/constants'

export const userService = {
  register: async (input: RegisterUserInput) => {
    if (input.password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    }

    const existing = await userRepository.findByEmail(input.email)
    if (existing) throw new Error('Email already registered.')

    const hashed = await bcrypt.hash(input.password, BCRYPT_ROUNDS)
    return userRepository.create({ name: input.name, email: input.email, password: hashed, phone: input.phone })
  },

  findById: async (id: string) =>
    userRepository.findById(id),

  update: async (id: string, data: { name?: string; phone?: string | null }) => {
    if (data.name !== undefined && data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters.')
    }
    return userRepository.update(id, data)
  },
}
