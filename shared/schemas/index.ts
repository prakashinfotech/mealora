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
  couponCode: z.string().trim().toUpperCase().optional(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
})

// ─── Payment ──────────────────────────────────────────────────────────────────

export const CreatePaymentOrderSchema = z.object({
  restaurantId: z.string().cuid('Invalid restaurant ID.'),
  items: z.array(
    z.object({
      menuItemId: z.string().cuid('Invalid menu item ID.'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
    })
  ).min(1, 'Order must have at least one item.'),
  couponCode: z.string().trim().toUpperCase().optional(),
})

export const CouponValidateSchema = z.object({
  code: z.string().trim().min(1, 'Coupon code is required.').toUpperCase(),
  subtotal: z.number().positive('Subtotal must be positive.'),
})

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required.'),
  razorpayPaymentId: z.string().min(1, 'Payment ID is required.'),
  razorpaySignature: z.string().min(1, 'Signature is required.'),
  restaurantId: z.string().cuid('Invalid restaurant ID.'),
  addressId: z.string().cuid('Invalid address ID.'),
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item.'),
  subtotal: z.number().nonnegative('Invalid subtotal.'),
  deliveryFee: z.number().nonnegative('Invalid delivery fee.'),
  taxes: z.number().nonnegative('Invalid taxes.'),
  discount: z.number().nonnegative('Invalid discount.'),
  total: z.number().positive('Invalid total.'),
  couponCode: z.string().trim().toUpperCase().optional(),
})

// ─── Inferred types ───────────────────────────────────────────────────────────

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
export type CreatePaymentOrderInput = z.infer<typeof CreatePaymentOrderSchema>
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>
export type CouponValidateInput = z.infer<typeof CouponValidateSchema>

// ─── Admin: Restaurant ────────────────────────────────────────────────────────

export const AdminRestaurantSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  slug: z.string().trim().min(2, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only.'),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().url('Must be a valid URL.').or(z.literal('')).optional(),
  bannerUrl: z.string().trim().url('Must be a valid URL.').or(z.literal('')).optional(),
  cuisines: z.array(z.string().trim().min(1)).min(1, 'At least one cuisine is required.'),
  city: z.string().trim().min(1, 'City is required.'),
  area: z.string().trim().min(1, 'Area / locality is required.'),
  address: z.string().trim().min(5, 'Full address is required.'),
  rating: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().min(0).default(0),
  avgDeliveryTime: z.number().int().min(1, 'Delivery time must be at least 1 minute.').default(30),
  deliveryFee: z.number().min(0).default(0),
  minOrderAmount: z.number().min(0).default(0),
  isPureVeg: z.boolean().default(false),
  isOpen: z.boolean().default(true),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export const UpdateAdminRestaurantSchema = AdminRestaurantSchema.partial()

export const AdminRestaurantFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  isActive: z.enum(['true', 'false', 'all']).default('all'),
})

export type AdminRestaurantInput = z.infer<typeof AdminRestaurantSchema>
export type UpdateAdminRestaurantInput = z.infer<typeof UpdateAdminRestaurantSchema>
export type AdminRestaurantFilters = z.infer<typeof AdminRestaurantFiltersSchema>
