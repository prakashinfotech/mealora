'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-swiggy-gray-bg text-center px-4">
        <span className="text-7xl mb-6">⚠️</span>
        <h1 className="text-2xl font-black text-swiggy-black">Something went wrong</h1>
        <p className="text-swiggy-gray text-sm mt-2 max-w-xs">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button onClick={reset} className="btn-primary mt-8">
          Try again
        </button>
      </main>
      <Footer />
    </>
  )
}
