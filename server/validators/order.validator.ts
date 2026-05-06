import type { CreateOrderInput } from '@shared/interfaces'

export function validateCreateOrderInput(body: unknown): CreateOrderInput {
  const data = body as Partial<CreateOrderInput>

  if (!data.restaurantId) throw new Error('restaurantId is required.')
  if (!data.items || data.items.length === 0) throw new Error('items must not be empty.')
  if (!data.addressId) throw new Error('addressId is required.')
  if (typeof data.subtotal !== 'number' || data.subtotal < 0) throw new Error('Invalid subtotal.')
  if (typeof data.total !== 'number' || data.total < 0) throw new Error('Invalid total.')

  return data as CreateOrderInput
}
