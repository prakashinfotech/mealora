'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
import { loadRazorpayScript } from '@/lib/razorpay'
import { setOrderPlacedFlag } from '@/components/order/OrderSuccessBanner'
import type { Address, PaymentMode, RazorpayCreateOrderResponse } from '@/types'

type PaymentStage = 'idle' | 'preparing' | 'processing' | 'verifying'

const PAYMENT_NOT_CONFIGURED = 'Online payments are not configured.'

function CheckoutError({ message }: { message: string }) {
  const isConfigError = message.includes(PAYMENT_NOT_CONFIGURED)

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 space-y-1"
    >
      <p className="text-sm font-semibold text-swiggy-red">
        {isConfigError ? 'Online payment unavailable' : 'Something went wrong'}
      </p>
      <p className="text-xs text-red-600 leading-snug">
        {isConfigError
          ? 'Please use Cash on Delivery, or try again later.'
          : message}
      </p>
      {isConfigError && process.env.NODE_ENV === 'development' && (
        <p className="text-xs text-red-400 font-mono mt-1 leading-snug">
          Dev: add NEXT_PUBLIC_RAZORPAY_KEY_ID &amp; RAZORPAY_KEY_SECRET to .env.local and restart.
        </p>
      )}
    </div>
  )
}

const PAYMENT_OPTIONS: { mode: PaymentMode; label: string; description: string; icon: string }[] = [
  { mode: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', description: 'Pay when your order arrives', icon: '💵' },
  { mode: 'ONLINE', label: 'Pay Online', description: 'UPI · Cards · Net Banking · Wallets · EMI', icon: '💳' },
]

const STAGE_LABELS: Record<PaymentStage, string> = {
  idle: '',
  preparing: 'Creating payment…',
  processing: 'Opening payment window…',
  verifying: 'Verifying payment…',
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const restaurantId = useCartStore((s) => s.restaurantId)
  const restaurantName = useCartStore((s) => s.restaurantName)
  const clearCart = useCartStore((s) => s.clearCart)
  const currentCity = useCityStore((s) => s.city)

  const deliveryFee = calculateDeliveryFee(subtotal)
  const taxes = calculateTaxes(subtotal)

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH_ON_DELIVERY')
  const [placing, setPlacing] = useState(false)
  const [paymentStage, setPaymentStage] = useState<PaymentStage>('idle')
  const [error, setError] = useState('')
  const orderDone = useRef(false)

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
    // Skip the cart redirect if we just placed an order — clearCart() fires
    // before router.push('/orders') completes, which would hijack the redirect.
    if (items.length === 0 && !orderDone.current) {
      router.push('/cart')
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

  const handleCODOrder = async () => {
    setPlacing(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          addressId: selectedAddressId,
          paymentMode: 'CASH_ON_DELIVERY',
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
      orderDone.current = true
      setOrderPlacedFlag()
      clearCart()
      router.push('/orders')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPlacing(false)
    }
  }

  const handlePaymentSuccess = useCallback(
    async (
      response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string },
      rzpData: RazorpayCreateOrderResponse,
    ) => {
      setPaymentStage('verifying')
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            restaurantId,
            addressId: selectedAddressId,
            items: rzpData.items,
            subtotal: rzpData.subtotal,
            deliveryFee: rzpData.deliveryFee,
            taxes: rzpData.taxes,
            discount: 0,
            total: rzpData.total,
          }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error ?? 'Payment verification failed.')
        orderDone.current = true
        setOrderPlacedFlag()
        clearCart()
        router.push('/orders')
      } catch (err) {
        setPaymentStage('idle')
        setError(
          err instanceof Error
            ? err.message
            : 'Payment verification failed. Please contact support with your payment ID.',
        )
      }
    },
    [restaurantId, selectedAddressId, clearCart, router],
  )

  const handleOnlinePayment = async () => {
    setPaymentStage('preparing')
    setError('')
    try {
      const createRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        }),
      })
      const createData = await createRes.json()
      if (!createData.success) {
        if (createData.error?.includes(PAYMENT_NOT_CONFIGURED)) {
          setPaymentMode('CASH_ON_DELIVERY')
        }
        throw new Error(createData.error ?? 'Failed to initiate payment.')
      }

      const rzpData: RazorpayCreateOrderResponse = createData.data

      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Payment SDK failed to load. Please check your connection and try again.')

      setPaymentStage('processing')

      const rzp = new window.Razorpay({
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Swiggy Clone',
        description: `Order from ${restaurantName ?? 'restaurant'}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: session?.user?.name ?? '',
          email: session?.user?.email ?? '',
        },
        theme: { color: '#fc8019' },
        modal: {
          ondismiss: () => {
            setPaymentStage('idle')
            setError('Payment was cancelled. Your cart is still intact.')
          },
        },
        handler: (response) => {
          handlePaymentSuccess(response, rzpData)
        },
      })

      rzp.open()
    } catch (err) {
      setPaymentStage('idle')
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    }
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address.')
      return
    }
    if (paymentMode === 'ONLINE') {
      handleOnlinePayment()
    } else {
      handleCODOrder()
    }
  }

  const isBusy = placing || paymentStage !== 'idle'

  const buttonLabel = () => {
    if (placing) return 'Placing order…'
    if (paymentStage !== 'idle') return STAGE_LABELS[paymentStage]
    if (paymentMode === 'ONLINE') return `Pay ${formatPrice(subtotal + deliveryFee + taxes)}`
    return 'Place Order'
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
                      <div>
                        <p className="text-sm font-semibold text-swiggy-black">{opt.label}</p>
                        <p className="text-xs text-swiggy-gray">{opt.description}</p>
                      </div>
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

              {error && <CheckoutError message={error} />}

              {paymentStage === 'verifying' && (
                <div className="flex items-center gap-2 text-sm text-swiggy-gray bg-white rounded-lg px-4 py-3 shadow-card">
                  <svg className="animate-spin w-4 h-4 text-brand-orange shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying your payment, please wait…
                </div>
              )}

              <Button
                onClick={handlePlaceOrder}
                loading={isBusy}
                disabled={isBusy}
                size="lg"
                className="w-full"
              >
                {buttonLabel()}
              </Button>

              {paymentMode === 'ONLINE' && paymentStage === 'idle' && (
                <p className="text-xs text-center text-swiggy-gray">
                  Secured by Razorpay · 256-bit SSL encryption
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
