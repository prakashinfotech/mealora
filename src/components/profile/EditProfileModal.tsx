'use client'

import { useState } from 'react'
import type { ProfileUser } from './ProfileContent'

interface Props {
  user: ProfileUser
  onSuccess: (updated: ProfileUser) => void
  onClose: () => void
}

export function EditProfileModal({ user, onSuccess, onClose }: Props) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      setError('Phone must be exactly 10 digits.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Update failed.')
      onSuccess({
        ...user,
        name: json.data.name,
        phone: json.data.phone ?? null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-swiggy-black">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-swiggy-gray-bg text-swiggy-gray transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-swiggy-gray uppercase tracking-wide mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full border border-swiggy-border rounded-xl px-4 py-3 text-sm text-swiggy-black focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-swiggy-gray uppercase tracking-wide mb-1.5">
              Mobile number <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full border border-swiggy-border rounded-xl px-4 py-3 text-sm text-swiggy-black focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-swiggy-gray uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-swiggy-border rounded-xl px-4 py-3 text-sm text-swiggy-gray-light bg-swiggy-gray-bg cursor-not-allowed"
            />
            <p className="text-xs text-swiggy-gray-light mt-1">Email cannot be changed.</p>
          </div>

          {error && (
            <p className="text-xs font-semibold text-swiggy-red bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-swiggy-border text-sm font-semibold text-swiggy-black hover:bg-swiggy-gray-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
