import { orderRepository } from '@server/repositories/order.repository'
import { restaurantRepository } from '@server/repositories/restaurant.repository'
import { couponService } from '@server/services/coupon.service'
import { generateOTP } from '@shared/helpers'
import type { CreateOrderInput, OrderStatus } from '@shared/interfaces'

export const orderService = {
  listForUser: async (userId: string) =>
    orderRepository.findByUser(userId),

  findForUser: async (id: string, userId: string) => {
    const order = await orderRepository.findByIdForUser(id, userId)
    if (!order) return null
    return order
  },

  create: async (userId: string, input: CreateOrderInput) => {
    const restaurant = await restaurantRepository.findById(input.restaurantId)
    if (!restaurant) throw new Error('Restaurant not found.')
    if (!restaurant.isOpen) throw new Error('Restaurant is currently closed.')

    // Re-validate coupon server-side — frontend discount value is never trusted
    let discount = 0
    if (input.couponCode) {
      const result = await couponService.validateAndCompute(input.couponCode, input.subtotal)
      discount = result.discount
    }

    const paymentStatus =
      input.paymentMode === 'CASH_ON_DELIVERY'
        ? 'PENDING'
        : input.razorpayPaymentId
          ? 'PAID'
          : 'PENDING'

    const total = input.subtotal + input.deliveryFee + input.taxes - discount

    return orderRepository.create({
      userId,
      restaurantId: input.restaurantId,
      addressId: input.addressId || undefined,
      status: 'PLACED',
      paymentMode: input.paymentMode,
      paymentStatus,
      subtotal: input.subtotal,
      deliveryFee: input.deliveryFee,
      taxes: input.taxes,
      discount,
      total,
      couponCode: input.couponCode,
      otp: generateOTP(),
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      items: {
        create: input.items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      },
      timeline: {
        create: {
          status: 'PLACED',
          message: 'Your order has been placed successfully.',
        },
      },
    })
  },

  updateStatus: async (id: string, status: OrderStatus, message?: string) =>
    orderRepository.updateStatus(id, status, message),
}
