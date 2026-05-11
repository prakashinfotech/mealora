import { NextResponse } from 'next/server'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminOrderService } from '@server/services/admin-order.service'

export const GET = withAdmin(async () => {
  try {
    const stats = await adminOrderService.getStats()
    return NextResponse.json({ success: true, data: stats })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats.' }, { status: 500 })
  }
})
