import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminMenuService } from '@server/services/admin-menu.service'
import { validateAdminMenuItemUpdate } from '@server/validators/admin-menu.validator'

export const GET = withAdmin(async (_req, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const itemId = context?.params.itemId ?? ''
    const item = await adminMenuService.findItemById(itemId, restaurantId)
    return NextResponse.json({ success: true, data: item })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Not found.'
    return NextResponse.json({ success: false, error: message }, { status: 404 })
  }
})

export const PATCH = withAdmin(async (request, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const itemId = context?.params.itemId ?? ''
    const body = await request.json()
    const input = validateAdminMenuItemUpdate(body)
    const item = await adminMenuService.updateItem(itemId, restaurantId, input)
    return NextResponse.json({ success: true, data: item })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to update item.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})

export const DELETE = withAdmin(async (_req, _session, context) => {
  try {
    const restaurantId = context?.params.id ?? ''
    const itemId = context?.params.itemId ?? ''
    await adminMenuService.deleteItem(itemId, restaurantId)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete item.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
