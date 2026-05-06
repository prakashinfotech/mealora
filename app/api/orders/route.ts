import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOTP } from '@/lib/utils'
import type { CheckoutPayload } from '@/types'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      restaurant: { select: { id: true, name: true, imageUrl: true, area: true } },
      items: true,
    },
  })

  return NextResponse.json({ success: true, data: orders })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })

  try {
    const body: CheckoutPayload = await request.json()
    const { restaurantId, addressId, paymentMode, items, subtotal, deliveryFee, taxes, discount, total } = body

    if (!restaurantId || !items?.length) {
      return NextResponse.json({ success: false, error: 'restaurantId and items are required.' }, { status: 400 })
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } })
    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found.' }, { status: 404 })
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        restaurantId,
        addressId: addressId || null,
        status: 'PLACED',
        paymentMode: paymentMode ?? 'CASH_ON_DELIVERY',
        paymentStatus: paymentMode === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
        subtotal,
        deliveryFee,
        taxes,
        discount: discount ?? 0,
        total,
        otp: generateOTP(4),
        items: {
          create: items.map((i) => ({
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
      },
      include: {
        items: true,
        timeline: true,
        restaurant: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
