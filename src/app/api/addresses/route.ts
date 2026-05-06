import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { addressService } from '@server/services/address.service'
import { validateCreateAddressInput } from '@server/validators/address.validator'
import { withAuth } from '@server/middleware/withAuth'

export const GET = withAuth(async (_request, session) => {
  const addresses = await addressService.listForUser(session.user.id)
  return NextResponse.json({ success: true, data: addresses })
})

export const POST = withAuth(async (request, session) => {
  try {
    const body = await request.json()
    const input = validateCreateAddressInput(body)
    const address = await addressService.create(session.user.id, input)
    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      const error = err.issues.map((e) => e.message).join(' ')
      return NextResponse.json({ success: false, error }, { status: 422 })
    }
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
