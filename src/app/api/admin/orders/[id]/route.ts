import { NextResponse } from 'next/server'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminOrderService } from '@server/services/admin-order.service'

export const GET = withAdmin(async (_req, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const order = await adminOrderService.findById(id)
    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Not found.'
    return NextResponse.json({ success: false, error: message }, { status: 404 })
  }
})
