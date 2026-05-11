// Shared TypeScript contracts used by both frontend (src/) and backend (server/).
// No framework-specific imports allowed here.

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN'
export type SpiceLevel = 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT'
export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
export type PaymentMode = 'CASH_ON_DELIVERY' | 'ONLINE' | 'WALLET'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type DiscountType = 'PERCENTAGE' | 'FLAT'

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface IUser {
  id: string
  name: string
  email: string
  phone?: string | null
  image?: string | null
  role: UserRole
  createdAt: Date
}

export interface IAddress {
  id: string
  userId: string
  label: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
  lat?: number | null
  lng?: number | null
  isDefault: boolean
}

export interface IRestaurant {
  id: string
  name: string
  slug: string
  description?: string | null
  imageUrl: string
  bannerUrl?: string | null
  cuisines: string[]
  rating: number
  ratingCount: number
  avgDeliveryTime: number
  deliveryFee: number
  minOrderAmount: number
  isOpen: boolean
  isPureVeg: boolean
  city: string
  area: string
  address: string
  lat?: number | null
  lng?: number | null
}

export interface IMenuCategory {
  id: string
  restaurantId: string
  name: string
  description?: string | null
  sortOrder: number
}

export interface IMenuItem {
  id: string
  categoryId: string
  name: string
  description?: string | null
  price: number
  imageUrl?: string | null
  isVeg: boolean
  isAvailable: boolean
  isBestSeller: boolean
  spiceLevel?: SpiceLevel | null
  sortOrder: number
}

export interface IMenuCategoryWithItems extends IMenuCategory {
  items: IMenuItem[]
}

export interface IRestaurantWithMenu extends IRestaurant {
  categories: IMenuCategoryWithItems[]
}

export interface ICoupon {
  id: string
  code: string
  title: string
  description?: string | null
  discountType: DiscountType
  discountValue: number
  minOrderAmount?: number | null
  maxDiscount?: number | null
  isActive: boolean
  expiresAt?: Date | null
}

export interface ICouponApplied {
  code: string
  title: string
  discount: number
}

export interface IOrderItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export interface IOrderTimelineEntry {
  id: string
  status: OrderStatus
  message?: string | null
  createdAt: Date
}

export interface IOrder {
  id: string
  userId: string
  restaurantId: string
  addressId?: string | null
  status: OrderStatus
  paymentMode: PaymentMode
  paymentStatus: PaymentStatus
  subtotal: number
  deliveryFee: number
  taxes: number
  discount: number
  total: number
  otp?: string | null
  couponCode?: string | null
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  createdAt: Date
  updatedAt: Date
  restaurant?: Pick<IRestaurant, 'id' | 'name' | 'imageUrl' | 'area'>
  address?: IAddress
  items?: IOrderItem[]
  timeline?: IOrderTimelineEntry[]
}

// ─── Razorpay ─────────────────────────────────────────────────────────────────

export interface RazorpayCreateOrderResponse {
  razorpayOrderId: string
  keyId: string
  amount: number
  currency: string
  subtotal: number
  deliveryFee: number
  taxes: number
  discount: number
  couponCode?: string
  total: number
  items: Array<{
    menuItemId: string
    name: string
    price: number
    quantity: number
  }>
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// ─── API contracts ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ─── Service input types ──────────────────────────────────────────────────────

export interface RestaurantFilters {
  cuisine?: string
  rating?: number
  maxDeliveryTime?: number
  isPureVeg?: boolean
  sortBy?: 'rating' | 'delivery_time' | 'cost_low' | 'cost_high'
  search?: string
  city?: string
  page?: number
  limit?: number
}

// Input types are defined in shared/schemas and re-exported here for convenience
export type {
  RegisterUserInput,
  CreateAddressInput,
  CreateOrderInput,
  CreatePaymentOrderInput,
  VerifyPaymentInput,
} from '@shared/schemas'

// ─── Legacy aliases (keep existing component imports working) ─────────────────
export type User = IUser
export type Address = IAddress
export type Restaurant = IRestaurant
export type RestaurantWithMenu = IRestaurantWithMenu
export type MenuCategory = IMenuCategory
export type MenuItem = IMenuItem
export type MenuCategoryWithItems = IMenuCategoryWithItems
export type Order = IOrder
export type OrderItem = IOrderItem
export type OrderTimelineEntry = IOrderTimelineEntry
export type Coupon = ICoupon
export type CouponApplied = ICouponApplied
