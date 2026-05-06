import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateOTP(length = 4): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

export function calculateTaxes(subtotal: number, rate = 0.05): number {
  return Math.round(subtotal * rate * 100) / 100
}

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
