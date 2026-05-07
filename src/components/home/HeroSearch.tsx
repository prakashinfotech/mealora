'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function HeroSearch() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    startTransition(() => {
      router.push(`/restaurants?search=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <section className="relative bg-brand-orange text-white overflow-hidden min-h-[340px]">
      {/* Subtle circular overlays for depth */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute top-8 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-20 md:pt-16 md:pb-24 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-[52px] font-black leading-tight tracking-tight mb-1">
          Order food &amp; groceries.
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight opacity-90 mb-10">
          Discover best restaurants. Swiggy it!
        </p>

        {/* Two-part search bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Location picker (visual) */}
          <button
            type="button"
            className="flex items-center gap-2 bg-white px-5 py-4 text-swiggy-black sm:border-r border-swiggy-border shrink-0 hover:bg-swiggy-gray-bg transition-colors"
          >
            <svg className="w-4 h-4 text-brand-orange shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-swiggy-black whitespace-nowrap">Bangalore, KA</span>
            <svg className="w-4 h-4 text-swiggy-gray ml-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Search input */}
          <div className="flex flex-1 items-center bg-white px-4">
            <svg className="w-5 h-5 text-swiggy-gray-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for restaurant, item or more"
              className="flex-1 py-4 px-3 text-swiggy-black text-sm focus:outline-none bg-transparent placeholder:text-swiggy-gray-light"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-swiggy-black hover:bg-swiggy-black/90 text-white font-bold px-7 py-4 text-sm transition-colors disabled:opacity-60"
          >
            {isPending ? '...' : 'Search'}
          </button>
        </form>
      </div>
    </section>
  )
}
