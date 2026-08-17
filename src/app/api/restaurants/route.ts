import { NextResponse } from 'next/server'
import { restaurantService } from '@server/services/restaurant.service'
import type { RestaurantFilters } from '@shared/interfaces'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: RestaurantFilters = {
      city: searchParams.get('city') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      cuisine: searchParams.get('cuisine') ?? undefined,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      maxDeliveryTime: searchParams.get('maxDeliveryTime') ? Number(searchParams.get('maxDeliveryTime')) : undefined,
      isPureVeg: searchParams.get('isPureVeg') === 'true',
      sortBy: (searchParams.get('sortBy') as RestaurantFilters['sortBy']) ?? undefined,
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 12),
      maxCost: searchParams.get('maxCost') ? Number(searchParams.get('maxCost')) : undefined,
    }

    const data = await restaurantService.list(filters)
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
