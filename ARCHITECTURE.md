# Architecture

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14, App Router |
| Language | TypeScript 5, strict mode |
| Styling | Tailwind CSS 3, custom design tokens |
| Database | PostgreSQL via Neon (cloud, ap-southeast-1) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v4, credentials + optional Google |
| State | Zustand 4, `persist` middleware (localStorage) |
| Validation | Zod v4 |
| Payments | Razorpay (India) — UPI, cards, net banking, wallets, EMI |
| Hosting target | Vercel (zero-config with Neon) |

---

## Directory layout

```
.
├── prisma/
│   ├── schema.prisma          # single source of DB schema + migrations
│   ├── seed/index.ts          # 20 restaurants, demo user, 4 coupons
│   └── migrations/            # applied migration history
│
├── shared/                    # framework-free contracts (no Next.js / React)
│   ├── constants/index.ts     # DELIVERY_FEE, TAX_RATE, pagination limits, status labels
│   ├── helpers/index.ts       # formatPrice, calculateDeliveryFee, calculateOrderTotal, etc.
│   ├── interfaces/index.ts    # entity interfaces, API response types, PaginatedResponse<T>
│   └── schemas/index.ts       # Zod schemas + inferred input types
│
├── server/                    # pure Node backend (no React imports)
│   ├── repositories/
│   │   ├── address.repository.ts
│   │   ├── coupon.repository.ts
│   │   ├── menu.repository.ts
│   │   ├── order.repository.ts
│   │   ├── restaurant.repository.ts
│   │   └── user.repository.ts
│   ├── services/
│   │   ├── address.service.ts
│   │   ├── coupon.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts   # Razorpay order creation + HMAC verification
│   │   ├── restaurant.service.ts
│   │   └── user.service.ts
│   ├── validators/              # thin wrappers: schema.parse(body)
│   │   ├── address.validator.ts
│   │   ├── coupon.validator.ts
│   │   ├── order.validator.ts
│   │   ├── payment.validator.ts
│   │   └── user.validator.ts
│   └── middleware/
│       └── withAuth.ts          # session guard for API routes → 401 if absent
│
└── src/                         # Next.js application
    ├── app/
    │   ├── layout.tsx            # root layout — SessionProvider, RouteProgress, fonts
    │   ├── page.tsx              # homepage (hero, categories, promo, featured)
    │   ├── loading.tsx           # root skeleton (HomePageSkeleton)
    │   ├── error.tsx             # global error boundary with reset
    │   ├── not-found.tsx         # 404 with Navbar + Footer
    │   ├── providers.tsx         # client-side SessionProvider wrapper
    │   ├── (auth)/               # route group — no shared layout
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── restaurants/
    │   │   ├── page.tsx          # server component — filter, sort, URL pagination
    │   │   ├── loading.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx      # server component — menu by category, CartFloatingBar
    │   │       └── loading.tsx
    │   ├── cart/
    │   │   ├── page.tsx          # client component — cart state from Zustand
    │   │   └── loading.tsx
    │   ├── checkout/
    │   │   ├── page.tsx          # client component — address, payment, coupon, Razorpay
    │   │   └── loading.tsx
    │   ├── orders/
    │   │   ├── page.tsx          # server component (SSR page 1) + OrdersList client
    │   │   ├── loading.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx      # server component — order detail + bill breakdown
    │   │       └── loading.tsx
    │   ├── profile/
    │   │   ├── page.tsx          # server component → ProfileContent client
    │   │   └── loading.tsx
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts
    │       ├── auth/register/route.ts
    │       ├── addresses/route.ts
    │       ├── addresses/[id]/route.ts
    │       ├── coupons/route.ts              # GET active coupons list
    │       ├── coupons/validate/route.ts     # POST validate + compute discount
    │       ├── orders/route.ts               # GET paginated list, POST create
    │       ├── orders/[id]/route.ts          # GET detail, PATCH status
    │       ├── payments/create-order/route.ts # POST — Razorpay order creation
    │       ├── payments/verify/route.ts       # POST — HMAC verify + create order record
    │       ├── restaurants/route.ts
    │       ├── restaurants/[id]/route.ts
    │       ├── search/route.ts
    │       └── users/me/route.ts
    ├── components/
    │   ├── ui/                   # primitives — no business logic
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Spinner.tsx
    │   │   ├── Skeleton.tsx      # all named skeleton variants
    │   │   ├── Toast.tsx
    │   │   ├── LocationSelector.tsx
    │   │   ├── RouteProgress.tsx # top-of-page navigation progress bar
    │   │   └── CityParamSync.tsx # bridges cityStore → URL searchParam
    │   ├── layout/
    │   │   ├── Navbar.tsx        # sticky, session-aware, city selector, cart badge
    │   │   └── Footer.tsx
    │   ├── home/
    │   │   ├── HeroSearch.tsx
    │   │   ├── CategoryCarousel.tsx
    │   │   ├── PromoCards.tsx
    │   │   ├── RestaurantCard.tsx
    │   │   └── CitySync.tsx      # syncs cityStore → URL on homepage
    │   ├── restaurant/
    │   │   ├── RestaurantHeader.tsx
    │   │   ├── RestaurantFiltersBar.tsx
    │   │   ├── MenuSection.tsx   # collapsible with grid-rows animation
    │   │   ├── MenuItemCard.tsx
    │   │   ├── CartFloatingBar.tsx
    │   │   ├── CategoryNav.tsx
    │   │   └── CityMismatchBanner.tsx
    │   ├── cart/
    │   │   ├── CartItem.tsx
    │   │   └── CartSummary.tsx
    │   ├── checkout/
    │   │   ├── CouponCard.tsx    # single coupon display (applied / eligible / ineligible)
    │   │   ├── CouponInput.tsx   # manual code entry input
    │   │   └── CouponSelector.tsx # expandable panel with lazy fetch + per-card spinner
    │   ├── order/
    │   │   ├── OrderTracker.tsx
    │   │   ├── OrdersList.tsx    # client component — Load More pagination
    │   │   └── OrderSuccessBanner.tsx # sessionStorage flag pattern
    │   └── profile/
    │       ├── ProfileContent.tsx
    │       ├── ProfileField.tsx
    │       ├── EditProfileModal.tsx
    │       ├── AddressCard.tsx
    │       ├── AddressModal.tsx
    │       ├── OrderPreviewCard.tsx
    │       └── EmptyState.tsx
    ├── store/
    │   ├── cartStore.ts          # localStorage key: swiggy-cart
    │   ├── cityStore.ts          # localStorage key: swiggy-city
    │   └── settingsStore.ts      # localStorage key: swiggy-settings
    ├── lib/
    │   ├── auth.ts               # NextAuth authOptions
    │   ├── cities.ts             # city list + getCityEntry()
    │   ├── menuImages.ts         # menu image URL helpers
    │   ├── navigation.ts         # client navigation helpers
    │   ├── prisma.ts             # singleton PrismaClient
    │   ├── razorpay.ts           # loadRazorpayScript() singleton + Window type declarations
    │   └── utils.ts              # frontend barrel — re-exports shared helpers + cn()
    ├── middleware.ts             # next-auth/middleware → protects /profile, /orders, /checkout
    ├── types/index.ts            # frontend type aliases (Coupon, CouponApplied, Address, …)
    └── styles/globals.css        # Tailwind directives, design tokens, shimmer keyframe
```

