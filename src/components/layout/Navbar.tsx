'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { data: session } = useSession()
  const totalItems = useCartStore((s) => s.totalItems())
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="text-2xl font-black text-brand-orange tracking-tight">swiggy</span>
        </Link>

        {/* Location picker (simplified) */}
        <button className="hidden md:flex items-center gap-1 text-sm font-semibold text-swiggy-black hover:text-brand-orange transition-colors ml-4">
          <svg className="w-4 h-4 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="border-b-2 border-swiggy-black">Bangalore</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <Link href="/restaurants" className="text-sm font-semibold text-swiggy-black hover:text-brand-orange transition-colors">
            Restaurants
          </Link>

          {session ? (
            <>
              <Link href="/orders" className="text-sm font-semibold text-swiggy-black hover:text-brand-orange transition-colors">
                My Orders
              </Link>
              <Link href="/cart" className="relative flex items-center gap-1 text-sm font-semibold text-swiggy-black hover:text-brand-orange transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-semibold text-swiggy-black">
                  {session.user.image ? (
                    <Image src={session.user.image} alt="avatar" width={28} height={28} className="rounded-full" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-brand-orange-light text-brand-orange flex items-center justify-center text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                    </span>
                  )}
                  {session.user.name?.split(' ')[0]}
                </button>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-swiggy-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/profile" className="block px-4 py-3 text-sm text-swiggy-black hover:bg-swiggy-gray-bg rounded-t-xl">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-3 text-sm text-swiggy-black hover:bg-swiggy-gray-bg">
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-3 text-sm text-swiggy-red hover:bg-red-50 rounded-b-xl"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-swiggy-black hover:text-brand-orange transition-colors">
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
            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-swiggy-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
            <svg className="w-6 h-6 text-swiggy-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-swiggy-border bg-white px-4 py-4 flex flex-col gap-4">
          <Link href="/restaurants" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-swiggy-black">Restaurants</Link>
          {session ? (
            <>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-swiggy-black">My Orders</Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-swiggy-black">Cart {totalItems > 0 && `(${totalItems})`}</Link>
              <button onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }} className="text-sm font-semibold text-swiggy-red text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-swiggy-black">Log in</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-brand-orange">Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
