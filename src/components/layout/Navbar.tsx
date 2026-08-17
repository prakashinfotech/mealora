'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { useCityStore } from '@/store/cityStore'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { NavbarLocationSelector, MobileLocationRow } from '@/components/ui/LocationSelector'
import { buildRestaurantsUrl } from '@/lib/navigation'

/** Mealora SVG logo mark — fork-spoon M silhouette */
function MealoraLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Mealora home">
      {/* Icon */}
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="100" height="100" rx="18" fill="#5B4BDB"/>
        {/* Fork left leg */}
        <path d="M22 18 L22 46 Q22 54 30 54 L30 82" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        <path d="M22 18 L22 36" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M30 18 L30 36" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M38 18 L38 36" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        {/* M arch */}
        <path d="M38 42 Q50 22 62 42" stroke="white" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
        {/* Spoon right leg */}
        <circle cx="70" cy="26" r="10" stroke="white" strokeWidth="6" fill="none"/>
        <path d="M70 36 L70 82" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      </svg>
      {/* Wordmark */}
      <span className="text-xl font-black text-brand-primary tracking-tight leading-none">
        Mealora
      </span>
    </Link>
  )
}

export function Navbar() {
  const { data: session, status } = useSession()
  const totalItems = useCartStore((s) => s.totalItems())
  const city = useCityStore((s) => s.city)
  const [menuOpen, setMenuOpen] = useState(false)
  const isLoading = status === 'loading'

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <MealoraLogo />

        {/* Location picker (desktop) */}
        <NavbarLocationSelector />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <Link href={buildRestaurantsUrl({ city })} className="text-sm font-semibold text-app-black hover:text-brand-primary transition-colors">
            Restaurants
          </Link>

          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ) : session ? (
            <>
              <Link href="/orders" className="text-sm font-semibold text-app-black hover:text-brand-primary transition-colors">
                My Orders
              </Link>
              <Link
                href="/cart"
                aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
                className="relative flex items-center gap-1 text-sm font-semibold text-app-black hover:text-brand-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {totalItems > 0 && (
                  <span aria-live="polite" className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="relative group">
                <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-app-black hover:text-brand-primary transition-colors" aria-label="Account menu">
                  {session.user.image ? (
                    <Image src={session.user.image} alt="avatar" width={28} height={28} className="rounded-full" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                    </span>
                  )}
                  {session.user.name?.split(' ')[0]}
                </Link>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-app-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/profile" className="block px-4 py-3 text-sm text-app-black hover:bg-app-gray-bg rounded-t-xl">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-3 text-sm text-app-black hover:bg-app-gray-bg">
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-3 text-sm text-app-red hover:bg-red-50 rounded-b-xl"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-app-black hover:text-brand-primary transition-colors">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4 rounded-lg">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: cart icon + hamburger */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          {totalItems > 0 && (
            <Link href="/cart" aria-label={`Cart, ${totalItems} items`} className="relative">
              <svg className="w-6 h-6 text-app-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="p-1"
          >
            <svg className="w-6 h-6 text-app-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu — always in DOM, height-animated */}
      <div
        className={`md:hidden border-t border-app-border bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* City selector row */}
          <MobileLocationRow onAfterSelect={() => setMenuOpen(false)} />

          <div className="border-t border-app-border" />

          <Link href={buildRestaurantsUrl({ city })} onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-app-black">
            Restaurants
          </Link>
          {!isLoading && session ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-app-black">Profile</Link>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-app-black">My Orders</Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-app-black">
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
                className="text-sm font-semibold text-app-red text-left"
              >
                Sign Out
              </button>
            </>
          ) : !isLoading ? (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-app-black">Log in</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-brand-primary">Sign up</Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
