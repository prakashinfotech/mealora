import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { userService } from '@server/services/user.service'
import { validateRegisterInput } from '@server/validators/user.validator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = validateRegisterInput(body)
    const user = await userService.register(input)
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      const error = err.issues.map((e) => e.message).join(' ')
      return NextResponse.json({ success: false, error }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
