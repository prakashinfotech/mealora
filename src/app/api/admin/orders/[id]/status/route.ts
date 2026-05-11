import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminOrderService } from '@server/services/admin-order.service'
import { validateAdminUpdateOrderStatus } from '@server/validators/admin-order.validator'

export const PATCH = withAdmin(async (request, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const body = await request.json()
    const input = validateAdminUpdateOrderStatus(body)
    const order = await adminOrderService.updateStatus(id, input)
    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to update status.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