---

## Data flow

```
Browser
  │
  ├─ Server Component (page.tsx)
  │     └─ import service directly ──► service ──► repository ──► Prisma ──► Neon DB
  │          (runs during SSR — no network hop)
  │
  └─ Client Component (interaction / Load More / mutations)
        └─ fetch('/api/...') ──► API route ──► validator ──► service ──► repository ──► Neon DB
```

Server components never hit API routes for their own data — this eliminates a round-trip and keeps sensitive logic server-side.

---

## Database schema

```
User ──< Account                    (OAuth providers)
User ──< Address
User ──< Order ──< OrderItem
                └─< OrderTimeline
Order ──> Restaurant
Order ──> Address
Restaurant ──< MenuCategory ──< MenuItem
Coupon                              (independent, validated per-request)
```

### Key field decisions

| Decision | Rationale |
|---|---|
| No DB session table | JWT sessions — stateless |
| No DB cart table | Cart lives in `localStorage` (Zustand) |
| `Order.discount` server-computed | Client amounts are never trusted |
| `Order.couponCode` stored | Display in order history + receipt |
| `@@index([userId, createdAt])` on Order | Efficient paginated history queries |
| `Order.otp` generated on creation | 4-digit delivery confirmation code |
| `razorpayOrderId` + `razorpayPaymentId` | Full audit trail for payments |

