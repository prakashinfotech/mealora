'use client'

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
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
      <h2 className="section-title mb-6">What&apos;s on your mind?</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={`/restaurants?cuisine=${cat.query}`}
            className="flex flex-col items-center gap-2 shrink-0 group"
          >
            <div className="w-20 h-20 bg-swiggy-gray-bg rounded-full flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-200 shadow-sm">
              {cat.emoji}
            </div>
            <span className="text-xs font-medium text-swiggy-gray text-center w-20 leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
