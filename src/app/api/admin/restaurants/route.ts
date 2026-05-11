import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'
import {
  validateAdminRestaurantCreate,
  validateAdminRestaurantFilters,
} from '@server/validators/admin-restaurant.validator'

export const GET = withAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const filters = validateAdminRestaurantFilters({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      city: searchParams.get('city') ?? undefined,
      isActive: searchParams.get('isActive') ?? undefined,
    })
    const result = await adminRestaurantService.list(filters)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch restaurants.' }, { status: 500 })
  }
})

export const POST = withAdmin(async (request) => {
  try {
    const body = await request.json()
    const input = validateAdminRestaurantCreate(body)
    const restaurant = await adminRestaurantService.create(input)
    return NextResponse.json({ success: true, data: restaurant }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to create restaurant.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
