import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import type { Session } from 'next-auth'

type AdminHandler = (
  request: Request,
  session: Session,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>

/**
 * Wraps a route handler, returning 401 if unauthenticated or 403 if not ADMIN.
 * Usage: export const GET = withAdmin(async (req, session) => { ... })
 */
export function withAdmin(handler: AdminHandler) {
  return async (
    request: Request,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden.' }, { status: 403 })
    }

    return handler(request, session, context)
  }
}
