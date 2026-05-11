import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminOrderService } from '@server/services/admin-order.service'
import { validateAdminOrderFilters } from '@server/validators/admin-order.validator'

export const GET = withAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const filters = validateAdminOrderFilters({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      paymentStatus: searchParams.get('paymentStatus') ?? undefined,
      paymentMode: searchParams.get('paymentMode') ?? undefined,
      restaurantId: searchParams.get('restaurantId') ?? undefined,
      city: searchParams.get('city') ?? undefined,
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo: searchParams.get('dateTo') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
    })
    const result = await adminOrderService.listOrders(filters)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch orders.' }, { status: 500 })
  }
})
