import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import type { Session } from 'next-auth'

type AuthedHandler = (
  request: Request,
  session: Session,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>

/**
 * Wraps a route handler, returning 401 if the user is not authenticated.
 * Usage: export const GET = withAuth(async (req, session) => { ... })
 */
export function withAuth(handler: AuthedHandler) {
  return async (
    request: Request,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    return handler(request, session, context)
  }
}
