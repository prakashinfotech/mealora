import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { withAdmin } from '@server/middleware/withAdmin'
import { adminUserService } from '@server/services/admin-user.service'
import { validateAdminUpdateUserRole } from '@server/validators/admin-user.validator'

export const PATCH = withAdmin(async (request, session, context) => {
  try {
    const id = context?.params.id ?? ''
    const body = await request.json()
    const input = validateAdminUpdateUserRole(body)
    const result = await adminUserService.updateRole(id, input, session.user.id)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: err.issues.map((e) => e.message).join(' ') }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Failed to update role.'
    // Self-demotion and not-found → 400; other errors → 400
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
