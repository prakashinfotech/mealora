import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminCouponService } from '@server/services/admin-coupon.service'
import { validateAdminCouponUpdate } from '@server/validators/admin-coupon.validator'

export const GET = withAdmin(async (_req, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const coupon = await adminCouponService.findById(id)
    return NextResponse.json({ success: true, data: coupon })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Not found.'
    return NextResponse.json({ success: false, error: message }, { status: 404 })
  }
})

export const PATCH = withAdmin(async (request, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const body = await request.json()
    const input = validateAdminCouponUpdate(body)
    const coupon = await adminCouponService.update(id, input)
    return NextResponse.json({ success: true, data: coupon })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to update coupon.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
