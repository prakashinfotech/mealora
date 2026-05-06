import { NextResponse } from 'next/server'
import { addressService } from '@server/services/address.service'
import { withAuth } from '@server/middleware/withAuth'

export const GET = withAuth(async (_request, session) => {
  const addresses = await addressService.listForUser(session.user.id)
  return NextResponse.json({ success: true, data: addresses })
})

export const POST = withAuth(async (request, session) => {
  try {
    const body = await request.json()
    const address = await addressService.create(session.user.id, body)
    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
})
