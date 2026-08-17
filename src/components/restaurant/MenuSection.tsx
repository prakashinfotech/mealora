'use client'

import { useState } from 'react'
import { MenuItemCard } from './MenuItemCard'
import type { MenuCategoryWithItems, Restaurant } from '@/types'

interface Props {
  category: MenuCategoryWithItems
  restaurant: Pick<Restaurant, 'id' | 'name'>
}

export function MenuSection({ category, restaurant }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const availableCount = category.items.filter((i) => i.isAvailable).length

  return (
    <section id={`category-${category.id}`} className="mb-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        className="w-full flex items-center justify-between py-4 px-4 sm:px-6 bg-white hover:bg-app-gray-bg/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-app-black">{category.name}</h3>
          <span className="text-xs text-app-gray-light">({availableCount})</span>
        </div>
        <svg
          className={`w-5 h-5 text-app-gray transition-transform duration-300 ${collapsed ? '-rotate-90' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Smooth collapse via grid-rows transition */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-6 bg-white">
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
