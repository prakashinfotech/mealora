import { NextResponse } from 'next/server'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminRestaurantService } from '@server/services/admin-restaurant.service'

export const PATCH = withAdmin(async (request, _session, context) => {
  try {
    const id = context?.params.id ?? ''
    const { isActive } = await request.json() as { isActive: boolean }
    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ success: false, error: 'isActive must be a boolean.' }, { status: 422 })
    }
    const result = await adminRestaurantService.setActive(id, isActive)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update status.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
