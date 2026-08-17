'use client'

import { useEffect, useState } from 'react'

const FLAG_KEY = 'mealora_order_placed'

export function setOrderPlacedFlag() {
  try { sessionStorage.setItem(FLAG_KEY, '1') } catch { /* ignore */ }
}

export function OrderSuccessBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(FLAG_KEY) === '1') {
        sessionStorage.removeItem(FLAG_KEY)
        setVisible(true)
      }
    } catch { /* sessionStorage unavailable */ }
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(t)
  }, [visible])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 bg-app-green/10 border border-app-green/30 rounded-2xl px-4 py-4 mb-6 animate-fade-in"
    >
      <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-app-green flex items-center justify-center">
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <div className="flex-1">
        <p className="font-bold text-app-green text-sm">Order placed successfully!</p>
        <p className="text-xs text-app-gray mt-0.5">
          We&apos;ve received your order and the restaurant is being notified.
        </p>
      </div>

      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        className="text-app-gray-light hover:text-app-gray transition-colors mt-0.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
