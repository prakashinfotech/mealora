import { addressRepository } from '@server/repositories/address.repository'
import type { CreateAddressInput } from '@shared/interfaces'

export const addressService = {
  listForUser: async (userId: string) =>
    addressRepository.findByUser(userId),

  create: async (userId: string, input: CreateAddressInput) => {
    if (input.isDefault) {
      await addressRepository.clearDefaults(userId)
    }
    return addressRepository.create(userId, input)
  },

  setDefault: async (userId: string, id: string) =>
    addressRepository.setDefault(id, userId),

  delete: async (userId: string, id: string) =>
    addressRepository.delete(id, userId),
}
