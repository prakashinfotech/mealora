import { NextResponse } from 'next/server'
import { orderService } from '@server/services/order.service'
import { validateCreateOrderInput } from '@server/validators/order.validator'
import { withAuth } from '@server/middleware/withAuth'

export const GET = withAuth(async (_request, session) => {
  const orders = await orderService.listForUser(session.user.id)
  return NextResponse.json({ success: true, data: orders })
})

export const POST = withAuth(async (request, session) => {
  try {
    const body = await request.json()
    const input = validateCreateOrderInput(body)
    const order = await orderService.create(session.user.id, input)
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error.'
    const status = message === 'Server error.' ? 500 : 400
    return NextResponse.json({ success: false, error: message }, { status })
  }
})
