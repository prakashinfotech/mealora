import { NextResponse } from 'next/server'
import { z } from 'zod'
import { userService } from '@server/services/user.service'
import { withAuth } from '@server/middleware/withAuth'

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').optional(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits.').nullable().optional(),
})

export const PATCH = withAuth(async (request, session) => {
  try {
    const body = await request.json()
    const input = UpdateProfileSchema.parse(body)
    const updated = await userService.update(session.user.id, input)
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const error = err.issues.map((e) => e.message).join(' ')
      return NextResponse.json({ success: false, error }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
