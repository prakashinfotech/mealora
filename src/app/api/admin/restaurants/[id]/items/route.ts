import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminMenuService } from '@server/services/admin-menu.service'
import {
  validateAdminMenuItemCreate,
  validateAdminMenuItemFilters,
} from '@server/validators/admin-menu.validator'

export const GET = withAdmin(async (request, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const { searchParams } = new URL(request.url)
    const filters = validateAdminMenuItemFilters({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      isVeg: searchParams.get('isVeg') ?? undefined,
      isActive: searchParams.get('isActive') ?? undefined,
      isAvailable: searchParams.get('isAvailable') ?? undefined,
    })
    const result = await adminMenuService.listItems(restaurantId, filters)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch items.' }, { status: 500 })
  }
})

export const POST = withAdmin(async (request, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const body = await request.json()
    const input = validateAdminMenuItemCreate(body)
    const item = await adminMenuService.createItem(restaurantId, input)
    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to create item.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
