import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminCouponService } from '@server/services/admin-coupon.service'
import {
  validateAdminCouponCreate,
  validateAdminCouponFilters,
} from '@server/validators/admin-coupon.validator'

export const GET = withAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const filters = validateAdminCouponFilters({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      isActive: searchParams.get('isActive') ?? undefined,
      discountType: searchParams.get('discountType') ?? undefined,
      expired: searchParams.get('expired') ?? undefined,
    })
    const result = await adminCouponService.list(filters)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons.' }, { status: 500 })
  }
})

export const POST = withAdmin(async (request) => {
  try {
    const body = await request.json()
    const input = validateAdminCouponCreate(body)
    const coupon = await adminCouponService.create(input)
    return NextResponse.json({ success: true, data: coupon }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to create coupon.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
