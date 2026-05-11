import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAuth } from '@server/middleware/withAuth'
import { paymentService } from '@server/services/payment.service'
import { orderService } from '@server/services/order.service'
import { validateVerifyPaymentInput } from '@server/validators/payment.validator'

export const POST = withAuth(async (request, session) => {
  try {
    const body = await request.json()
    const input = validateVerifyPaymentInput(body)

    const isValid = paymentService.verifySignature(
      input.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature,
    )

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed. Invalid signature.' },
        { status: 400 },
      )
    }

    const order = await orderService.create(session.user.id, {
      restaurantId: input.restaurantId,
      addressId: input.addressId,
      paymentMode: 'ONLINE',
      items: input.items,
      subtotal: input.subtotal,
      deliveryFee: input.deliveryFee,
      taxes: input.taxes,
      discount: input.discount,
      total: input.total,
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
    })

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
