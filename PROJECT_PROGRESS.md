# Project Progress

Swiggy clone — full-stack food delivery web app. Built with Next.js 14, Prisma + Neon PostgreSQL, NextAuth.js v4, Zustand, Tailwind CSS.

---

## Completed

### Foundation
- [x] Next.js 14 App Router scaffold with TypeScript strict mode
- [x] Three-layer architecture: `src/` (frontend) · `server/` (backend) · `shared/` (contracts)
- [x] Path aliases configured: `@/*`, `@server/*`, `@shared/*`
- [x] Tailwind CSS with Swiggy design tokens (colors, shadows, font)
- [x] Global component classes: `.btn-primary`, `.btn-secondary`, `.input-base`, `.card`
- [x] `cn()` utility via clsx + tailwind-merge

### Database & ORM
- [x] Prisma schema: User, Address, Restaurant, MenuCategory, MenuItem, Order, OrderItem, OrderTimeline
- [x] Neon cloud PostgreSQL (ap-southeast-1), migration applied
- [x] Seed: 20 Bangalore restaurants, 10 menu items each, 3 categories per restaurant
- [x] Seed is idempotent (upsert on slug, updates image URLs on re-run)
- [x] Demo user: `demo@swiggy.com / password123`
- [x] Cuisines covered: South Indian, North Indian, Biryani, Chinese, Pizza, Burgers, Rolls, Pasta, Sushi, Momos, Thali, Desserts, Ice Cream

### Auth
- [x] NextAuth.js v4 with credentials provider
- [x] bcrypt password hashing (12 rounds)
- [x] Session augmented with `id` and `role`
- [x] `withAuth` middleware for protected API routes
- [x] Login and register pages with form validation

### Shared Layer
- [x] `shared/constants` — pricing, limits, auth params, order status labels/colors
- [x] `shared/helpers` — formatPrice, formatDeliveryTime, calculateDeliveryFee, calculateTaxes, calculateOrderTotal, generateOTP, slugify
- [x] `shared/interfaces` — all entity interfaces + API response contracts
- [x] `shared/schemas` — Zod schemas for register, address, order; types derived via `z.infer<>`
- [x] Constants deduplicated — `DELIVERY_FEE`, `FREE_DELIVERY_THRESHOLD` have exactly one definition

### Backend Services
- [x] `restaurantService` — list (filters + pagination), findById, findByIdWithMenu, search, getFeatured, getTopRated
- [x] `orderService` — create (with OTP generation), findById, findByUser, updateStatus
- [x] `addressService` — create, findByUser, setDefault
- [x] `userService` — create, findByEmail
- [x] Validators: `validateCreateOrderInput`, `validateRegisterUserInput`, `validateCreateAddressInput`

### API Routes
- [x] `GET/POST /api/restaurants` — list with filters, create
- [x] `GET /api/restaurants/[id]` — detail with menu
- [x] `POST /api/auth/register` — user registration
- [x] `GET/POST /api/addresses` — address management
- [x] `GET/POST /api/orders` — order history, place order
- [x] `GET/PATCH /api/orders/[id]` — order detail, status update
- [x] `GET /api/search` — unified search (restaurants + menu items)
- [x] All routes: ZodError → 422, other errors → 400

### Pages & Features
- [x] Homepage — hero search, category carousel, featured restaurants, top-rated section
- [x] Restaurant listing — server-side filtering (cuisine, rating, delivery time, pure veg, search, sort), URL-based pagination with filter preservation, page number bubbles
- [x] Restaurant detail — banner, info header, menu by category (collapsible sections), cart floating bar
- [x] Cart — item list, quantity controls, delivery fee, taxes, order total, free delivery progress
- [x] Checkout — address selection, payment mode picker, order summary, place order
- [x] Orders list — order history with status badges
- [x] Order tracking — status timeline, delivery OTP display
- [x] Login / Register — credential forms with error feedback

### UI Components
- [x] `Navbar` — sticky, responsive, session-aware, mobile hamburger menu
- [x] `Footer` — links, branding
- [x] `RestaurantCard` — image, rating (formatted count), cuisines, delivery info, closed overlay
- [x] `RestaurantFiltersBar` — active filter pills, sort dropdown
- [x] `MenuSection` — collapsible with smooth CSS transition (`grid-rows` animation)
- [x] `MenuItemCard` — veg/non-veg badge, bestseller tag, ADD / quantity stepper
- [x] `CartFloatingBar` — slide-up animation on mount
- [x] `CartItem`, `CartSummary`
- [x] `OrderTracker` — step progress bar, timeline
- [x] `Button`, `Input`, `Badge`, `Spinner`, `Skeleton`

### UI Polish & Stability
- [x] Skeleton loaders — `RestaurantCardSkeleton`, `RestaurantsPageSkeleton` (replaces bare spinner)
- [x] Global error boundary (`src/app/error.tsx`) with Navbar, reset button
- [x] 404 page with Navbar and Footer
- [x] Navbar hydration safety — `status === 'loading'` skeleton placeholder prevents auth flash
- [x] Mobile menu uses CSS height transition (smooth open/close)
- [x] `aria-label` on all icon buttons (hamburger, cart, ADD, +, −)
- [x] `aria-expanded` on hamburger and menu section toggles
- [x] `aria-live="polite"` on cart quantity display
- [x] Rating count formatted as `12.4K` instead of raw `12400`
- [x] Inline `style={{ minHeight: 340 }}` replaced with Tailwind `min-h-[340px]`
- [x] `animate-slide-up-bar` keyframe for CartFloatingBar mount
- [x] Restaurant images visually verified — all 20 show cuisine-relevant food photos

---

## Not yet implemented

- [ ] Cross-restaurant cart switch confirmation dialog (currently silently replaces cart)
- [ ] Address management UI (add/edit/delete addresses in profile)
- [ ] Profile page
- [ ] Restaurant owner dashboard
- [ ] Real payment gateway integration (currently COD / mock online)
- [ ] Live order tracking with WebSocket / polling (UI exists, data is static)
- [ ] Search page with debounced input and autocomplete
- [ ] Offer / discount code system
- [ ] Favourite restaurants
- [ ] Reviews and ratings
- [ ] PWA / mobile app wrapper
- [ ] End-to-end tests
- [ ] CI/CD pipeline

---

## Known limitations

- OTP is generated and stored in DB but not sent via SMS (no integration).
- Order status updates are manual (PATCH endpoint exists, no automated progression).
- `ORDER_TRACKING_POLL_INTERVAL_MS` constant exists but polling is not wired up in the tracking page.
- Delivery coordinates are stored but not used for distance-based routing.
