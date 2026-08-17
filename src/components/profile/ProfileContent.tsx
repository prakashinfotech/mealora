'use client'

import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { ProfileField } from './ProfileField'
import { AddressCard } from './AddressCard'
import { OrderPreviewCard, type ProfileOrder } from './OrderPreviewCard'
import { EmptyState } from './EmptyState'
import { EditProfileModal } from './EditProfileModal'
import { AddressModal } from './AddressModal'
import { Toast, type ToastState } from '@/components/ui/Toast'
import { useSettingsStore } from '@/store/settingsStore'
import { useCityStore } from '@/store/cityStore'
import { buildRestaurantsUrl } from '@/lib/navigation'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileUser {
  id: string
  name: string
  email: string
  phone: string | null
  image: string | null
  createdAt: string
}

export interface ProfileAddress {
  id: string
  label: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface Props {
  user: ProfileUser
  orders: ProfileOrder[]
  addresses: ProfileAddress[]
}

type Section = 'overview' | 'orders' | 'addresses' | 'payments' | 'settings'

// ─── Sidebar nav config ───────────────────────────────────────────────────────

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'My Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'My Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'addresses',
    label: 'Saved Addresses',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, image, size = 'md' }: { name: string; image: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const dims = { sm: 32, md: 44, lg: 72 }[size]
  const textClass = { sm: 'text-xs', md: 'text-sm', lg: 'text-2xl' }[size]

  if (image) {
    return (
      <Image src={image} alt={name} width={dims} height={dims}
        className="rounded-full object-cover shrink-0" style={{ width: dims, height: dims }} />
    )
  }
  return (
    <div
      className={cn('rounded-full bg-brand-primary flex items-center justify-center font-bold text-white shrink-0', textClass)}
      style={{ width: dims, height: dims }}
    >
      {initials}
    </div>
  )
}

// ─── Section: Overview ────────────────────────────────────────────────────────

