# CLAUDE.md — AI Engineering Guide

> **Note:** This file lives at the repo root — required by Claude Code tooling. All other project documentation is in [`docs/`](docs/). See [`docs/AGENTS.md`](docs/AGENTS.md) for agent roles and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for system design.

## Project

Full-stack Mealora food delivery platform. Next.js 14 App Router, TypeScript strict, PostgreSQL (Neon) via Prisma, NextAuth.js v4, Zustand, Tailwind CSS, Razorpay payments.

## Commands

```bash
npm run dev          # start dev server (http://localhost:3000)
npm run build        # production build (tsc + Next.js compiler)
npm run lint         # ESLint
npm run db:migrate   # prisma migrate dev
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # Prisma Studio GUI
```

---

## Layer rules — strictly enforced

| Layer | Path | Rule |
|---|---|---|
| Frontend | `src/` | No direct DB access. Import from `@/lib/utils`, `@/store`, `@/components`, `@/types` |
| Backend | `server/` | No Next.js/React imports. Services and repositories only |
| Shared | `shared/` | No framework imports. Types, schemas, constants, pure helpers only |
| API routes | `src/app/api/` | Call `server/` services. Validate via `server/validators/`. No raw Prisma here |

**Path aliases:** `@/*` → `src/*` · `@server/*` → `server/*` · `@shared/*` → `shared/*`

---

## Adding a feature — checklist

1. Schema changes → `prisma/schema.prisma` + `npm run db:migrate`
2. New entity types → `shared/interfaces/index.ts`
3. Input validation → `shared/schemas/index.ts` (Zod) → thin wrapper in `server/validators/`
4. DB queries → `server/repositories/<entity>.repository.ts`
5. Business logic → `server/services/<entity>.service.ts`
6. API route → `src/app/api/<resource>/route.ts`
7. UI → `src/components/` or `src/app/<route>/page.tsx`

---

## Key conventions

### Server vs Client components
- **Server components call services directly.** No HTTP round-trip for page-level data fetching.
- **Client components use `fetch()`** against API routes for interactive mutations and paginated loads.
- Never add `'use client'` to pages that only fetch data — keep them server components.

### Validation
- **Zod is the single validation source.** Schemas in `shared/schemas/index.ts`; validators in `server/validators/` are thin wrappers calling `schema.parse(body)`.
- API routes catch `ZodError` → 422 with `err.issues`; other errors → 400.
- Use `ZodError.issues`, not `.errors` (Zod v4 renamed the field).

### Constants
- **Never duplicated.** `DELIVERY_FEE`, `FREE_DELIVERY_THRESHOLD`, `TAX_RATE`, pagination limits — all defined once in `shared/constants/index.ts`.

### Imports
- Components import from `@/lib/utils` (the frontend barrel), never from `shared/` directly.
- `src/lib/utils.ts` re-exports `@shared/helpers`, `@shared/constants`, plus `cn()`.

### Design
- **Design tokens only.** Use `brand-primary`, `app-black`, `app-gray`, `app-green`, `app-red`. Never hardcode hex values.
- **`cn()` for class merging.** `import { cn } from '@/lib/utils'` — clsx + tailwind-merge.

---

## Zustand stores

Three stores, all with `persist` middleware:

| Store | Key | Purpose |
|---|---|---|
| `cartStore` | `mealora-cart` | Cart items, restaurantId, restaurantName, subtotal |
| `cityStore` | `mealora-city` | Selected city + stateAbbr; `_hasHydrated` flag |
| `settingsStore` | `mealora-settings` | User notification preferences |

**Cart rules:** Client-only. No DB cart table. Cart auto-clears on restaurant change. Server re-validates all totals on order creation — never trust client-computed amounts.

**City store hydration:** Always guard on `_hasHydrated` before rendering city-dependent UI to prevent SSR mismatch. `Navbar` is the reference implementation.

---

## Auth

- NextAuth.js v4 credentials provider (+ optional Google OAuth)
- Session augmented with `id` and `role` via `callbacks.jwt` / `callbacks.session`
- Server components: `getServerSession(authOptions)`
- Client components: `useSession()` — always guard with `status === 'loading'` check to prevent hydration flash
- Protected API routes: `server/middleware/withAuth.ts`
- Route-level protection: `src/middleware.ts` (next-auth/middleware) covers `/profile/:path*`, `/orders/:path*`, `/checkout/:path*`

---

## Razorpay integration

- **Script loading:** `src/lib/razorpay.ts` — `loadRazorpayScript()` is a singleton Promise (loads once per session, regardless of how many times called).
- **Server-side amount computation:** `paymentService.createOrder()` fetches real DB prices via `menuRepository.findByIds()`. Frontend item prices are never trusted for payment amounts.
- **HMAC verification:** `paymentService.verifySignature()` uses `crypto.timingSafeEqual` to verify Razorpay's signature before creating the order record.
- **Coupon re-validation:** Both `paymentService.createOrder()` and `orderService.create()` call `couponService.validateAndCompute()` internally. Discount passed from the frontend is always ignored — server computes it.
- **Environment:** `NEXT_PUBLIC_RAZORPAY_KEY_ID` (browser) + `RAZORPAY_KEY_SECRET` (server only). Both required — `validateRazorpayEnv()` logs exactly which key is missing and returns a clean user-facing error.

---

## Coupon flow

```
Checkout (CouponSelector)
  └─ GET /api/coupons           → couponRepository.findAll()    → display cards
  └─ POST /api/coupons/validate → couponService.validateAndCompute() → return discount

Order placement (COD or Razorpay)
  └─ couponCode passed in request body
  └─ server ALWAYS re-validates via couponService.validateAndCompute()
  └─ discount / total overridden server-side before DB write
```

