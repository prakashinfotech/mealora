'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface Props {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const ROUTE_LABELS: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/restaurants': 'Restaurants',
  '/admin/orders': 'Orders',
  '/admin/coupons': 'Coupons',
  '/admin/users': 'Users',
}

function getPageTitle(pathname: string): string {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname]
  // Menu sub-routes
  if (pathname.includes('/menu/categories')) return 'Menu Categories'
  if (pathname.includes('/menu/items')) return 'Menu Items'
  if (pathname.includes('/menu')) return 'Menu Management'
  const base = Object.keys(ROUTE_LABELS).find(
    (key) => key !== '/admin' && pathname.startsWith(key),
  )
  return base ? ROUTE_LABELS[base] : 'Admin'
}

export function AdminHeader({ user }: Props) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  const initials = (user.name ?? user.email ?? 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-bold text-slate-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name ?? ''} className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {user.name ?? user.email}
          </span>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
          aria-label="Sign out"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  )
}
