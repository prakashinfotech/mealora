import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: { restaurants: [], items: [] } })
  }

  const [restaurants, menuItems] = await Promise.all([
    prisma.restaurant.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { area: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, imageUrl: true, cuisines: true, rating: true, area: true },
      take: 5,
    }),
    prisma.menuItem.findMany({
      where: {
        name: { contains: q, mode: 'insensitive' },
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        isVeg: true,
        category: {
          select: {
            restaurantId: true,
            restaurant: { select: { id: true, name: true } },
          },
        },
      },
      take: 8,
    }),
  ])

  return NextResponse.json({ success: true, data: { restaurants, menuItems } })
}