### Coupon model fields

| Field | Type | Purpose |
|---|---|---|
| `discountType` | `PERCENTAGE \| FLAT` | Calculation mode |
| `discountValue` | Float | % (0–100) or flat ₹ amount |
| `minOrderAmount` | Float? | Optional unlock threshold |
| `maxDiscount` | Float? | Cap on PERCENTAGE discounts |
| `expiresAt` | DateTime? | `null` = never expires |
| `isActive` | Boolean | Soft-disable without deletion |

---

## Payment flow

### COD

```
POST /api/orders
  └─ orderService.create()
       ├─ validates restaurant is open
       ├─ couponService.validateAndCompute(couponCode, subtotal)
       ├─ computes total server-side
       └─ Order created (paymentMode: CASH_ON_DELIVERY, paymentStatus: PENDING)
```

### Razorpay (online)

```
1. POST /api/payments/create-order
   └─ paymentService.createOrder()
        ├─ menuRepository.findByIds() → fetch real prices from DB
        ├─ couponService.validateAndCompute() → server-side discount
        ├─ razorpay.orders.create({ amount: totalInPaise })
        └─ returns { razorpayOrderId, keyId, amount, subtotal, discount, … }

2. Client opens Razorpay modal
   └─ user completes payment → handler({ razorpay_payment_id, razorpay_order_id, razorpay_signature })

3. POST /api/payments/verify
   └─ paymentService.verifySignature() → crypto.timingSafeEqual HMAC check
   └─ orderService.create()
        ├─ couponService.validateAndCompute() called again (double-validation)
        ├─ stores razorpayOrderId + razorpayPaymentId
        └─ Order created (paymentStatus: PAID)
```

**Security invariant:** Amount is computed server-side twice. The frontend amount is never used in payment math.

---

## Coupon architecture

```
CouponSelector (checkout UI)
  ├─ GET /api/coupons          → couponRepository.findAll()
  │    (isActive=true, not expired, sorted by discountValue DESC)
  │
  └─ POST /api/coupons/validate → couponService.validateAndCompute(code, subtotal)
       ├─ checks isActive, expiresAt, minOrderAmount
       ├─ PERCENTAGE: subtotal × rate / 100, capped by maxDiscount
       ├─ FLAT: min(discountValue, subtotal)
       └─ returns { code, title, description, discount }

Order creation (COD or Razorpay)
  └─ couponService.validateAndCompute() always called again server-side
       discount passed from frontend is ALWAYS ignored
```

---

## Order lifecycle

```
PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
                                                          ↘ CANCELLED
```

Each status transition appends a row to `OrderTimeline` with a human-readable `message`. `OrderTracker` renders the full timeline chronologically.

OTP is displayed only at `OUT_FOR_DELIVERY` status. `OrderSuccessBanner` uses a `sessionStorage` flag set before redirect — avoids server re-render race conditions.

---

## Pagination strategy

### Restaurant listing — URL-based

```
/restaurants?page=2&cuisine=Biryani&sort=rating&city=Mumbai
```
- Server component reads `searchParams`, calls `restaurantService.list({ page, filters })`.
- `buildPageUrl()` copies all active filter params before updating `page`.
- Default limit: 12. Max: 50 (`shared/constants`).

### Order history — API Load More

```
Server component
  └─ orderService.listForUser(userId, { page: 1, limit: 10 })
       └─ serializes (Date → ISO string) → passes to OrdersList

OrdersList (client component)
  └─ "Load More" button → GET /api/orders?page=N&limit=10 → appends to state
```

**Shared contract:** `PaginatedResponse<T>` in `shared/interfaces/index.ts`.
`PaginationParams { page?, limit? }` accepted by all paginated service methods.

---

## City filtering architecture

```
cityStore (Zustand, localStorage key: swiggy-city)
  │
  ├─ Navbar → LocationSelector  (city picker — triggers setCity())
  │
  ├─ CitySync (homepage)         → pushes ?city= to URL so server component can read it
  ├─ CityParamSync (restaurants) → keeps URL ?city= in sync with store
  │
  └─ CityMismatchBanner          → shown on restaurant detail when city doesn't match
```

