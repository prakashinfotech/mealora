import { NextResponse } from 'next/server'
import { withAuth } from '@server/middleware/withAuth'
import { couponRepository } from '@server/repositories/coupon.repository'

export const GET = withAuth(async () => {
  try {
    const coupons = await couponRepository.findAll()
    return NextResponse.json({ success: true, data: coupons })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load coupons.' }, { status: 500 })
  }
})
