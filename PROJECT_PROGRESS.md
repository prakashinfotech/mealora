# Project Progress

Swiggy clone — full-stack food delivery web app built with Next.js 14, Prisma + Neon PostgreSQL, NextAuth.js v4, Zustand, Tailwind CSS, Razorpay.

---

## Completed

### Foundation
- [x] Next.js 14 App Router scaffold with TypeScript strict mode
- [x] Three-layer architecture: `src/` (frontend) · `server/` (backend) · `shared/` (contracts)
- [x] Path aliases: `@/*`, `@server/*`, `@shared/*`
- [x] Tailwind CSS with Swiggy design tokens (colors, shadows, font)
- [x] Global component classes: `.btn-primary`, `.btn-secondary`, `.input-base`, `.card`
- [x] `cn()` utility via clsx + tailwind-merge

### Database & ORM
- [x] Prisma schema: User, Account, Address, Restaurant, MenuCategory, MenuItem, Order, OrderItem, OrderTimeline, Coupon
- [x] Neon cloud PostgreSQL (ap-southeast-1)
- [x] Seed: 20 Bangalore restaurants, 10 menu items each, 3 categories, 4 demo coupons
- [x] Seed is idempotent (upserts on slug)
- [x] Demo user: `demo@swiggy.com / Demo@1234`
- [x] DB index on `(userId, createdAt)` for order history queries

### Auth
- [x] NextAuth.js v4 credentials provider
- [x] bcrypt password hashing (12 rounds)
- [x] Session augmented with `id` and `role`
- [x] `withAuth` middleware for protected API routes
- [x] Route-level middleware (`src/middleware.ts`) — covers `/profile`, `/orders`, `/checkout`
- [x] Login and register pages

### Shared Layer
- [x] `shared/constants` — pricing, limits, auth params, order status labels/colors
- [x] `shared/helpers` — formatPrice, calculateDeliveryFee, calculateTaxes, calculateOrderTotal, generateOTP, slugify
- [x] `shared/interfaces` — all entity interfaces, `PaginatedResponse<T>`, `PaginationParams`
- [x] `shared/schemas` — Zod schemas for all inputs; types derived via `z.infer<>`
- [x] Constants deduplicated — single source of truth

### Backend Services & API
- [x] `restaurantService` — list (filters + pagination), findById, findByIdWithMenu, search, getFeatured
- [x] `orderService` — create (server-side total + coupon recompute), listForUser (paginated), findForUser, updateStatus
- [x] `paymentService` — createOrder (DB price fetch + Razorpay order), verifySignature (HMAC)
- [x] `couponService` — validateAndCompute (PERCENTAGE/FLAT, min order, max cap, expiry)
- [x] `addressService` — create, list, setDefault, update, delete
- [x] `userService` — create, findById, update
- [x] Validators: order, address, user, coupon, payment
- [x] All routes: ZodError → 422, other errors → 400

### API Routes
- [x] `GET/POST /api/restaurants` + `GET /api/restaurants/[id]`
- [x] `POST /api/auth/register`
- [x] `GET/POST /api/addresses` + `PATCH/DELETE /api/addresses/[id]`
- [x] `GET /api/orders` (paginated) + `POST /api/orders`
- [x] `GET/PATCH /api/orders/[id]`
- [x] `GET /api/coupons` + `POST /api/coupons/validate`
- [x] `POST /api/payments/create-order` + `POST /api/payments/verify`
- [x] `GET /api/search`
- [x] `GET/PATCH /api/users/me`

### Razorpay Integration
- [x] Server-side Razorpay order creation — DB prices fetched, never trusts client amounts
- [x] HMAC-SHA256 signature verification via `crypto.timingSafeEqual`
- [x] Singleton script loader (`loadRazorpayScript()`) — loads once per session
- [x] Payment stages: preparing → processing → verifying
- [x] Error handling: credential misconfiguration, modal dismiss, network failure
- [x] COD and Razorpay both re-validate coupon server-side

### Coupon / Promo System
- [x] Coupon model: PERCENTAGE + FLAT discount types, minOrderAmount, maxDiscount, expiry, isActive
- [x] `CouponSelector` — expandable panel, lazy fetch, per-card apply spinner, manual entry fallback
- [x] `CouponCard` — three visual states: applied (orange), eligible (white), ineligible (dashed grey)
- [x] Discount shown in checkout bill summary, order detail, order history
- [x] Coupon re-validated server-side on every order creation — frontend value never trusted
- [x] Seed coupons: WELCOME20, FLAT50, SAVE100, FESTIVE30

### Multi-City Support
- [x] 8 cities: Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, Ahmedabad, Vadodara
- [x] `cityStore` — Zustand + localStorage, hydration-safe `_hasHydrated` flag
- [x] City persists across sessions; synced to URL `?city=` param for server components
- [x] `CityMismatchBanner` on restaurant detail when city differs from selection
- [x] City picker in Navbar with `LocationSelector`

### Profile & Account
- [x] Profile page — name, email, phone with inline edit modal
- [x] Address management — add/edit/delete addresses, set default
- [x] Order history preview in profile (recent 10)
- [x] Notification preferences via `settingsStore` (localStorage only)

