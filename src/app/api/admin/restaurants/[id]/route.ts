import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'
import { validateAdminRestaurantUpdate } from '@server/validators/admin-restaurant.validator'

export const GET = withAdmin(async (_req, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const restaurant = await adminRestaurantService.findById(id)
    return NextResponse.json({ success: true, data: restaurant })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Not found.'
    return NextResponse.json({ success: false, error: message }, { status: 404 })
  }
})

export const PATCH = withAdmin(async (request, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const body = await request.json()
    const input = validateAdminRestaurantUpdate(body)
    const restaurant = await adminRestaurantService.update(id, input)
    return NextResponse.json({ success: true, data: restaurant })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to update restaurant.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
