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
    <section
      className="relative bg-swiggy-black text-white overflow-hidden"
      style={{ minHeight: 340 }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-orange opacity-20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 left-10 w-48 h-48 bg-yellow-400 opacity-10 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3">
          Order food &amp; groceries.
        </h1>
        <p className="text-lg text-gray-400 mb-10">
          Delivering to <span className="text-brand-orange font-semibold">Bangalore</span>
        </p>

        <form onSubmit={handleSearch} className="flex max-w-xl mx-auto gap-0 shadow-xl rounded-xl overflow-hidden">
          <div className="flex-1 flex items-center bg-white px-4">
            <svg className="w-5 h-5 text-swiggy-gray-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for restaurants, cuisines..."
              className="flex-1 py-4 px-3 text-swiggy-black text-sm focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-4 text-sm transition-colors"
          >
            {isPending ? '...' : 'Search'}
          </button>
        </form>
      </div>
    </section>
  )
}
