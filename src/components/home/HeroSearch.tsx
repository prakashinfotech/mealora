'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useCityStore } from '@/store/cityStore'

export function HeroSearch() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const city = useCityStore((s) => s.city)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('search', query.trim())
    params.set('city', city)
    startTransition(() => {
      router.push(`/restaurants?${params.toString()}`)
    })
  }

  return (
    <section className="relative bg-brand-primary text-white overflow-hidden">
      {/* Decorative depth rings */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute top-8 right-1/4 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 md:pt-14 md:pb-24 text-center">
        {/* Headlines */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight mb-1">
          Order food & discover restaurants.
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-black leading-tight text-white/90 mb-10">
          Discover food. Order with ease.
        </p>

        {/* Search bar — single unified input */}
        <form
          onSubmit={handleSearch}
          className="flex max-w-2xl mx-auto rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
        >
          <div className="flex flex-1 items-center bg-white px-5 gap-3">
            <svg
              className="w-5 h-5 text-app-gray-light shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search restaurants in ${city}…`}
              className="flex-1 py-4 text-app-black text-sm focus:outline-none bg-transparent placeholder:text-app-gray-light"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-app-black hover:bg-app-black/90 text-white font-bold px-7 py-4 text-sm transition-colors disabled:opacity-60 shrink-0"
          >
            {isPending ? '…' : 'Search'}
          </button>
        </form>
      </div>
    </section>
  )
}
