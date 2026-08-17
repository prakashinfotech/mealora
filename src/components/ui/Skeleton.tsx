import { cn } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'

// ── Base ──────────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton-shimmer rounded', className)} />
}

// ── Restaurant card ───────────────────────────────────────────────────────────

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="h-48 rounded-t-2xl rounded-b-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-2.5 border-t border-app-border mt-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}

// ── Reusable grid of restaurant cards ────────────────────────────────────────

function RestaurantCardGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <RestaurantCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ── Shared: bill summary panel ────────────────────────────────────────────────

function BillSummarySkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-card p-5">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
          <div className="pt-3 border-t border-app-border flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  )
}

// ── Home page ─────────────────────────────────────────────────────────────────

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-brand-primary px-4 sm:px-6 pt-12 pb-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-8 w-72 mx-auto mb-2 rounded bg-white/20" />
          <div className="h-7 w-64 mx-auto mb-10 rounded bg-white/20" />
          <div className="max-w-2xl mx-auto h-14 bg-white rounded-xl shadow-lg" />
        </div>
      </section>

      {/* Promo cards */}
      <div className="bg-brand-primary pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-white/20" />
          ))}
        </div>
      </div>

      {/* Category carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Skeleton className="h-6 w-52 mb-6" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2.5 shrink-0">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <RestaurantCardGrid count={8} />
      </section>
    </div>
  )
}

// ── Restaurants listing page ──────────────────────────────────────────────────

export function RestaurantsPageSkeleton() {
  return (
    <div className="min-h-screen bg-app-gray-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Skeleton className="h-8 w-72 mb-1.5" />
        <Skeleton className="h-4 w-24 mb-6" />
        {/* Filter chips */}
        <div className="flex gap-3 mb-6 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full shrink-0" />
          ))}
        </div>
        <RestaurantCardGrid count={12} />
      </div>
    </div>
  )
}

// ── Restaurant detail page ────────────────────────────────────────────────────

function MenuItemRowSkeleton() {
  return (
    <div className="flex gap-4 py-5 border-b border-app-border last:border-b-0">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="shrink-0 flex flex-col items-center gap-2">
        <Skeleton className="w-24 h-20 rounded-xl" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  )
}

export function RestaurantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-app-gray-bg pb-24">
      <Navbar />

      {/* Restaurant header */}
      <div className="bg-white border-b border-app-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-5 items-start">
            <Skeleton className="w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
              <div className="flex items-center gap-4 pt-3 mt-1 border-t border-app-border">
                <Skeleton className="h-8 w-16 rounded" />
                <div className="w-px h-8 bg-app-border" />
                <Skeleton className="h-8 w-20 rounded" />
                <div className="w-px h-8 bg-app-border" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky category nav */}
      <div className="bg-white border-b border-app-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex gap-3 py-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-card">
          {Array.from({ length: 3 }).map((_, s) => (
            <div key={s} className="mb-2">
              <div className="flex items-center justify-between py-4 px-4 sm:px-6 border-b border-app-border">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <div className="px-4 sm:px-6 bg-white">
                {Array.from({ length: 3 }).map((_, i) => (
                  <MenuItemRowSkeleton key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Cart page ─────────────────────────────────────────────────────────────────

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-app-gray-bg">
      <Navbar />
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-card">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-44" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="bg-white rounded-2xl shadow-card px-4 sm:px-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-5 border-b border-app-border last:border-b-0">
                    <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="w-24 h-8 rounded-lg" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
            <BillSummarySkeleton />
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Checkout page ─────────────────────────────────────────────────────────────

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-app-gray-bg">
      <Navbar />
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-8 w-36 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Address section */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <Skeleton className="h-5 w-40 mb-4" />
                <div className="space-y-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border-2 border-app-border">
                      <Skeleton className="w-4 h-4 rounded-full mt-1 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Payment section */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <Skeleton className="h-5 w-36 mb-4" />
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border-2 border-app-border">
                      <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                      <Skeleton className="w-6 h-6 rounded" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <BillSummarySkeleton />
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Profile page ──────────────────────────────────────────────────────────────

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-app-gray-bg">
      <Navbar />
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex flex-col items-center text-center pb-5 border-b border-app-border mb-4">
                  <Skeleton className="w-20 h-20 rounded-full mb-3" />
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-20 mb-1.5" />
                      <Skeleton className="h-5 w-52" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-card p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Orders list page ──────────────────────────────────────────────────────────

export function OrdersPageSkeleton() {
  return (
    <div className="min-h-screen bg-app-gray-bg">
      <Navbar />
      <main className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-8 w-36 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Skeleton className="h-5 w-44" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="h-3 w-2/3" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-px" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Order detail page ─────────────────────────────────────────────────────────

export function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-app-gray-bg">
      <Navbar />
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-12" />
            <span className="text-app-border text-sm">›</span>
            <Skeleton className="h-4 w-20" />
            <span className="text-app-border text-sm">›</span>
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Tracker */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <Skeleton className="h-6 w-44 mb-5" />
                <div className="space-y-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Restaurant */}
              <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <Skeleton className="h-5 w-28 mb-3" />
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              </div>
              <BillSummarySkeleton />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
