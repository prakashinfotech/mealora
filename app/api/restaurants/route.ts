import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')
    const cuisine = searchParams.get('cuisine')
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined
    const maxDeliveryTime = searchParams.get('maxDeliveryTime') ? Number(searchParams.get('maxDeliveryTime')) : undefined
    const isPureVeg = searchParams.get('isPureVeg') === 'true'
    const sortBy = searchParams.get('sortBy') ?? 'rating'
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Math.min(Number(searchParams.get('limit') ?? 12), 50)

    const where: Prisma.RestaurantWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { area: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (cuisine) where.cuisines = { hasSome: [cuisine] }
    if (rating) where.rating = { gte: rating }
    if (maxDeliveryTime) where.avgDeliveryTime = { lte: maxDeliveryTime }
    if (isPureVeg) where.isPureVeg = true

    const orderByMap: Record<string, Prisma.RestaurantOrderByWithRelationInput> = {
      rating: { rating: 'desc' },
      delivery_time: { avgDeliveryTime: 'asc' },
      cost_low: { deliveryFee: 'asc' },
      cost_high: { deliveryFee: 'desc' },
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        orderBy: orderByMap[sortBy] ?? { rating: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.restaurant.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: { items: restaurants, total, page, limit, hasMore: page * limit < total },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
