'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCityStore, CITIES } from '@/store/cityStore'

// ─── Shared dropdown ──────────────────────────────────────────────────────────

function CityDropdown({
  open,
  selected,
  onSelect,
  align = 'left',
}: {
  open: boolean
  selected: string
  onSelect: (city: string) => void
  align?: 'left' | 'right'
}) {
  return (
    <div
      role="listbox"
      aria-label="Select city"
      className={[
        'absolute top-full mt-2 w-60 bg-white border border-swiggy-border rounded-2xl shadow-2xl z-[60] overflow-hidden',
        'transition-all duration-200 ease-out',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none',
        align === 'right' ? 'right-0' : 'left-0',
      ].join(' ')}
    >
      <div className="px-4 py-3 border-b border-swiggy-border">
        <p className="text-[11px] font-black text-swiggy-gray uppercase tracking-widest">
          Select your city
        </p>
      </div>

      <ul className="py-1.5 max-h-72 overflow-y-auto">
        {CITIES.map((c) => {
          const isSelected = selected === c.name
          return (
            <li key={c.name}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(c.name)}
                className={[
                  'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors',
                  isSelected
                    ? 'bg-brand-orange-light text-brand-orange font-bold'
                    : 'text-swiggy-black hover:bg-swiggy-gray-bg font-medium',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5">
                  <svg
                    className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-brand-orange' : 'text-swiggy-gray-light'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{c.name}</span>
                </div>
                {isSelected && (
                  <svg className="w-4 h-4 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ─── Hook: shared open/close logic ───────────────────────────────────────────

function useCityDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { city, stateAbbr, setCity } = useCityStore()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open, close])

  const handleSelect = useCallback(
    (name: string) => {
      setCity(name)
      close()
      // Stay on homepage or restaurants listing; navigate away from detail/other pages
      if (pathname === '/' || pathname === '/restaurants') {
        router.push(`${pathname}?city=${encodeURIComponent(name)}`)
      } else {
        router.push(`/restaurants?city=${encodeURIComponent(name)}`)
      }
    },
    [setCity, close, router, pathname]
  )

  return { open, setOpen, ref, city, stateAbbr, handleSelect }
}

// ─── Navbar variant (desktop) ────────────────────────────────────────────────

export function NavbarLocationSelector() {
  const { open, setOpen, ref, city, handleSelect } = useCityDropdown()

  return (
    <div ref={ref} className="relative hidden md:block ml-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change delivery city"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 text-sm font-semibold text-swiggy-black hover:text-brand-orange transition-colors"
      >
        <svg className="w-4 h-4 text-brand-orange shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="border-b-2 border-current">{city}</span>
        <svg
          className={`w-3 h-3 text-swiggy-gray transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <CityDropdown open={open} selected={city} onSelect={handleSelect} align="left" />
    </div>
  )
}

// ─── Mobile menu row variant ─────────────────────────────────────────────────

export function MobileLocationRow({ onAfterSelect }: { onAfterSelect?: () => void }) {
  const { open, setOpen, ref, city, stateAbbr, handleSelect } = useCityDropdown()

  const select = (name: string) => {
    handleSelect(name)
    onAfterSelect?.()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 text-sm font-semibold text-swiggy-black w-full"
      >
        <svg className="w-4 h-4 text-brand-orange shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          {city}
          {stateAbbr && <span className="text-swiggy-gray font-normal">, {stateAbbr}</span>}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-swiggy-gray ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* On mobile, inline expanded list instead of floating dropdown */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-80 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="bg-swiggy-gray-bg rounded-xl overflow-hidden">
          {CITIES.map((c) => {
            const isSelected = city === c.name
            return (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => select(c.name)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? 'text-brand-orange font-bold bg-brand-orange-light'
                      : 'text-swiggy-black hover:bg-swiggy-border'
                  }`}
                >
                  {c.name}
                  {isSelected && (
                    <svg className="w-4 h-4 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

