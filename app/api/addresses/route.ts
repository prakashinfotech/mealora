import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json({ success: true, data: addresses })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })

  try {
    const body = await request.json()
    const { label, line1, line2, city, state, pincode, isDefault } = body

    if (!line1 || !city || !pincode) {
      return NextResponse.json({ success: false, error: 'line1, city, and pincode are required.' }, { status: 400 })
    }

    // Clear other defaults if this is being set as default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        label: label ?? 'Home',
        line1,
        line2,
        city,
        state: state ?? 'Karnataka',
        pincode,
        isDefault: isDefault ?? false,
      },
    })

    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
