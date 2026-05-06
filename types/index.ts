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

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  image?: string | null
  role: UserRole
  createdAt: Date
}

export interface Address {
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

// ─── Restaurant ───────────────────────────────────────────────────────────────

export interface Restaurant {
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

export interface RestaurantWithMenu extends Restaurant {
  categories: MenuCategoryWithItems[]
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuCategory {
  id: string
  restaurantId: string
  name: string
  description?: string | null
  sortOrder: number
}

export interface MenuItem {
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

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[]
}

// ─── Cart (client-side) ───────────────────────────────────────────────────────

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  imageUrl?: string | null
  isVeg: boolean
  quantity: number
  restaurantId: string
  restaurantName: string
}

export interface CartState {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (menuItemId: string) => void
  incrementItem: (menuItemId: string) => void
  decrementItem: (menuItemId: string) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export interface OrderTimelineEntry {
  id: string
  status: OrderStatus
  message?: string | null
  createdAt: Date
}

export interface Order {
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
  createdAt: Date
  updatedAt: Date
  restaurant?: Pick<Restaurant, 'id' | 'name' | 'imageUrl' | 'area'>
  address?: Address
  items?: OrderItem[]
  timeline?: OrderTimelineEntry[]
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ─── Filter / Search ──────────────────────────────────────────────────────────

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

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutPayload {
  restaurantId: string
  addressId: string
  paymentMode: PaymentMode
  items: { menuItemId: string; quantity: number; name: string; price: number }[]
  subtotal: number
  deliveryFee: number
  taxes: number
  discount: number
  total: number
}