City filtering is applied at the DB layer via `restaurantService.list({ city })` — Prisma `where: { city }`. The `_hasHydrated` flag on cityStore prevents SSR flash before localStorage is read.

---

## Loading infrastructure

Every route exports a `loading.tsx`. Next.js streams it via Suspense automatically.

| Route | Skeleton |
|---|---|
| `/` | `HomePageSkeleton` |
| `/restaurants` | `RestaurantsPageSkeleton` |
| `/restaurants/[id]` | `RestaurantDetailSkeleton` |
| `/cart` | `CartPageSkeleton` |
| `/checkout` | `CheckoutPageSkeleton` |
| `/orders` | `OrdersPageSkeleton` |
| `/orders/[id]` | `OrderDetailSkeleton` |
| `/profile` | `ProfilePageSkeleton` |

All variants exported from `src/components/ui/Skeleton.tsx`.

`RouteProgress` in root layout renders a top-bar animation on path change. Shimmer is `@keyframes shimmer` in `globals.css`, exposed as `animate-shimmer` Tailwind class.

---

## Profile / account architecture

```
profile/page.tsx (server component)
  ├─ userService.findById()
  ├─ orderService.listForUser().then(r => r.items)   ← recent orders only
  └─ addressService.listForUser()
       │
       └─ <ProfileContent> (client component)
            ├─ ProfileField + EditProfileModal   → PATCH /api/users/me
            ├─ AddressCard + AddressModal        → POST/PATCH/DELETE /api/addresses/[id]
            ├─ OrderPreviewCard                  → links to /orders/[id]
            └─ settingsStore                     → notification prefs (localStorage only)
```

---

## Reusable UI systems

### Design tokens (tailwind.config)
`brand-orange`, `brand-orange-light`, `brand-orange-dark`, `swiggy-black`, `swiggy-gray`, `swiggy-gray-light`, `swiggy-gray-bg`, `swiggy-green`, `swiggy-red`, `swiggy-border`.

### Global component classes (globals.css)
`.btn-primary`, `.btn-secondary`, `.input-base`, `.card`, `.shadow-card`, `.shadow-card-hover`.

### Animation patterns
| Pattern | Usage |
|---|---|
| `grid-rows-[0fr]→[1fr]` | Smooth expand/collapse (MenuSection, CouponSelector, mobile nav) |
| `animate-slide-up-bar` | CartFloatingBar mount |
| `animate-shimmer` | Skeleton loading pulse |
| `animate-spin` (inline SVG) | Async button loading spinners |

---

## Future: admin panel architecture plan

Recommended structure following the same layered conventions:

```
src/app/admin/
  ├── layout.tsx           # AdminLayout — sidebar nav, role guard (ADMIN only)
  ├── page.tsx             # dashboard — revenue KPIs, order counts, recent activity
  ├── restaurants/
  │   ├── page.tsx         # paginated list, search, toggle isOpen
  │   └── [id]/page.tsx    # edit details, manage menu items + categories
  ├── orders/
  │   ├── page.tsx         # all orders with status/date filters, paginated
  │   └── [id]/page.tsx    # order detail + manual status update
  ├── coupons/
  │   ├── page.tsx         # list, toggle isActive
  │   └── new/page.tsx     # create coupon form
  └── users/page.tsx       # user list, role management
```

**Backend additions needed:**

| Service method | Purpose |
|---|---|
| `restaurantService.create/update/delete` | Full restaurant CRUD |
| `orderService.listAll(filters, pagination)` | Cross-user order query for admin |
| `couponService.create/update/deactivate` | Coupon management |
| `userService.listAll / updateRole` | User administration |

**Auth:** Check `session.user.role === 'ADMIN'` in admin layout server component and add an `AdminOnly` variant of `withAuth`. No new auth system needed.

**Pagination:** All admin list views use the existing `PaginatedResponse<T>` / `PaginationParams` pattern — already reusable.

---

## Image hosting

Restaurant and menu item images sourced from Unsplash (`images.unsplash.com`). Allowed via `next.config.mjs` `remotePatterns`. Consistent sizing via `?w=400&h=300&fit=crop` query params.
