// ─── Pricing ──────────────────────────────────────────────────────────────────
export const DELIVERY_FEE = 40           // ₹ flat fee
export const FREE_DELIVERY_THRESHOLD = 299 // waived above this subtotal
export const TAX_RATE = 0.05             // 5% GST

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_LIMIT = 12
export const MAX_PAGE_LIMIT = 50

// ─── Order ────────────────────────────────────────────────────────────────────
export const ORDER_TRACKING_POLL_INTERVAL_MS = 10_000
export const OTP_LENGTH = 4

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const MIN_PASSWORD_LENGTH = 6
export const BCRYPT_ROUNDS = 12

// ─── Order status display ─────────────────────────────────────────────────────
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PLACED: 'Order Placed',
  ACCEPTED: 'Order Accepted',
  PREPARING: 'Being Prepared',
  READY: 'Ready for Pickup',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PLACED: 'text-blue-600',
  ACCEPTED: 'text-indigo-600',
  PREPARING: 'text-yellow-600',
  READY: 'text-orange-500',
  OUT_FOR_DELIVERY: 'text-brand-orange',
  DELIVERED: 'text-swiggy-green',
  CANCELLED: 'text-swiggy-red',
}

export const ORDER_STATUS_STEPS = [
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const
