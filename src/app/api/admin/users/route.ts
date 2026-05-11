import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminUserService } from '@server/services/admin-user.service'
import { validateAdminUserFilters } from '@server/validators/admin-user.validator'

export const GET = withAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const filters = validateAdminUserFilters({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      role: searchParams.get('role') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
    })
    const result = await adminUserService.list(filters)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch users.' }, { status: 500 })
  }
})
