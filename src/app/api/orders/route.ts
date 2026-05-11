import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { orderService } from '@server/services/order.service'
import { validateCreateOrderInput } from '@server/validators/order.validator'
import { withAuth } from '@server/middleware/withAuth'

export const GET = withAuth(async (request, session) => {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '10')))
  const result = await orderService.listForUser(session.user.id, { page, limit })
  return NextResponse.json({ success: true, data: result })
})

export const POST = withAuth(async (request, session) => {
  try {
    const body = await request.json()
    const input = validateCreateOrderInput(body)
    const order = await orderService.create(session.user.id, input)
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      const error = err.issues.map((e) => e.message).join(' ')
      return NextResponse.json({ success: false, error }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
