'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import type { CouponApplied } from '@/types'

interface Props {
  subtotal: number
  applied: CouponApplied | null
  onApply: (coupon: CouponApplied) => void
  onRemove: () => void
}

export function CouponInput({ subtotal, applied, onApply, onRemove }: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setError('Please enter a coupon code.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, subtotal }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Invalid coupon.')
      onApply({ code: data.data.code, title: data.data.title, discount: data.data.discount })
      setCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply coupon.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    onRemove()
    setCode('')
    setError('')
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 bg-app-green/10 border border-app-green/30 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-app-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="min-w-0">
            <span className="text-xs font-bold text-app-green uppercase tracking-wide">{applied.code}</span>
            <p className="text-xs text-app-gray truncate">{applied.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-bold text-app-green">− {formatPrice(applied.discount)}</span>
          <button
            onClick={handleRemove}
            className="text-xs text-app-gray hover:text-app-red font-semibold transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Enter coupon code"
          className="flex-1 border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-black placeholder:text-app-gray-light focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary uppercase tracking-wide transition"
          disabled={loading}
          maxLength={20}
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary-dark transition-colors shrink-0"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-app-red flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
