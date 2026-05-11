import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAuth } from '@server/middleware/withAuth'
import { paymentService } from '@server/services/payment.service'
import { validateCreatePaymentOrderInput } from '@server/validators/payment.validator'

export const POST = withAuth(async (request) => {
  try {
    const body = await request.json()
    const input = validateCreatePaymentOrderInput(body)
    const data = await paymentService.createOrder(input)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    if (err instanceof ZodError) {
      const error = err.issues.map((e) => e.message).join(' ')
      return NextResponse.json({ success: false, error }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
