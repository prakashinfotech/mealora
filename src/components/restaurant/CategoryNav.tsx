'use client'

import { useEffect, useRef, useState } from 'react'

interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
}

export function CategoryNav({ categories }: Props) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? '')
  const navRef = useRef<HTMLDivElement>(null)
  const userScrolling = useRef(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    for (const cat of categories) {
      const el = document.getElementById(`category-${cat.id}`)
      if (!el) continue
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!userScrolling.current && entry.isIntersecting) {
            setActiveId(cat.id)
          }
        },
        { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [categories])

  // Scroll active chip into view inside the nav bar
  useEffect(() => {
    if (!navRef.current) return
    const chip = navRef.current.querySelector<HTMLElement>(`[data-id="${activeId}"]`)
    chip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeId])

  if (categories.length <= 1) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setActiveId(id)

    // Suppress IntersectionObserver updates during programmatic scroll
    userScrolling.current = true
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      userScrolling.current = false
    }, 800)

    const el = document.getElementById(`category-${id}`)
    if (!el) return
    // 64px navbar + 48px this sticky nav + 8px gap
    const offset = 128
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div className="sticky top-16 z-30 bg-white border-b border-app-border shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div ref={navRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide py-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              data-id={cat.id}
              href={`#category-${cat.id}`}
              onClick={(e) => handleClick(e, cat.id)}
              className={`shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                activeId === cat.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white border border-app-border text-app-black hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
