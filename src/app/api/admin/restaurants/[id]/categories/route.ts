import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminMenuService } from '@server/services/admin-menu.service'
import {
  validateAdminMenuCategoryCreate,
  validateAdminMenuCategoryFilters,
} from '@server/validators/admin-menu.validator'

export const GET = withAdmin(async (request, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const { searchParams } = new URL(request.url)
    const filters = validateAdminMenuCategoryFilters({
      isActive: searchParams.get('isActive') ?? undefined,
    })
    const categories = await adminMenuService.listCategories(restaurantId, filters)
    return NextResponse.json({ success: true, data: categories })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch categories.' }, { status: 500 })
  }
})

export const POST = withAdmin(async (request, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const body = await request.json()
    const input = validateAdminMenuCategoryCreate(body)
    const category = await adminMenuService.createCategory(restaurantId, input)
    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to create category.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
