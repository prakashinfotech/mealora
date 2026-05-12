'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  validateName,
  validateEmail,
  validatePhone,
  validateNewPassword,
  validateConfirmPassword,
} from '@/lib/form-validation'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

type FormFields = 'name' | 'email' | 'phone' | 'password' | 'confirm'

const INITIAL_ERRORS: Record<FormFields, string> = {
  name: '', email: '', phone: '', password: '', confirm: '',
}

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'phone'
      ? e.target.value.replace(/\D/g, '').slice(0, 10)
      : e.target.value
    setForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => ({ ...p, [field]: '' }))
  }

  const handleBlur = (field: FormFields) => {
    let err = ''
    if (field === 'name') err = validateName(form.name)
    else if (field === 'email') err = validateEmail(form.email)
    else if (field === 'phone') err = validatePhone(form.phone)
    else if (field === 'password') err = validateNewPassword(form.password)
    else if (field === 'confirm') err = validateConfirmPassword(form.password, form.confirm)
    setErrors((p) => ({ ...p, [field]: err }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    const next: Record<FormFields, string> = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validateNewPassword(form.password),
      confirm: validateConfirmPassword(form.password, form.confirm),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone || undefined, password: form.password }),
    })
    const data = await res.json()

    if (!data.success) {
      setServerError(data.error ?? 'Registration failed.')
      setLoading(false)
      return
    }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/')
    router.refresh()
  }

  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-swiggy-gray hover:text-swiggy-black transition-colors"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  )

  return (
    <div className="min-h-screen bg-swiggy-gray-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-brand-orange">swiggy</Link>
          <h1 className="text-2xl font-black text-swiggy-black mt-4">Create account</h1>
          <p className="text-swiggy-gray mt-1 text-sm">Join millions of happy customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.name}
              onChange={set('name')}
              onBlur={() => handleBlur('name')}
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={set('phone')}
              onBlur={() => handleBlur('phone')}
              error={errors.phone}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={set('password')}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              autoComplete="new-password"
              rightIcon={
                <PasswordToggle
                  show={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              }
            />
            <Input
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.confirm}
              onChange={set('confirm')}
              onBlur={() => handleBlur('confirm')}
              error={errors.confirm}
              autoComplete="new-password"
              rightIcon={
                <PasswordToggle
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                />
              }
            />

            {serverError && (
              <p className="text-sm text-swiggy-red bg-red-50 rounded-lg px-3 py-2">{serverError}</p>
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
