import { NextResponse } from 'next/server'
import { userService } from '@server/services/user.service'
import { validateRegisterInput } from '@server/validators/user.validator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = validateRegisterInput(body)
    const user = await userService.register(input)
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error.'
    const status = message === 'Server error.' ? 500 : 400
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
