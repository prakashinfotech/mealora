import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminMenuService } from '@server/services/admin-menu.service'
import { validateAdminMenuCategoryUpdate } from '@server/validators/admin-menu.validator'

export const GET = withAdmin(async (_req, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const categoryId = context?.params.categoryId ?? ''
    const category = await adminMenuService.findCategoryById(categoryId, restaurantId)
    return NextResponse.json({ success: true, data: category })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Not found.'
    return NextResponse.json({ success: false, error: message }, { status: 404 })
  }
})

export const PATCH = withAdmin(async (request, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const categoryId = context?.params.categoryId ?? ''
    const body = await request.json()
    const input = validateAdminMenuCategoryUpdate(body)
    const category = await adminMenuService.updateCategory(categoryId, restaurantId, input)
    return NextResponse.json({ success: true, data: category })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to update category.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})

export const DELETE = withAdmin(async (_req, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const categoryId = context?.params.categoryId ?? ''
    await adminMenuService.deleteCategory(categoryId, restaurantId)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete category.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
