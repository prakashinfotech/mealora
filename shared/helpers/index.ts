// Pure utility functions with no framework dependencies.
// Importable by both frontend (src/) and backend (server/).

import { TAX_RATE, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, OTP_LENGTH } from '@shared/constants'

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} mins`
}

export function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateOTP(length = OTP_LENGTH): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

export function calculateTaxes(subtotal: number, rate = TAX_RATE): number {
  return Math.round(subtotal * rate * 100) / 100
}

export function calculateDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

export function calculateOrderTotal(subtotal: number, discount = 0): {
  deliveryFee: number
  taxes: number
  total: number
} {
  const deliveryFee = calculateDeliveryFee(subtotal)
  const taxes = calculateTaxes(subtotal)
  const total = subtotal + deliveryFee + taxes - discount
  return { deliveryFee, taxes, total }
}
