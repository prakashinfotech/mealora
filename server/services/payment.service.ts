import Razorpay from 'razorpay'
import crypto from 'crypto'
import { menuRepository } from '@server/repositories/menu.repository'
import { calculateOrderTotal } from '@shared/helpers'
import type { CreatePaymentOrderInput, RazorpayCreateOrderResponse } from '@shared/interfaces'

function validateRazorpayEnv(): { keyId: string; keySecret: string } {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || keyId === 'rzp_test_REPLACE_ME') {
    console.error(
      '[payment] NEXT_PUBLIC_RAZORPAY_KEY_ID is not set. ' +
        'Add it to .env.local and restart the dev server.',
    )
    throw new Error('Online payments are not configured. Please contact support.')
  }
  if (!keySecret || keySecret === 'REPLACE_ME_WITH_YOUR_KEY_SECRET') {
    console.error(
      '[payment] RAZORPAY_KEY_SECRET is not set. ' +
        'Add it to .env.local and restart the dev server.',
    )
    throw new Error('Online payments are not configured. Please contact support.')
  }
  return { keyId, keySecret }
}

function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = validateRazorpayEnv()
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export const paymentService = {
  createOrder: async (input: CreatePaymentOrderInput): Promise<RazorpayCreateOrderResponse> => {
    const menuItems = await menuRepository.findByIds(input.items.map((i) => i.menuItemId))

    const missingIds = input.items.filter((i) => !menuItems.find((m) => m.id === i.menuItemId))
    if (missingIds.length > 0) throw new Error('One or more items are unavailable.')

    const subtotal = input.items.reduce((sum, item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!
      return sum + menuItem.price * item.quantity
    }, 0)

    const { deliveryFee, taxes, total } = calculateOrderTotal(subtotal)
    const amountInPaise = Math.round(total * 100)

    const client = getRazorpayClient()
    const rzpOrder = await client.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    return {
      razorpayOrderId: rzpOrder.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: Number(rzpOrder.amount),
      currency: rzpOrder.currency,
      subtotal,
      deliveryFee,
      taxes,
      total,
      items: input.items.map((item) => {
        const m = menuItems.find((mi) => mi.id === item.menuItemId)!
        return { menuItemId: item.menuItemId, name: m.name, price: m.price, quantity: item.quantity }
      }),
    }
  },

  verifySignature: (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): boolean => {
    try {
      const { keySecret } = validateRazorpayEnv()
      const body = `${razorpayOrderId}|${razorpayPaymentId}`
      const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex')
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpaySignature))
    } catch {
      return false
    }
  },
}
