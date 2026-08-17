'use client'

import { cn, formatPrice } from '@/lib/utils'
import type { DiscountType } from '@/types'

export interface CouponCardData {
  id: string
  code: string
  title: string
  description?: string | null
  discountType: DiscountType
  discountValue: number
  minOrderAmount?: number | null
  maxDiscount?: number | null
  expiresAt?: string | null
}

interface Props {
  coupon: CouponCardData
  subtotal: number
  isApplied: boolean
  isApplying: boolean
  onApply: () => void
  onRemove: () => void
}

function getOfferLabel(coupon: CouponCardData): string {
  if (coupon.discountType === 'PERCENTAGE') {
    const base = `${coupon.discountValue}% off`
    return coupon.maxDiscount ? `${base} up to ${formatPrice(coupon.maxDiscount)}` : base
  }
  return `${formatPrice(coupon.discountValue)} flat off`
}

function estimateSavings(coupon: CouponCardData, subtotal: number): number {
  if (coupon.discountType === 'PERCENTAGE') {
    const raw = subtotal * (coupon.discountValue / 100)
    return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw
  }
  return Math.min(coupon.discountValue, subtotal)
}

export function CouponCard({ coupon, subtotal, isApplied, isApplying, onApply, onRemove }: Props) {
  const isEligible = !coupon.minOrderAmount || subtotal >= coupon.minOrderAmount
  const shortfall = coupon.minOrderAmount ? Math.ceil(coupon.minOrderAmount - subtotal) : 0
  const savings = isEligible ? estimateSavings(coupon, subtotal) : 0

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 p-4 transition-all duration-200',
        isApplied
          ? 'border-brand-primary bg-brand-primary-light'
          : isEligible
            ? 'border-app-border bg-white hover:border-brand-primary/40'
            : 'border-dashed border-app-border/60 bg-app-gray-bg opacity-70',
      )}
    >
      {/* Applied badge */}
      {isApplied && (
        <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider text-white bg-brand-primary rounded-full px-2 py-0.5">
          Applied
        </span>
      )}

      {/* Top row: code + offer label */}
      <div className="flex items-start gap-3 pr-16">
        <div>
          <p className={cn('text-sm font-black tracking-widest uppercase', isApplied ? 'text-brand-primary' : 'text-app-black')}>
            {coupon.code}
          </p>
          <p className="text-xs font-semibold text-app-black mt-0.5">{getOfferLabel(coupon)}</p>
        </div>
      </div>

      {/* Description */}
      {coupon.description && (
        <p className="text-xs text-app-gray mt-1.5 leading-snug">{coupon.description}</p>
      )}

      {/* Divider */}
      <div className={cn('my-3 border-t', isApplied ? 'border-brand-primary/20' : 'border-app-border/60')} />

      {/* Bottom row: savings / shortfall + action */}
      <div className="flex items-center justify-between gap-2">
        <p className={cn('text-xs font-medium', isEligible ? 'text-app-green' : 'text-app-gray')}>
          {isApplied
            ? `You save ${formatPrice(savings)} 🎉`
            : isEligible
              ? `You save ${formatPrice(savings)}`
              : `Add ${formatPrice(shortfall)} more to unlock`}
        </p>

        {isApplied ? (
          <button
            onClick={onRemove}
            className="text-xs font-bold text-brand-primary hover:text-brand-primary-dark transition-colors shrink-0"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={onApply}
            disabled={!isEligible || isApplying}
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0',
              isEligible
                ? 'bg-brand-primary text-white hover:bg-brand-primary-dark disabled:opacity-60'
                : 'bg-app-border text-app-gray cursor-not-allowed',
            )}
          >
            {isApplying ? (
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : isEligible ? 'Apply' : 'Not eligible'}
          </button>
        )}
      </div>

      {/* Min order note */}
      {coupon.minOrderAmount && !isApplied && (
        <p className="text-[10px] text-app-gray-light mt-1.5">
          Min order {formatPrice(coupon.minOrderAmount)}
        </p>
      )}
    </div>
  )
}
