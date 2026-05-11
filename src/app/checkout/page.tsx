'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { useCityStore } from '@/store/cityStore'
import { formatPrice, calculateTaxes, calculateDeliveryFee } from '@/lib/utils'
import type { Address, PaymentMode } from '@/types'

const PAYMENT_OPTIONS: { mode: PaymentMode; label: string; icon: string }[] = [
  { mode: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: '💵' },
  { mode: 'ONLINE', label: 'Pay Online (Mock)', icon: '💳' },
  { mode: 'WALLET', label: 'Swiggy Wallet', icon: '👛' },
]

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const restaurantId = useCartStore((s) => s.restaurantId)
  const clearCart = useCartStore((s) => s.clearCart)
  const currentCity = useCityStore((s) => s.city)

  const deliveryFee = calculateDeliveryFee(subtotal)
  const taxes = calculateTaxes(subtotal)

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH_ON_DELIVERY')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  // New address form state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    line1: '',
    city: currentCity,
    state: '',
    pincode: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
      return
    }
    if (items.length === 0) {
      router.push('/cart')
      return
    }
  }, [status, items.length, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/addresses')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setAddresses(data.data)
          const def = data.data.find((a: Address) => a.isDefault) ?? data.data[0]
          setSelectedAddressId(def.id)
        } else {
          setShowAddressForm(true)
        }
      })
      .catch(() => setShowAddressForm(true))
  }, [session])

  const saveNewAddress = async () => {
    if (!newAddress.line1 || !newAddress.pincode) {
      setError('Please fill in the address fields.')
      return
    }
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
    })
    const data = await res.json()
    if (data.success) {
      setAddresses((prev) => [...prev, data.data])
      setSelectedAddressId(data.data.id)
      setShowAddressForm(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address.')
      return
    }
    setPlacing(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          addressId: selectedAddressId,
          paymentMode,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal,
          deliveryFee,
          taxes,
          discount: 0,
          total: subtotal + deliveryFee + taxes,
        }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Failed to place order')

      clearCart()
      router.push(`/orders/${data.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPlacing(false)
    }
  }

  if (status === 'loading') return null

  return (
    <>
      <Navbar />
      <main className="bg-swiggy-gray-bg py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-black text-swiggy-black mb-6">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Delivery address */}
              <section className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-swiggy-black">Delivery Address</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-brand-orange text-sm font-semibold"
                  >
                    + Add new
                  </button>
                </div>

                {showAddressForm && (
                  <div className="mb-4 p-4 border border-swiggy-border rounded-xl space-y-3">
                    <div className="flex gap-2">
                      {['Home', 'Work', 'Other'].map((l) => (
                        <button
                          key={l}
                          onClick={() => setNewAddress((p) => ({ ...p, label: l }))}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                            newAddress.label === l
                              ? 'bg-brand-orange text-white border-brand-orange'
                              : 'text-swiggy-black border-swiggy-border'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder="Street address, apartment, area"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress((p) => ({ ...p, line1: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                      />
                      <Input
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress((p) => ({ ...p, pincode: e.target.value }))}
                      />
                    </div>
                    <Button size="sm" onClick={saveNewAddress}>Save Address</Button>
                  </div>
                )}

                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? 'border-brand-orange bg-brand-orange-light'
                          : 'border-swiggy-border hover:border-swiggy-gray-light'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-brand-orange"
                      />
                      <div>
                        <span className="text-xs font-bold uppercase text-brand-orange">{addr.label}</span>
                        <p className="text-sm text-swiggy-black mt-0.5">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                        </p>
                        <p className="text-xs text-swiggy-gray">{addr.city}, {addr.state} — {addr.pincode}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment */}
              <section className="bg-white rounded-2xl shadow-card p-5">
                <h2 className="font-bold text-swiggy-black mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.mode}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMode === opt.mode
                          ? 'border-brand-orange bg-brand-orange-light'
                          : 'border-swiggy-border hover:border-swiggy-gray-light'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.mode}
                        checked={paymentMode === opt.mode}
                        onChange={() => setPaymentMode(opt.mode)}
                        className="accent-brand-orange"
                      />
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-sm font-semibold text-swiggy-black">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Order summary items */}
              <section className="bg-white rounded-2xl shadow-card p-5">
                <h2 className="font-bold text-swiggy-black mb-4">Order Summary</h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between text-sm">
                      <span className="text-swiggy-black">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-swiggy-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: bill + CTA */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-swiggy-black mb-4">Bill Details</h3>
                <CartSummary
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  taxes={taxes}
                />
              </div>

              {error && (
                <p className="text-sm text-swiggy-red bg-red-50 rounded-lg px-4 py-3">{error}</p>
              )}

              <Button
                onClick={handlePlaceOrder}
                loading={placing}
                size="lg"
                className="w-full"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
