'use client'

import { useState, useEffect, useRef } from 'react'
import { CouponCard, type CouponCardData } from './CouponCard'
import { CouponInput } from './CouponInput'
import type { CouponApplied } from '@/types'

interface Props {
  subtotal: number
  applied: CouponApplied | null
  onApply: (coupon: CouponApplied) => void
  onRemove: () => void
}

type FetchState = 'idle' | 'loading' | 'done' | 'error'

export function CouponSelector({ subtotal, applied, onApply, onRemove }: Props) {
  const [open, setOpen] = useState(false)
  const [coupons, setCoupons] = useState<CouponCardData[]>([])
  const [fetchState, setFetchState] = useState<FetchState>('idle')
  const [applyingCode, setApplyingCode] = useState<string | null>(null)
  const [applyError, setApplyError] = useState('')
  const [showManual, setShowManual] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!open || hasFetched.current) return
    hasFetched.current = true
    setFetchState('loading')
    fetch('/api/coupons')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCoupons(data.data)
          setFetchState('done')
        } else {
          setFetchState('error')
        }
      })
      .catch(() => setFetchState('error'))
  }, [open])

  const handleApplyCard = async (code: string) => {
    setApplyingCode(code)
    setApplyError('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Invalid coupon.')
      onApply({ code: data.data.code, title: data.data.title, discount: data.data.discount })
      setOpen(false)
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Failed to apply coupon.')
    } finally {
      setApplyingCode(null)
    }
  }

  const handleRemove = () => {
    onRemove()
    setApplyError('')
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
          <span className="text-sm font-bold text-app-green">
            − {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(applied.discount)}
          </span>
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
    <div>
      {/* Trigger row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed border-brand-primary/50 hover:border-brand-primary bg-brand-primary-light/40 hover:bg-brand-primary-light transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
          </svg>
          <span className="text-sm font-bold text-brand-primary">View available offers</span>
        </div>
        <svg
          className={`w-4 h-4 text-brand-primary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expandable panel */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 space-y-3">
            {/* Loading skeletons */}
            {fetchState === 'loading' && (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border-2 border-app-border p-4 animate-pulse">
                    <div className="h-3.5 w-24 bg-app-border rounded mb-2" />
                    <div className="h-3 w-40 bg-app-border rounded mb-3" />
                    <div className="border-t border-app-border/60 my-3" />
                    <div className="flex justify-between">
                      <div className="h-3 w-28 bg-app-border rounded" />
                      <div className="h-7 w-14 bg-app-border rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {fetchState === 'error' && (
              <p className="text-xs text-app-red text-center py-2">
                Failed to load coupons. Please try again.
              </p>
            )}

            {fetchState === 'done' && coupons.length === 0 && (
              <p className="text-xs text-app-gray text-center py-2">No offers available right now.</p>
            )}

            {fetchState === 'done' && coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                subtotal={subtotal}
                isApplied={false}
                isApplying={applyingCode === coupon.code}
                onApply={() => handleApplyCard(coupon.code)}
                onRemove={handleRemove}
              />
            ))}

            {applyError && (
              <p className="text-xs text-app-red flex items-center gap-1 px-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {applyError}
              </p>
            )}

            {/* Manual entry toggle */}
            <div>
              <button
                onClick={() => setShowManual((v) => !v)}
                className="text-xs text-app-gray hover:text-app-black font-medium transition-colors flex items-center gap-1"
              >
                <svg className={`w-3 h-3 transition-transform duration-150 ${showManual ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                Enter code manually
              </button>

              <div className={`grid transition-all duration-200 ${showManual ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <CouponInput
                    subtotal={subtotal}
                    applied={null}
                    onApply={(coupon) => { onApply(coupon); setOpen(false) }}
                    onRemove={onRemove}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
