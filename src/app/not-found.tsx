import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-swiggy-gray-bg text-center px-4">
        <span className="text-7xl mb-6">😕</span>
        <h1 className="text-3xl font-black text-swiggy-black">Page not found</h1>
        <p className="text-swiggy-gray mt-2 text-sm max-w-xs">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to Home
        </Link>
      </main>
      <Footer />
    </>
  )
}
