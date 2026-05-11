export { default } from 'next-auth/middleware'

export const config = {
  // next-auth/middleware ensures a valid session exists.
  // Role guard (ADMIN only) for /admin is enforced in src/app/admin/layout.tsx.
  matcher: [
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/admin/:path*',
  ],
}
