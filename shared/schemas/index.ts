import { z } from 'zod'
import { MIN_PASSWORD_LENGTH } from '@shared/constants'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const PaymentModeSchema = z.enum(['CASH_ON_DELIVERY', 'ONLINE', 'WALLET'])

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const RegisterUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('Invalid email address.'),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
  phone: z.string().optional(),
})

// ─── Address ──────────────────────────────────────────────────────────────────

export const CreateAddressSchema = z.object({
  label: z.string().trim().min(1, 'Label is required.'),
  line1: z.string().trim().min(1, 'Address line 1 is required.'),
  line2: z.string().optional(),
  city: z.string().trim().min(1, 'City is required.'),
  state: z.string().trim().min(1, 'State is required.'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits.'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  isDefault: z.boolean().optional(),
})

// ─── Order ────────────────────────────────────────────────────────────────────

export const OrderItemSchema = z.object({
  menuItemId: z.string().cuid('Invalid menu item ID.'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
  name: z.string().trim().min(1, 'Item name is required.'),
  price: z.number().positive('Price must be positive.'),
})

export const CreateOrderSchema = z.object({
  restaurantId: z.string().cuid('Invalid restaurant ID.'),
  addressId: z.string().cuid('Invalid address ID.'),
  paymentMode: PaymentModeSchema,
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item.'),
  subtotal: z.number().nonnegative('Invalid subtotal.'),
  deliveryFee: z.number().nonnegative('Invalid delivery fee.'),
  taxes: z.number().nonnegative('Invalid taxes.'),
  discount: z.number().nonnegative('Invalid discount.'),
  total: z.number().positive('Invalid total.'),
})

// ─── Inferred types ───────────────────────────────────────────────────────────

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
