import { addressRepository } from '@server/repositories/address.repository'
import type { CreateAddressInput } from '@shared/interfaces'

export const addressService = {
  listForUser: async (userId: string) =>
    addressRepository.findByUser(userId),

  create: async (userId: string, input: CreateAddressInput) => {
    if (!input.line1 || !input.city || !input.pincode) {
      throw new Error('line1, city, and pincode are required.')
    }

    if (input.isDefault) {
      await addressRepository.clearDefaults(userId)
    }

    return addressRepository.create(userId, input)
  },
}
