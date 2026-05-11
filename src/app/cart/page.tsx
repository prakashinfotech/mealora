'use client'

import { useCartStore } from '@/store/cartStore'
import { useCityStore } from '@/store/cityStore'
import { buildRestaurantsUrl } from '@/lib/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartItemRow } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { calculateTaxes, calculateDeliveryFee, FREE_DELIVERY_THRESHOLD } from '@/lib/utils'

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const city = useCityStore((s) => s.city)
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const restaurantName = useCartStore((s) => s.restaurantName)
  const restaurantId = useCartStore((s) => s.restaurantId)
  const clearCart = useCartStore((s) => s.clearCart)

  const deliveryFee = calculateDeliveryFee(subtotal)
  const taxes = calculateTaxes(subtotal)

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="bg-swiggy-gray-bg py-16 flex items-center justify-center">
          <div className="text-center">
            <span className="text-7xl">🛒</span>
            <h2 className="text-2xl font-black text-swiggy-black mt-6">Your cart is empty</h2>
            <p className="text-swiggy-gray mt-2">Add items from a restaurant to get started.</p>
            <Link href={buildRestaurantsUrl({ city })} className="btn-primary inline-block mt-6">
              Browse restaurants
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-swiggy-gray-bg py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-black text-swiggy-black mb-6">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Restaurant info */}
              <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-card">
                <div>
                  <p className="text-xs text-swiggy-gray uppercase font-semibold tracking-wide">Ordering from</p>
                  <Link
                    href={restaurantId ? `/restaurants/${restaurantId}` : '#'}
                    className="font-bold text-swiggy-black hover:text-brand-orange transition-colors"
                  >
                    {restaurantName}
                  </Link>
                </div>
                <button
                  onClick={() => clearCart()}
                  className="text-xs text-swiggy-red font-semibold hover:underline"
                >
                  Clear cart
                </button>
              </div>

              {/* Items list */}
              <div className="bg-white rounded-2xl shadow-card px-4 sm:px-6">
                {items.map((item) => (
                  <CartItemRow key={item.menuItemId} item={item} />
                ))}
              </div>

              {/* Delivery note */}
              {subtotal < FREE_DELIVERY_THRESHOLD && (
                <div className="bg-brand-orange-light border border-orange-200 rounded-xl px-4 py-3 text-sm text-swiggy-black">
                  Add <span className="font-bold text-brand-orange">{formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)}</span> more for free delivery!
                </div>
              )}

              {/* Add more items */}
              <Link
                href={restaurantId ? `/restaurants/${restaurantId}` : '/restaurants'}
                className="flex items-center gap-2 text-brand-orange text-sm font-semibold hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add more items
              </Link>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-swiggy-black mb-4">Bill Details</h3>
                <CartSummary
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  taxes={taxes}
                />
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full"
              >
                Proceed to Checkout
              </Button>

              <p className="text-xs text-center text-swiggy-gray-light">
                By placing your order, you agree to our{' '}
                <Link href="#" className="underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
