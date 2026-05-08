'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useCallback, Suspense } from 'react'

function RouteProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const barRef = useRef<HTMLDivElement>(null)
  const prevRouteRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  // Completes and fades out the bar
  const finish = useCallback(() => {
    const el = barRef.current
    if (!el) return
    clearTimeout(timerRef.current)
    el.style.transition = 'width 0.2s ease'
    el.style.width = '100%'
    timerRef.current = setTimeout(() => {
      if (!barRef.current) return
      barRef.current.style.transition = 'opacity 0.3s ease'
      barRef.current.style.opacity = '0'
      timerRef.current = setTimeout(() => {
        if (!barRef.current) return
        barRef.current.style.transition = 'none'
        barRef.current.style.width = '0%'
      }, 300)
    }, 200)
  }, [])

  // Starts the slow crawl from 0 → 85%
  const start = useCallback(() => {
    const el = barRef.current
    if (!el) return
    clearTimeout(timerRef.current)
    el.style.transition = 'none'
    el.style.opacity = '1'
    el.style.width = '0%'
    void el.offsetWidth // force reflow so the 0% registers before the transition
    el.style.transition = 'width 8s cubic-bezier(0.04, 0.6, 0.2, 0.97)'
    el.style.width = '85%'
  }, [])

  // Detect route change → finish the bar
  useEffect(() => {
    const key = pathname + '?' + searchParams.toString()
    if (prevRouteRef.current === null) {
      prevRouteRef.current = key
      return
    }
    if (key !== prevRouteRef.current) {
      prevRouteRef.current = key
      finish()
    }
  }, [pathname, searchParams, finish])

  // Intercept all internal anchor clicks → start the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Walk up the DOM to find the nearest <a>
      const anchor = (e.target as HTMLElement).closest('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      // Skip external links, hash links, and special protocols
      if (!href || /^(https?:|\/\/|mailto:|tel:|#)/.test(href)) return
      // Skip modifier clicks (open in new tab etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      start()
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [start])

  return (
    <>
      <div
        ref={barRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: '0%',
          opacity: 0,
          zIndex: 9999,
          backgroundColor: '#FC8019',
          boxShadow: '0 0 8px rgba(252,128,25,0.6)',
          pointerEvents: 'none',
        }}
      />
      {/* Screen-reader announcement so assistive tech knows the page is loading */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="route-progress-sr" />
    </>
  )
}

// Wrapped in Suspense because useSearchParams() requires it in App Router
export function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBar />
    </Suspense>
  )
}
