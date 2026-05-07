// This file re-exports shared helpers + adds frontend-only utilities.
// Components import from @/lib/utils — no changes needed in components.

export {
  formatPrice,
  formatDeliveryTime,
  slugify,
  generateOTP,
  calculateTaxes,
  calculateDeliveryFee,
  calculateOrderTotal,
} from '@shared/helpers'

export { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@shared/constants'

// ─── Frontend-only: Tailwind class merger ─────────────────────────────────────
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
  return String(n)
}
