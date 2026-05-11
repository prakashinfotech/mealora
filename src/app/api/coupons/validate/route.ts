import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAuth } from '@server/middleware/withAuth'
import { couponService } from '@server/services/coupon.service'
import { validateCouponInput } from '@server/validators/coupon.validator'

export const POST = withAuth(async (request) => {
  try {
    const body = await request.json()
    const { code, subtotal } = validateCouponInput(body)
    const result = await couponService.validateAndCompute(code, subtotal)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    if (err instanceof ZodError) {
      const error = err.issues.map((e) => e.message).join(' ')
      return NextResponse.json({ success: false, error }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
