# SKILLS.md — Engineering Capability Reference

## Platform Overview

Full-stack food delivery platform (Mealora). Production-grade architecture across three layers: Next.js 14 frontend, isolated Node backend, and framework-free shared contracts. Flutter mobile app targets the same API.

---

## Implemented Engineering Skills

### Frontend (Next.js 14 App Router)
- Server components for data-fetch pages (restaurants, orders, profile)
- Client components for interactive state (cart, checkout, coupon selector)
- Route-level `loading.tsx` skeletons with named skeleton variants
- `RouteProgress` bar on navigation via `usePathname` + `useEffect`
- Zustand stores with `persist` middleware — cart, city, settings
- SSR-safe hydration guards (`_hasHydrated`) to prevent city/cart flash
- `CityParamSync` bridges Zustand → URL params for server component reads
- `cn()` utility (clsx + tailwind-merge) for conditional class composition

### Backend (server/ — pure Node, no React imports)
- Three-layer separation: repository → service → API route
- `restaurantService` — list with filters, full-text search, pagination, featured
- `orderService` — creation with server-side price recompute, paginated history
- `paymentService` — Razorpay order creation, HMAC signature verification
- `couponService` — PERCENTAGE/FLAT discounts, min order, max cap, expiry
- `addressService` — CRUD, default address management
- `userService` — profile updates, bcrypt password handling (12 rounds)
- `withAuth` middleware — session guard, injects `userId`/`role` into handlers
- All inputs validated via Zod before reaching services
- ZodError → 422; domain errors → 400; never raw Prisma in routes

### Admin Panel (`/admin`)
- Role-gated: `ADMIN` role enforced at middleware + API layer
- Restaurant CRUD with image/banner URL management
- Menu management: categories + items with availability toggle
- Order management: status updates with timeline tracking, dashboard stats
- Coupon management: CRUD, activate/deactivate, filter by type
- User management: role controls, user insights

### Payment Integration (Razorpay)
- Singleton script loader (`loadRazorpayScript`) — loads once per session
- Server-side order creation: DB prices fetched via `menuRepository.findByIds`
- Frontend amounts never trusted — server recomputes subtotal, tax, delivery, discount
- HMAC verification via `crypto.timingSafeEqual` before order record creation
- Coupon re-validated server-side on both order creation and payment verification

### Auth System (NextAuth.js v4)
- Credentials provider with bcrypt verification
- Session JWT augmented with `id` and `role`
- `withAuth` for API route protection; `src/middleware.ts` for page-level guards
- Strong password policy: 8+ chars, uppercase, lowercase, digit, special character

### Pagination System
- Two patterns: URL search params (restaurants) and API "Load More" (orders)
- `PaginatedResponse<T>` + `PaginationParams` defined once in `shared/interfaces`
- `orderService.listForUser` — page/limit defaults, max 50, DB index on `(userId, createdAt)`

### Coupon System
- Four demo coupons: `WELCOME20` (20% / max ₹100), `FLAT50`, `SAVE100`, `FESTIVE30`
- `CouponSelector` — lazy-fetch on open, per-card spinner, CSS grid animation
- Double-validation: UI validate + server re-validate on order placement

### Flutter Mobile App
- Feature-first architecture: `core/`, `features/`, `shared/`
- Riverpod state: `AsyncNotifierProvider`, `AutoDisposeNotifierProvider`, `FutureProvider.family`
- go_router: `ShellRoute` for bottom nav, auth guard via `refreshListenable`
- Dio HTTP client: auth cookie interceptor, error-mapping interceptor
- NextAuth mobile flow: GET /csrf → POST /callback/credentials → extract session cookie
- Plain Dart models (no codegen) — eliminates build_runner/analyzer incompatibilities
- iOS ATS configured for localhost HTTP

### Validation
- Zod is the single validation source — `shared/schemas/index.ts`
- Frontend mirrors: `src/lib/form-validation.ts` (login) + `validateNewPassword` (registration)
- Per-field errors with blur-triggered feedback on all auth and profile forms

---

## Reusable Infrastructure

| System | Location | Notes |
|---|---|---|
| Design tokens | `tailwind.config.ts` | `brand-primary`, `app-black`, `app-gray`, `app-green`, `app-red` |
| Shared constants | `shared/constants/index.ts` | Pricing, limits, status labels — never duplicated |
| Shared helpers | `shared/helpers/index.ts` | Pure functions, no framework deps |
| Skeleton system | `src/components/ui/Skeleton.tsx` | Named variants per route |
| Error boundaries | `src/app/error.tsx` | Global + per-route reset |
| API client (Flutter) | `mobile/lib/core/api/api_client.dart` | Dio singleton, unwraps `{ success, data, error }` envelope |

---

## Architecture Maturity

- Strict TypeScript throughout; no `any` escapes in business logic
- All server amounts recomputed — frontend totals never trusted
- Idempotent seed (`upsert` on slug) — safe to re-run
- DB migrations tracked in `prisma/migrations/`
- No circular imports between layers enforced by path alias policy
