'use client'

import { useRef } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { name: 'Pizza', emoji: '🍕', query: 'pizza' },
  { name: 'Biryani', emoji: '🍛', query: 'biryani' },
  { name: 'Burgers', emoji: '🍔', query: 'burgers' },
  { name: 'Chinese', emoji: '🍜', query: 'chinese' },
  { name: 'South Indian', emoji: '🥘', query: 'south+indian' },
  { name: 'Desserts', emoji: '🍰', query: 'desserts' },
  { name: 'Rolls', emoji: '🌯', query: 'rolls' },
  { name: 'Pasta', emoji: '🍝', query: 'pasta' },
  { name: 'Sushi', emoji: '🍣', query: 'sushi' },
  { name: 'Momos', emoji: '🥟', query: 'momos' },
  { name: 'Thali', emoji: '🍱', query: 'thali' },
  { name: 'Ice Cream', emoji: '🍦', query: 'ice+cream' },
]

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-swiggy-black">What&apos;s on your mind?</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border-2 border-swiggy-border flex items-center justify-center text-swiggy-gray hover:border-swiggy-black hover:text-swiggy-black transition-colors text-sm font-bold"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border-2 border-swiggy-border flex items-center justify-center text-swiggy-gray hover:border-swiggy-black hover:text-swiggy-black transition-colors text-sm font-bold"
          >
            →
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={`/restaurants?cuisine=${cat.query}`}
            className="flex flex-col items-center gap-2.5 shrink-0 group"
          >
            <div className="w-24 h-24 bg-swiggy-gray-bg rounded-full flex items-center justify-center text-4xl group-hover:scale-105 group-hover:shadow-lg transition-all duration-200">
              {cat.emoji}
            </div>
            <span className="text-xs font-semibold text-swiggy-black text-center w-24 leading-tight group-hover:text-brand-orange transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
