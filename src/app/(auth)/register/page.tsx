'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    })

    const data = await res.json()

    if (!data.success) {
      setError(data.error ?? 'Registration failed.')
      setLoading(false)
      return
    }

    // Auto sign-in after registration
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-swiggy-gray-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-brand-orange">swiggy</Link>
          <h1 className="text-2xl font-black text-swiggy-black mt-4">Create account</h1>
          <p className="text-swiggy-gray mt-1 text-sm">Join millions of happy customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={set('name')} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
            <Input label="Phone (optional)" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            <Input label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required autoComplete="new-password" />
            <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password" />

            {error && (
              <p className="text-sm text-swiggy-red bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-swiggy-gray mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-orange font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
