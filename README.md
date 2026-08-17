# Mealora — Full-Stack Food Delivery Platform

[![Status](https://img.shields.io/badge/Status-Active_Development-orange)](docs/PROJECT_PROGRESS.md)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Flutter](https://img.shields.io/badge/Flutter-Dart-02569B)](https://flutter.dev/)

**Mealora** is a full-stack food delivery platform built with Next.js 14 (App Router), TypeScript, Prisma, Neon PostgreSQL, and Flutter. It ships a customer-facing web application, a fully implemented admin panel, and a Flutter mobile client — all sharing a common backend API and type-safe contracts.

> 🚧 This is an actively developed project. See [docs/PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md) for an honest breakdown of what is complete, what is in progress, and what is pending.

---

## Overview

| Platform | Description |
| :--- | :--- |
| **Customer Web App** | Next.js 14 — browse restaurants, manage cart, checkout via Razorpay or COD, track orders |
| **Admin Panel** | Next.js (same app, `/admin` route group) — restaurant, menu, order, coupon, and user management |
| **Flutter Mobile** | Dart/Flutter — feature-based mobile client consuming the same REST API |
| **Backend API** | Next.js API Routes behind a layered Service → Repository → Prisma architecture |
| **Database** | PostgreSQL hosted on Neon (cloud), managed via Prisma ORM |

---

## Architecture

The project enforces a strict three-layer separation to prevent trust boundary violations:

```
Browser / Flutter Client
        │
        ├── Server Component (page.tsx)
        │       └── imports service directly ──► Service ──► Repository ──► Prisma ──► Neon DB
        │           (runs at SSR time — no network hop, no API round-trip)
        │
        └── Client Component (interactions, mutations)
                └── fetch('/api/...') ──► API Route ──► Validator ──► Service ──► Repository ──► Neon DB
```

**Key invariant:** Server components never call API routes for their own data. They import server services directly, eliminating a round-trip and keeping all sensitive logic server-side.

```mermaid
graph TD
    subgraph "Web Browser"
        SC[Server Component] --> SVC1[Service]
        CC[Client Component] -->|fetch /api/...| AR[API Route]
    end

    subgraph "Flutter Mobile"
        FL[Feature Screen] --> REPO_F[Repository]
        REPO_F -->|Dio HTTP| AR
    end

    subgraph "Backend — Next.js"
        AR --> VAL[Validator / Zod]
        VAL --> SVC2[Service]
        SVC1 --> REPO[Repository]
        SVC2 --> REPO
        REPO --> PRISMA[Prisma ORM]
    end

    subgraph "Infrastructure"
        PRISMA --> DB[(Neon PostgreSQL)]
        SVC2 --> RZP[Razorpay]
    end
```

### Layer Contracts

| Layer | Path | Rule |
| :--- | :--- | :--- |
| Shared contracts | `shared/` | Zero dependencies — no Next.js, no React, no Prisma |
| Backend | `server/` | Imports from `shared/` and `@prisma/client` only |
| API routes | `src/app/api/` | Calls validators and services — never queries DB directly |
| Frontend | `src/` | Reads from stores, components, `lib/` — never imports from `server/` |
| Flutter | `mobile/lib/` | Feature-first: `core/ → features/ → shared/` |

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router), React 18 |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 3, custom design tokens |
| **Database** | PostgreSQL — Neon cloud (ap-southeast-1) |
| **ORM** | Prisma 5 |
| **Authentication** | NextAuth.js v4 — credentials provider + optional Google OAuth |
| **State Management** | Zustand 4 with `persist` middleware (localStorage) |
| **Validation** | Zod v4 — shared schemas, derived TypeScript types |
| **Payments** | Razorpay — UPI, cards, net banking, wallets, EMI |
| **Mobile** | Flutter, Dart, Riverpod 2, Dio 5, go_router 14, razorpay_flutter |
| **Hosting target** | Vercel + Neon (zero-config) |

---

## Key Features

### Customer Web Application

| Feature | Status |
| :--- | :--- |
| Email/password registration and login | ✅ Complete |
| Multi-city selection (8 cities) — persists across sessions | ✅ Complete |
| Homepage — hero search, cuisine carousel, promo cards, featured restaurants | ✅ Complete |
| Restaurant listing — filter by city, cuisine, rating, delivery time, veg; sort; paginated | ✅ Complete |
| Restaurant detail — collapsible menu categories, sticky cart bar | ✅ Complete |
| Cart — Zustand-persisted, multi-restaurant detection | ✅ Complete |
| Checkout — saved addresses, coupon selector, COD and Razorpay online payment | ✅ Complete |
| Coupon/promo system — PERCENTAGE and FLAT types, min order, max cap, expiry | ✅ Complete |
| Order tracking — step-by-step timeline, OTP at delivery stage | ✅ Complete |
| Order history — SSR page 1 + Load More pagination | ✅ Complete |
| Full profile management — name, email, phone, address CRUD | ✅ Complete |
| Skeleton loading screens on all 8 routes | ✅ Complete |
| Global error boundary, 404 page, route progress bar | ✅ Complete |

### Admin Panel

The admin panel lives within the same Next.js application under `/admin` and is protected by role-based access (`role === 'ADMIN'`).

| Module | Status |
| :--- | :--- |
| Role-based layout guard (admin sidebar, header) | ✅ Complete |
| Dashboard — order KPIs, revenue, recent activity | ✅ Complete |
| Restaurant management — list, create, edit, toggle open/closed | ✅ Complete |
| Menu management — categories and items CRUD | ✅ Complete |
| Order management — all orders, manual status updates | ✅ Complete |
| Coupon management — create, edit, activate/deactivate | ✅ Complete |
| User management — list users, assign roles | ✅ Complete |

### Flutter Mobile Application

| Feature | Status |
| :--- | :--- |
| Authentication — login and registration | ✅ Complete |
| City selection | ✅ Complete |
| Restaurant listing | ✅ Complete |
| Restaurant detail and menu browsing | ✅ Complete |
| Cart management | ✅ Complete |
| Checkout (Razorpay + COD) | ✅ Complete |
| Orders list and order detail | ✅ Complete |
| Address management | ✅ Complete |
| Profile screen | ✅ Complete |
| Coupon data layer (models, providers, repository) | ✅ Backend ready |
| Coupon UI in checkout | 🚧 In progress |

### Known Limitations

- OTP delivery via SMS not connected (no provider configured — OTP is generated and stored).
- Order status progression is manual — no automated delivery partner integration.
- Live order polling constant is defined but not wired up.
- Restaurant images are sourced from Unsplash — not user-uploadable.
- City filter is functional but seed data covers Bangalore only (other cities return empty).
- No transactional email notifications.

---

## Repository Structure

```
Mealora/
├── docs/                    # All project documentation (see Documentation table below)
│
├── prisma/
│   ├── schema.prisma        # Single source of DB schema + migration history
│   ├── seed.ts              # Entry point — delegates to prisma/seed/
│   └── seed/
│       ├── index.ts         # Orchestrator — upserts demo user, admin, coupons
│       ├── bangalore.ts     # 20 seeded restaurants + menus
│       └── ...              # Additional city seed files
│
├── shared/                  # Framework-free contracts — no Next.js, no Prisma
│   ├── constants/index.ts   # DELIVERY_FEE, TAX_RATE, pagination limits, status labels
│   ├── helpers/index.ts     # formatPrice, calculateOrderTotal, generateOTP, slugify
│   ├── interfaces/index.ts  # Entity interfaces, PaginatedResponse<T>, PaginationParams
│   └── schemas/index.ts     # Zod schemas + inferred TypeScript input types
│
├── server/                  # Pure Node.js backend — no React imports
│   ├── repositories/        # Prisma query layer (one file per entity)
│   ├── services/            # Business logic (one file per domain)
│   ├── validators/          # Thin wrappers: schema.parse(body)
│   └── middleware/
│       └── withAuth.ts      # Session guard → 401 if unauthenticated
│
├── src/                     # Next.js application
│   ├── app/
│   │   ├── (auth)/          # Login and register pages (no shared layout)
│   │   ├── restaurants/     # Listing page + [id] detail page
│   │   ├── cart/            # Cart page (Zustand-backed, client component)
│   │   ├── checkout/        # Checkout (address, coupon, Razorpay/COD)
│   │   ├── orders/          # Order history + [id] detail + tracking
│   │   ├── profile/         # Profile + address management
│   │   ├── admin/           # Admin panel (layout, dashboard, CRUD modules)
│   │   └── api/             # API routes — auth, restaurants, orders, payments, admin
│   ├── components/
│   │   ├── ui/              # Primitive components (Button, Input, Badge, Skeleton, Toast)
│   │   ├── layout/          # Navbar, Footer
│   │   ├── home/            # HeroSearch, CategoryCarousel, PromoCards, RestaurantCard
│   │   ├── restaurant/      # RestaurantHeader, MenuSection, CartFloatingBar, filters
│   │   ├── checkout/        # CouponSelector, CouponCard, CouponInput
│   │   ├── order/           # OrderTracker, OrdersList, OrderSuccessBanner
│   │   ├── profile/         # ProfileContent, AddressCard, AddressModal, EditProfileModal
│   │   └── admin/           # Admin layout, tables, forms (restaurants, orders, coupons, users)
│   ├── store/
│   │   ├── cartStore.ts     # localStorage key: mealora-cart
│   │   ├── cityStore.ts     # localStorage key: mealora-city
│   │   └── settingsStore.ts # localStorage key: mealora-settings
│   ├── lib/                 # Auth config, Prisma singleton, utilities
│   └── middleware.ts        # Route-level auth guard (/profile, /orders, /checkout)
│
├── mobile/                  # Flutter mobile application
│   └── lib/
│       ├── core/            # Config, theme, networking (Dio), shared navigation
│       ├── features/        # Feature-first: auth, home, restaurants, cart, checkout,
│       │                    #   orders, profile, addresses, city, coupons
│       └── shared/          # Reusable widgets, screens, constants
│
├── public/                  # Static assets (favicon, icons, manifests)
├── tailwind.config.ts       # Design tokens: brand-primary, app-black, app-gray, etc.
├── prisma/schema.prisma     # Database schema
├── .env.example             # Environment variable template (safe to commit)
└── package.json
```

---

## Database

**PostgreSQL** hosted on [Neon](https://neon.tech/), managed via **Prisma 5**.

### Schema Overview

```
User ──< Account                  (OAuth provider links)
User ──< Address
User ──< Order ──< OrderItem
               └─< OrderTimeline

Restaurant ──< MenuCategory ──< MenuItem

Coupon                            (independent entity, validated per-request)
```

### Design Decisions

| Decision | Rationale |
| :--- | :--- |
| Cart lives in `localStorage` only | No DB cart table — Zustand handles it client-side |
| `OrderItem` stores name + price snapshots | Menu prices can change — order history must stay accurate |
| `Order.discount` computed server-side | Frontend coupon values are never trusted |
| `Order.couponCode` stored on order | Discount visible in history, receipts, and admin |
| `@@index([userId, createdAt])` on Order | Efficient paginated order history queries |
| `Order.otp` generated at creation | 4-digit delivery confirmation code |
| `razorpayOrderId` + `razorpayPaymentId` | Full audit trail for online payments |
| JWT sessions, no session DB table | Stateless — `NEXTAUTH_SECRET` controls signing |

### Coupon Model

Supports `PERCENTAGE` and `FLAT` discount types with optional `minOrderAmount`, `maxDiscount` cap, `expiresAt`, and `isActive` soft-disable. Server validates on every order creation — the frontend discount value is always discarded.

### Seed Data

Running `npm run db:seed` creates:
- Demo user: `demo@mealora.app` / `Demo@1234`
- Admin user: `admin@mealora.app` / `admin123`
- 20 Bangalore restaurants with 3 menu categories and ~10 items each
- 4 demo coupons: `WELCOME20`, `FLAT50`, `SAVE100`, `FESTIVE30`

---

## API Reference

### Public API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/restaurants` | Paginated restaurant list (city, cuisine, filters, sort) |
| `GET` | `/api/restaurants/[id]` | Restaurant detail + full menu by category |
| `GET` | `/api/search?q=` | Full-text restaurant search |
| `POST` | `/api/auth/register` | Create new user account |
| `GET/PATCH` | `/api/users/me` | Current user profile |
| `GET/POST` | `/api/addresses` | User address list / create |
| `PATCH/DELETE` | `/api/addresses/[id]` | Update or delete address |
| `GET/POST` | `/api/orders` | Paginated order history / place new order |
| `GET/PATCH` | `/api/orders/[id]` | Order detail / update status |
| `GET` | `/api/coupons` | Active coupons list |
| `POST` | `/api/coupons/validate` | Validate coupon and compute discount |
| `POST` | `/api/payments/create-order` | Create Razorpay order (server-side amount computation) |
| `POST` | `/api/payments/verify` | HMAC-SHA256 signature verification + order creation |

### Admin API (`/api/admin/**`)

All admin routes require `role === 'ADMIN'`. Unauthenticated or unauthorized requests receive `401`/`403`.

| Scope | Routes |
| :--- | :--- |
| Restaurants | `/api/admin/restaurants`, `/api/admin/restaurants/[id]` |
| Orders | `/api/admin/orders`, `/api/admin/orders/[id]/status` |
| Coupons | `/api/admin/coupons`, `/api/admin/coupons/[id]` |
| Users | `/api/admin/users`, `/api/admin/users/[id]/role` |

### Request Flow

```
API Route → Validator (Zod schema.parse) → Service → Repository → Prisma
               └── ZodError → 422 with issues array
               └── other errors → 400
```

---

## Payment Flow

### Cash on Delivery

```
POST /api/orders
  └─ orderService.create()
       ├─ fetches real item prices from DB
       ├─ couponService.validateAndCompute() — server-side discount
       ├─ calculateOrderTotal() — server-side total
       └─ Order created (paymentMode: COD, paymentStatus: PENDING)
```

### Razorpay (Online)

```
1. POST /api/payments/create-order
   └─ menuRepository.findByIds() → real prices from DB
   └─ couponService.validateAndCompute() → server-side discount
   └─ razorpay.orders.create({ amount: totalInPaise })
   └─ returns { razorpayOrderId, keyId (public), amount, … }
        ↑ keySecret is NEVER returned

2. Client opens Razorpay modal with order ID and public key ID only

3. POST /api/payments/verify
   └─ HMAC-SHA256 timingSafeEqual check
   └─ couponService.validateAndCompute() called again (double-validation)
   └─ orderService.create() → Order saved (paymentStatus: PAID)
```

**Security invariant:** The total is computed server-side on every payment attempt. The Razorpay Key Secret never leaves the server.

---

## Flutter Mobile Application

The Flutter app is a feature-first client that consumes the same REST API as the web.

```
mobile/lib/
├── core/
│   ├── api/          # Dio client with auth interceptor
│   ├── config/       # AppConfig (base URL via String.fromEnvironment)
│   ├── theme/        # AppColors, AppTextStyles, AppTheme
│   └── navigation/   # go_router setup, route names, guards
│
├── features/
│   ├── auth/         # Login, register screens + providers
│   ├── home/         # Home screen — restaurant preview, city header
│   ├── restaurants/  # Listing + detail screens + providers
│   ├── cart/         # Cart screen + cart notifier
│   ├── checkout/     # Checkout screen, Razorpay integration
│   ├── orders/       # Orders list + order detail screens
│   ├── addresses/    # Address management
│   ├── profile/      # Profile screen
│   ├── city/         # City selection widget
│   └── coupons/      # Coupon models, repository, providers (UI pending)
│
└── shared/
    ├── widgets/      # AppLoadingWidget, AppErrorWidget, RestaurantCard, SectionHeader
    └── screens/      # MainShell (bottom navigation)
```

**Architecture:** Each feature owns its models, repository (Dio HTTP calls), providers (Riverpod notifiers), and screens. Core infrastructure (networking, routing, theming) lives in `core/`. Widgets shared across features live in `shared/widgets/`.

**Base URL:** Configured at compile time via `String.fromEnvironment('BASE_URL', defaultValue: 'http://localhost:3000')`. Override with `--dart-define=BASE_URL=https://your-api.com` for production builds.

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- A PostgreSQL database — [Neon](https://neon.tech) free tier works
- A [Razorpay](https://dashboard.razorpay.com) account (test keys — free)
- [Flutter SDK](https://flutter.dev/docs/get-started/install) (for mobile only)
- [Git](https://git-scm.com/)

### 1. Clone

```bash
git clone https://github.com/<your-org>/mealora.git
cd mealora
```

### 2. Install Web Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your own values:

```env
# PostgreSQL connection string (Neon, Railway, Supabase, or local)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/mealora?schema=public"

# NextAuth — generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"

# JWT (used for Flutter mobile auth)
JWT_SECRET="your-random-32-char-secret"

# Google OAuth (optional — remove GOOGLE_* lines if not using)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Razorpay — public key goes into .env too (NEXT_PUBLIC_ prefix makes it browser-safe)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"   # ← server-only, NEVER expose
```

> **Two env files required by Prisma + Next.js:**  
> - `.env` — read by the Prisma CLI (`DATABASE_URL` only)  
> - `.env.local` — read by Next.js at runtime (all variables)  
>
> Easiest setup: copy `.env.example` to both `.env` and `.env.local`.

### 4. Set Up the Database

```bash
npm run db:migrate   # apply migrations and generate Prisma client
npm run db:seed      # seed demo restaurants, users, and coupons
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:**
- Customer: `demo@mealora.app` / `Demo@1234`
- Admin: `admin@mealora.app` / `admin123` → [http://localhost:3000/admin](http://localhost:3000/admin)

### Flutter Setup

```bash
cd mobile
flutter pub get
flutter run          # connect a device or start a simulator first
```

The Flutter app targets `http://localhost:3000` by default. For a deployed backend:

```bash
flutter run --dart-define=BASE_URL=https://your-deployed-api.com
```

---

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random 32-character string for session signing |
| `NEXTAUTH_URL` | ✅ | Full URL of the app (e.g. `http://localhost:3000`) |
| `JWT_SECRET` | ✅ | Random 32-character string for mobile JWT signing |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | Public Razorpay key ID (safe to expose to browser) |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay secret key — **server-only, never expose** |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret — **server-only** |

**Security rules:**
- `.env` and `.env.local` are gitignored — never commit them
- Only `.env.example` (with placeholder values) is committed
- `RAZORPAY_KEY_SECRET` must never appear in frontend code, Flutter source, API responses, or logs
- Server recalculates all order totals — never trust client-submitted amounts

---

## Development Workflow

### Running Commands

```bash
# Web
npm run dev          # dev server → http://localhost:3000
npm run build        # production build (type checks + compile)
npm run lint         # ESLint across src/, shared/, server/
npm start            # serve production build

# Database
npm run db:migrate   # apply pending migrations + regenerate Prisma client
npm run db:seed      # seed demo data (idempotent upserts)
npm run db:studio    # Prisma Studio GUI → http://localhost:5555

# Flutter (run from mobile/)
cd mobile
flutter pub get      # install dependencies
flutter run          # launch on connected device/simulator
flutter analyze      # static analysis
flutter test         # widget + unit tests
flutter clean        # clear build cache
```

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/<scope>
git checkout -b fix/<scope>
git checkout -b chore/<scope>

# Conventional commit format
git commit -m "feat: <what and why>"
git commit -m "fix: <what broke and why>"
git commit -m "chore: <tooling change>"
git commit -m "docs: <what was documented>"
```

**Before committing:**
1. `npm run lint` — must pass with zero warnings
2. `npm run build` — must compile cleanly (catches type errors)
3. `flutter analyze` — zero errors/warnings (Flutter changes)
4. Update `docs/PROJECT_PROGRESS.md` after completing a feature

Refer to [docs/RULES.md](docs/RULES.md) for the full engineering constitution.

---

## Testing

### Web

```bash
npm run lint         # ESLint — must pass before any commit
npm run build        # TypeScript + Next.js compile check
```

Unit and integration tests are not yet implemented for the web app. End-to-end tests (Playwright) are planned. See [docs/PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md).

### Flutter

```bash
cd mobile
flutter analyze      # static analysis — 0 errors/warnings enforced
flutter test         # widget tests
```

The Flutter test suite includes a smoke test confirming the app renders under `ProviderScope` without crashing.

---

## Security

- All secrets are loaded from environment variables — never hardcoded
- `.env` and `.env.local` are gitignored; only `.env.example` with placeholders is committed
- `RAZORPAY_KEY_SECRET` is used exclusively in `server/services/payment.service.ts` — never returned in API responses, never in Flutter or frontend code
- Server fetches real menu prices from the database on every payment — frontend amounts are ignored
- Coupon discounts are validated server-side twice (once on order creation, once on payment verification)
- Admin routes (`/api/admin/**`) require `role === 'ADMIN'` — checked at both middleware and service layer
- Razorpay payment signatures are verified via `crypto.timingSafeEqual` HMAC-SHA256
- Passwords are hashed with bcrypt (12 rounds)
- Route-level middleware (`src/middleware.ts`) protects `/profile`, `/orders`, and `/checkout`

---

## AI-Assisted Development

This project uses AI-assisted engineering workflows throughout its development lifecycle. Tools include [Claude Code](https://www.anthropic.com/claude) and [Antigravity IDE](https://antigravity.dev), guided by project-specific documentation:

- [`docs/AGENTS.md`](docs/AGENTS.md) — agent roster, responsibilities, and collaboration boundaries
- [`docs/RULES.md`](docs/RULES.md) — non-negotiable architecture and trust rules that all agents must follow
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design and data flow reference
- [`CLAUDE.md`](CLAUDE.md) — Claude Code project instructions (required at repo root by tooling)

AI assistance accelerates implementation but does not replace architecture review. All engineering decisions are validated against `docs/RULES.md`.

---

## Documentation

| Document | Purpose |
| :--- | :--- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Full system design — layers, directory layout, DB schema, data flows, pagination, city architecture |
| [docs/RULES.md](docs/RULES.md) | Non-negotiable engineering rules and layer contracts |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Complete CLI command reference — web, database, Flutter, git workflow |
| [docs/PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md) | Phase-by-phase feature completion tracker — completed, known limitations, pending |
| [docs/SKILLS.md](docs/SKILLS.md) | Implemented capabilities and infrastructure reference |
| [docs/AGENTS.md](docs/AGENTS.md) | AI agent roster, boundaries, and collaboration workflow |
| [CLAUDE.md](CLAUDE.md) | Claude Code project instructions |

---

## Project Status

### Completed

- Full customer web application (auth, restaurants, cart, checkout, orders, profile)
- Razorpay online payments with HMAC verification and double coupon validation
- COD payment flow
- Multi-city support (8 cities)
- Full coupon/promo system with server-side enforcement
- Order lifecycle tracking with OTP at delivery stage
- Admin panel — all CRUD modules (restaurants, menus, orders, coupons, users)
- Role-based admin authorization
- Flutter mobile client — all core screens implemented
- Skeleton loading infrastructure across all routes
- Shared type-safe contract layer (`shared/`)

### In Progress

- Flutter coupon UI in checkout (data layer complete)

### Pending

- Image upload (Cloudinary / S3)
- Restaurant reviews and ratings
- Live order status polling
- SMS OTP delivery
- Email notifications
- Vercel production deployment
- CI/CD pipeline (GitHub Actions)
- End-to-end tests (Playwright)

See [docs/PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md) for the full breakdown and next milestones.

---

## License

No license has been applied to this repository yet.
