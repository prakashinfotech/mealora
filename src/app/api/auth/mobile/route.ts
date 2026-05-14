import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { encode } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = (body.email as string | undefined)?.trim().toLowerCase()
    const password = body.password as string | undefined

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 422 },
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 },
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 },
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const sessionToken = await encode({
      token: {
        sub: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.image ?? null,
        role: user.role,
        iat: now,
        exp: now + SESSION_MAX_AGE,
        jti: crypto.randomUUID(),
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: SESSION_MAX_AGE,
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          phone: user.phone ?? null,
          role: user.role,
        },
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
