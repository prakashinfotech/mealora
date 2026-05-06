import { NextResponse } from 'next/server'
import { orderService } from '@server/services/order.service'
import { withAuth } from '@server/middleware/withAuth'
import type { OrderStatus } from '@shared/interfaces'

export const GET = withAuth(async (_request, session, context) => {
  const id = context?.params.id ?? ''
  const order = await orderService.findForUser(id, session.user.id)
  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: order })
})

export const PATCH = withAuth(async (request, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const { status, message } = (await request.json()) as { status: OrderStatus; message?: string }
    const updated = await orderService.updateStatus(id, status, message)
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: msg }, { status: 400 })
  }
})
