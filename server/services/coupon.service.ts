import { couponRepository } from '@server/repositories/coupon.repository'

export interface CouponResult {
  code: string
  title: string
  description?: string | null
  discount: number
}

export const couponService = {
  validateAndCompute: async (code: string, subtotal: number): Promise<CouponResult> => {
    const coupon = await couponRepository.findByCode(code)

    if (!coupon) throw new Error('Invalid coupon code.')
    if (!coupon.isActive) throw new Error('This coupon is no longer active.')
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('This coupon has expired.')
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      throw new Error(
        `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.`,
      )
    }

    let discount: number
    if (coupon.discountType === 'PERCENTAGE') {
      discount = subtotal * (coupon.discountValue / 100)
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
    } else {
      discount = Math.min(coupon.discountValue, subtotal)
    }

    discount = Math.round(discount * 100) / 100
    return { code: coupon.code, title: coupon.title, description: coupon.description, discount }
  },
}