**CouponSelector:** Expandable panel — fetches lazily on first open, per-card apply spinner, collapses on apply. Manual entry fallback via nested `CouponInput`. Uses CSS `grid-rows-[0fr]→[1fr]` for smooth animation.

---

## Pagination conventions

Two patterns in use:

| Context | Strategy | Key |
|---|---|---|
| Restaurant listing | URL search params (`?page=N`) | Server component re-renders on navigation |
| Orders list | API-based "Load More" | `OrdersList` client component appends pages |

**Interface:** `PaginationParams { page?, limit? }` and `PaginatedResponse<T> { items, total, page, limit, hasMore }` — both in `shared/interfaces/index.ts`.

**Service contract:** `orderService.listForUser(userId, params?)` returns `PaginatedResponse`. Defaults: page=1, limit=10, max=50. DB index on `(userId, createdAt)` supports the query.

**Pattern for new paginated lists:** server component fetches page 1 directly → passes `initialOrders`, `initialHasMore`, `initialPage` to client component → client fetches subsequent pages via API.

---

## Loading / skeleton system

- **Route-level:** Every route has a `loading.tsx` that exports a route-specific skeleton. Next.js streams these automatically via Suspense.
- **Skeleton components:** `src/components/ui/Skeleton.tsx` exports named variants: `RestaurantCardSkeleton`, `RestaurantsPageSkeleton`, `OrdersPageSkeleton`, `ProfilePageSkeleton`, `CheckoutPageSkeleton`, `CartPageSkeleton`, `HomePageSkeleton`.
- **Route progress bar:** `RouteProgress` (in root layout) fires on navigation start/end via `usePathname` + `useEffect`.
- **Shimmer animation:** `animate-shimmer` keyframe in `globals.css` — use `bg-shimmer` utility class.

---

## Routing conventions

```
src/app/
├── (auth)/              # route group — no shared layout
│   ├── login/
│   └── register/
├── restaurants/
│   ├── page.tsx         # server component, filter + paginate
│   └── [id]/page.tsx    # server component, menu + cart bar
├── cart/page.tsx        # client component (cart is client state)
├── checkout/page.tsx    # client component
├── orders/
│   ├── page.tsx         # server component (SSR first page) + OrdersList client
│   └── [id]/page.tsx    # server component, revalidate: 10s
└── profile/page.tsx     # server component → ProfileContent client component
```

Middleware (`src/middleware.ts`) redirects unauthenticated users away from `/profile`, `/orders`, `/checkout` to `/login?callbackUrl=...`.

---

## Reusable component philosophy

- `src/components/ui/` — pure primitives with no business logic: `Button`, `Input`, `Badge`, `Spinner`, `Skeleton`, `Toast`, `LocationSelector`, `RouteProgress`, `CityParamSync`.
- Feature components live in named folders: `cart/`, `checkout/`, `home/`, `layout/`, `order/`, `profile/`, `restaurant/`.
- No component should reach into another feature's folder. Cross-feature communication goes through stores or props.
- Client components that wrap server-fetched data serialize `Date` → ISO string before passing as props (avoids hydration type mismatch).

---

## City persistence strategy

- City is stored in `cityStore` (Zustand + localStorage, key `mealora-city`).
- `_hasHydrated` flag prevents SSR flash — only render city-dependent UI after hydration.
- `CitySync` (homepage) and `CityParamSync` (restaurants page) bridge the store into URL search params so server components can read the city from `searchParams`.
- `CityMismatchBanner` (restaurant detail) warns when the restaurant's city differs from the selected city.
- City list: 8 Indian cities defined in `src/lib/cities.ts`. `DEFAULT_CITY = 'Bangalore'`.

---

## API / service / repository responsibilities

| Layer | Responsibility |
|---|---|
| `server/repositories/` | All Prisma queries. One file per entity. No business logic. |
| `server/services/` | Business logic, orchestrates repositories, enforces rules (price re-validation, coupon re-compute). |
| `server/validators/` | One-liner wrappers: `schema.parse(body)`. Called by API routes. |
| `src/app/api/` | Parse request, call validator, call service, return JSON. No Prisma here. |

---

## Environment — two files required

Prisma CLI reads `.env`; Next.js runtime reads `.env.local`.

```
# .env  (Prisma CLI only)
DATABASE_URL="postgresql://..."

# .env.local  (Next.js runtime)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
```

---

## Database seed

20 restaurants (Bangalore), 10 menu items each, 3 categories per restaurant, 4 demo coupons.
Demo user: `demo@mealora.app / Demo@1234`.
Re-seeding is idempotent — upserts on `slug`, updating `imageUrl` and `bannerUrl`.

Coupon codes: `WELCOME20` (20% off, max ₹100), `FLAT50` (₹50 flat), `SAVE100` (₹100 flat, min ₹399), `FESTIVE30` (30% off, max ₹150).

---

## Common mistakes to avoid

- Do not add `'use client'` to pages that only fetch data.
- Do not write Prisma queries outside `server/repositories/`.
- Do not import from `shared/` directly in `src/` — go through `@/lib/utils` or `@/types`.
- Do not define constants in more than one place.
- Do not trust frontend amounts for pricing — always re-compute server-side.
- Do not call `loadRazorpayScript()` more than needed — it is already a singleton.
- When serializing server data for client components, convert `Date` → `.toISOString()`.
- `ZodError.issues`, not `.errors`.
