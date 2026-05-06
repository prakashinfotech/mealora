import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { OrderStatus } from '@/types'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      restaurant: { select: { id: true, name: true, imageUrl: true, area: true } },
      address: true,
      items: true,
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!order) return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })

  return NextResponse.json({ success: true, data: order })
}

// PATCH /api/orders/[id] — update status (admin/demo use)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })

  try {
    const { status, message } = (await request.json()) as { status: OrderStatus; message?: string }

    const order = await prisma.order.findFirst({
      where: { id: params.id },
    })
    if (!order) return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        timeline: {
          create: { status, message },
        },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