### Order Tracking
- [x] Status timeline: PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
- [x] `OrderTimeline` entries created on status change with message
- [x] OTP displayed at OUT_FOR_DELIVERY stage
- [x] Order detail shows full bill: subtotal, delivery fee, taxes, coupon discount, total
- [x] Coupon badge ("WELCOME20 applied · You saved ₹50") on order detail
- [x] `OrderSuccessBanner` — sessionStorage flag pattern, auto-dismisses in 5s

### Order Pagination
- [x] Orders list — server renders page 1 (SSR), `OrdersList` client component handles Load More
- [x] `GET /api/orders?page=N&limit=10` returns `PaginatedResponse<Order>`
- [x] "Load More Orders" button — disabled + spinner while fetching, hidden when `hasMore=false`
- [x] `PaginationParams` + `PaginatedResponse<T>` in `shared/` — reusable for admin panel

### Loading Infrastructure
- [x] `loading.tsx` for every route (8 routes total)
- [x] Named skeleton variants in `Skeleton.tsx`: Home, Restaurants, RestaurantDetail, Cart, Checkout, Orders, OrderDetail, Profile
- [x] `RouteProgress` top bar — animates on navigation start/end
- [x] `animate-shimmer` keyframe in `globals.css`

### UI Polish & Accessibility
- [x] Skeleton loaders replace all bare spinners
- [x] Global error boundary with reset button
- [x] 404 page with Navbar + Footer
- [x] `aria-label` on all icon buttons; `aria-expanded` on toggles; `aria-live` on cart quantity
- [x] Mobile hamburger menu with CSS height transition
- [x] Cart badge on Navbar
- [x] `animate-slide-up-bar` for CartFloatingBar mount
- [x] `grid-rows` CSS trick for all expand/collapse animations (no JS height calculation)
- [x] Navbar hydration safety — `status === 'loading'` guard prevents auth flash
- [x] Rating count formatted (`12.4K` not `12400`)
- [x] Responsive layout across all pages

---

## Technical achievements

- **Zero-trust pricing:** Server fetches real prices from DB on every payment — frontend amounts never used in calculations.
- **Double coupon validation:** Coupon validated independently by both `paymentService` and `orderService` — no single point of failure.
- **Hydration-safe city store:** `_hasHydrated` pattern prevents SSR/client mismatch for localStorage-backed state.
- **CSS-only animations:** All expand/collapse effects use `grid-rows-[0fr]→[1fr]` — no JS height measurement, no layout shift.
- **sessionStorage success banner:** Avoids server re-render race condition that breaks URL-param based success flags.
- **`useRef` redirect guard:** `orderDone.current` prevents cart-empty `useEffect` from hijacking post-order navigation.
- **Singleton Razorpay loader:** `loadRazorpayScript()` returns the same Promise on repeat calls — no duplicate script tags.
- **Reusable pagination contract:** `PaginatedResponse<T>` + `PaginationParams` work for both URL-based (restaurants) and Load More (orders) patterns — admin panel ready.

---

## Known limitations

- OTP generated and stored but not sent via SMS (no provider integration).
- Order status updates are manual — no automated progression or delivery partner integration.
- `ORDER_TRACKING_POLL_INTERVAL_MS` constant defined but live polling not wired up.
- Cart restaurant-change shows a silent clear — no confirmation dialog yet.
- Restaurant images sourced from Unsplash — not user-uploadable.
- City filter is UI-only — all 20 seeded restaurants are Bangalore; other cities return empty results.
- No email notifications (no transactional email provider connected).

---

## Pending

### Admin Panel (next milestone)
- [ ] Admin layout with sidebar nav + role guard (`role === 'ADMIN'`)
- [ ] Dashboard — order KPIs, revenue totals, recent activity
- [ ] Restaurant management — create, edit, toggle open/closed
- [ ] Menu management — add/edit/delete items and categories
- [ ] Order management — list all orders, manual status updates
- [ ] Coupon management — create, edit, deactivate
- [ ] User management — list users, assign roles

### Features
- [ ] Image upload — restaurant/menu images (Cloudinary or S3)
- [ ] Restaurant reviews and ratings
- [ ] Favourite restaurants (toggle + saved list)
- [ ] Cross-restaurant cart switch confirmation dialog
- [ ] Live order tracking with polling (constant defined, not wired)
- [ ] SMS OTP delivery (Twilio or MSG91)
- [ ] Email notifications (Resend or Nodemailer)
- [ ] Search page with debounced input + autocomplete

### Platform
- [ ] Flutter mobile app
- [ ] Vercel production deployment + custom domain
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Analytics integration (Posthog or Plausible)
- [ ] End-to-end tests (Playwright)

---

## Next milestones

| Priority | Milestone | Scope |
|---|---|---|
| 1 | Admin panel — core | Restaurant + order management, role guard |
| 2 | Image upload | Cloudinary integration for restaurant/menu images |
| 3 | Reviews & ratings | Star rating + comment on delivered orders |
| 4 | Production deployment | Vercel + Neon, environment secrets, domain |
| 5 | Flutter mobile app | Mobile client consuming the existing REST API |