function OverviewSection({
  user, orders, addresses, onEditProfile,
}: Props & { onEditProfile: () => void }) {
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-brand-primary to-orange-400" />
        <div className="px-6 pb-6">
          <div className="-mt-9 mb-4 flex items-end justify-between">
            <div className="ring-4 ring-white rounded-full">
              <Avatar name={user.name} image={user.image} size="lg" />
            </div>
            <button
              onClick={onEditProfile}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-primary border border-brand-primary/30 px-3 py-1.5 rounded-full hover:bg-brand-primary-light transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
          <h2 className="text-xl font-black text-app-black">{user.name}</h2>
          <p className="text-sm text-app-gray mt-0.5">{user.email}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-app-gray-light">
            {user.phone && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {user.phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member since {joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-3xl font-black text-brand-primary">{orders.length}</p>
          <p className="text-xs font-semibold text-app-gray mt-1 uppercase tracking-wide">Orders placed</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-3xl font-black text-brand-primary">{addresses.length}</p>
          <p className="text-xs font-semibold text-app-gray mt-1 uppercase tracking-wide">Saved addresses</p>
        </div>
      </div>

      {/* Personal details */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-black text-app-black uppercase tracking-wider">Personal Details</h3>
          <button onClick={onEditProfile} className="text-xs font-bold text-brand-primary hover:underline">Edit</button>
        </div>
        <ProfileField label="Full name" value={user.name} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Mobile" value={user.phone} placeholder="Tap Edit to add" />
        <ProfileField label="Member since" value={joinedDate} />
      </div>
    </div>
  )
}

// ─── Section: Orders ──────────────────────────────────────────────────────────

function OrdersSection({ orders }: { orders: ProfileOrder[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-app-border flex items-center justify-between">
        <h3 className="text-sm font-black text-app-black uppercase tracking-wider">My Orders</h3>
        {orders.length > 0 && (
          <Link href="/orders" className="text-xs font-bold text-brand-primary hover:text-brand-primary-dark transition-colors">
            View all →
          </Link>
        )}
      </div>
      {orders.length === 0 ? (
        <EmptyState emoji="🍽️" title="No orders yet"
          description="Your order history will appear here once you place your first order."
          action={{ label: 'Browse restaurants', href: '/restaurants' }} />
      ) : (
        <div className="divide-y divide-app-border">
          {orders.slice(0, 5).map((order) => (
            <OrderPreviewCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section: Addresses ───────────────────────────────────────────────────────

function AddressesSection({
  addresses, onAdd, onDelete, onSetDefault, loadingId,
}: {
  addresses: ProfileAddress[]
  onAdd: () => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
  loadingId: string | null
}) {
  const city = useCityStore((s) => s.city)

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-app-border flex items-center justify-between">
        <h3 className="text-sm font-black text-app-black uppercase tracking-wider">Saved Addresses</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary-dark transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add new
        </button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState emoji="📍" title="No saved addresses"
          description="Add a delivery address during checkout or tap 'Add new' above."
          action={{ label: 'Order now', href: buildRestaurantsUrl({ city }) }} />
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="relative">
              <AddressCard address={address} />
              <div className="flex items-center gap-2 mt-2">
                {!address.isDefault && (
                  <button
                    disabled={loadingId === address.id}
                    onClick={() => onSetDefault(address.id)}
                    className="text-xs font-semibold text-brand-primary hover:underline disabled:opacity-50"
                  >
                    {loadingId === address.id ? 'Setting…' : 'Set as default'}
                  </button>
                )}
                <button
                  disabled={loadingId === address.id}
                  onClick={() => onDelete(address.id)}
                  className="ml-auto text-xs font-semibold text-app-red hover:underline disabled:opacity-50"
                >
                  {loadingId === address.id ? '…' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section: Payments ────────────────────────────────────────────────────────

function PaymentsSection() {
  const methods = [
    { icon: '💵', label: 'Cash on Delivery', detail: 'Pay when your order arrives', available: true },
    { icon: '💳', label: 'Pay Online', detail: 'UPI, Debit / Credit Cards, Net Banking', available: true },
    { icon: '👛', label: 'Mealora Wallet', detail: '₹0 balance — top up to use', available: false },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-app-border">
          <h3 className="text-sm font-black text-app-black uppercase tracking-wider">Payment Methods</h3>
          <p className="text-xs text-app-gray mt-1">Select your preferred payment at checkout</p>
        </div>
        <div className="p-5 space-y-3">
          {methods.map((m) => (
            <div key={m.label}
              className="flex items-center gap-4 p-4 rounded-xl border border-app-border">
              <span className="text-2xl shrink-0">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-app-black">{m.label}</p>
                <p className="text-xs text-app-gray mt-0.5">{m.detail}</p>
              </div>
              <span className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full shrink-0',
                m.available ? 'bg-green-50 text-app-green' : 'bg-app-gray-bg text-app-gray-light'
              )}>
                {m.available ? 'Available' : 'Coming soon'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 text-center">
        <span className="text-4xl">🔐</span>
        <p className="text-sm font-bold text-app-black mt-3">Secure payments</p>
        <p className="text-xs text-app-gray mt-1 max-w-xs mx-auto">
          All transactions are encrypted and processed securely. No card details are stored.
        </p>
      </div>
    </div>
  )
}

// ─── Section: Settings ────────────────────────────────────────────────────────

function SettingsSection() {
  const { preferences, togglePreference } = useSettingsStore()
  // Guard against Zustand persist hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const prefConfig = [
    { key: 'orderNotifications' as const, label: 'Order notifications', description: 'Real-time updates on your order status' },
    { key: 'promotionalEmails' as const, label: 'Promotional emails', description: 'Exclusive offers, deals, and restaurant picks' },
    { key: 'smsAlerts' as const, label: 'SMS alerts', description: 'Delivery confirmations and OTP via SMS' },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-app-border">
          <h3 className="text-sm font-black text-app-black uppercase tracking-wider">Notifications</h3>
          <p className="text-xs text-app-gray mt-1">Changes are saved automatically</p>
        </div>
        <div className="divide-y divide-app-border">
          {prefConfig.map((pref) => {
            const enabled = mounted ? preferences[pref.key] : false
            return (
              <div key={pref.key} className="flex items-center justify-between px-6 py-4 gap-6">
                <div>
                  <p className="text-sm font-semibold text-app-black">{pref.label}</p>
                  <p className="text-xs text-app-gray mt-0.5">{pref.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={pref.label}
                  onClick={() => togglePreference(pref.key)}
                  disabled={!mounted}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
                    enabled ? 'bg-brand-primary' : 'bg-app-border',
                    !mounted && 'opacity-50'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-app-border">
          <h3 className="text-sm font-black text-app-black uppercase tracking-wider">Account</h3>
        </div>
        <div className="p-5">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-red-100 text-app-red hover:bg-red-50 transition-colors text-sm font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out of your account
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export function ProfileContent({ user: initialUser, orders, addresses: initialAddresses }: Props) {
  const [section, setSection] = useState<Section>('overview')
  const [currentUser, setCurrentUser] = useState(initialUser)
  const [addressList, setAddressList] = useState(initialAddresses)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [loadingAddressId, setLoadingAddressId] = useState<string | null>(null)

  const showToast = useCallback((type: ToastState['type'], message: string) => {
    setToast({ type, message })
  }, [])

  // ── Address handlers ──

  const handleAddressAdded = (address: ProfileAddress) => {
    setAddressList((prev) =>
      address.isDefault
        ? [address, ...prev.map((a) => ({ ...a, isDefault: false }))]
        : [...prev, address]
    )
    setShowAddressModal(false)
    showToast('success', 'Address saved successfully.')
  }

  const handleDeleteAddress = async (id: string) => {
    setLoadingAddressId(id)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setAddressList((prev) => prev.filter((a) => a.id !== id))
      showToast('success', 'Address removed.')
    } catch {
      showToast('error', 'Could not remove address. Try again.')
    } finally {
      setLoadingAddressId(null)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    setLoadingAddressId(id)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'PATCH' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setAddressList((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      )
      showToast('success', 'Default address updated.')
    } catch {
      showToast('error', 'Could not update default. Try again.')
    } finally {
      setLoadingAddressId(null)
    }
  }

  // ── Profile edit handler ──

  const handleProfileUpdated = (updated: ProfileUser) => {
    setCurrentUser(updated)
    setShowEditModal(false)
    showToast('success', 'Profile updated successfully.')
  }

  // ── Sign out ──

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // ── Sidebar item ──

  const SidebarItem = ({ item }: { item: typeof NAV_ITEMS[number] }) => (
    <button
      key={item.id}
      onClick={() => setSection(item.id)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-colors text-left border-t border-app-border first:border-t-0',
        section === item.id
          ? 'bg-brand-primary-light text-brand-primary'
          : 'text-app-black hover:bg-app-gray-bg'
      )}
    >
      <span className={section === item.id ? 'text-brand-primary' : 'text-app-gray'}>
        {item.icon}
      </span>
      {item.label}
      {section === item.id && (
        <svg className="w-4 h-4 ml-auto text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  )

  return (
    <div className="bg-app-gray-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Mobile: horizontal tab chips */}
        <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-hide pb-5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
                section === item.id
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-white text-app-black border-app-border hover:border-brand-primary'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-app-border bg-white text-app-red hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

        <div className="flex gap-6 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-20 gap-3">
            {/* User mini card */}
            <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 overflow-hidden">
              <Avatar name={currentUser.name} image={currentUser.image} size="md" />
              <div className="min-w-0">
                <p className="font-bold text-app-black text-sm truncate">{currentUser.name}</p>
                <p className="text-xs text-app-gray truncate">{currentUser.email}</p>
              </div>
            </div>

            {/* Nav */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {NAV_ITEMS.map((item) => <SidebarItem key={item.id} item={item} />)}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-app-red hover:bg-red-50 transition-colors border-t border-app-border"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </aside>

          {/* Content pane */}
          <div className="flex-1 min-w-0">
            {section === 'overview' && (
              <OverviewSection
                user={currentUser} orders={orders} addresses={addressList}
                onEditProfile={() => setShowEditModal(true)}
              />
            )}
            {section === 'orders' && <OrdersSection orders={orders} />}
            {section === 'addresses' && (
              <AddressesSection
                addresses={addressList}
                onAdd={() => setShowAddressModal(true)}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefaultAddress}
                loadingId={loadingAddressId}
              />
            )}
            {section === 'payments' && <PaymentsSection />}
            {section === 'settings' && <SettingsSection />}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          user={currentUser}
          onSuccess={handleProfileUpdated}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showAddressModal && (
        <AddressModal
          onSuccess={handleAddressAdded}
          onClose={() => setShowAddressModal(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
