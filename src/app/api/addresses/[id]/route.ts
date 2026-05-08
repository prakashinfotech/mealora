import { NextResponse } from 'next/server'
import { addressService } from '@server/services/address.service'
import { withAuth } from '@server/middleware/withAuth'

export const PATCH = withAuth(async (_request, session, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ success: false, error: 'Missing id.' }, { status: 400 })

  await addressService.setDefault(session.user.id, id)
  return NextResponse.json({ success: true })
})

export const DELETE = withAuth(async (_request, session, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ success: false, error: 'Missing id.' }, { status: 400 })

  await addressService.delete(session.user.id, id)
  return NextResponse.json({ success: true })
})
