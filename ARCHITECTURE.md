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
| Hosting target | Vercel (zero-config with Neon) |

## Directory layout

```
.
├── prisma/
│   ├── schema.prisma        # single source of DB schema
│   ├── seed.ts              # 20 restaurants, demo user
│   └── migrations/          # applied migrations
│
├── shared/                  # framework-free contracts
│   ├── constants/index.ts   # DELIVERY_FEE, TAX_RATE, limits, labels
│   ├── helpers/index.ts     # formatPrice, calculateDeliveryFee, etc.
│   ├── interfaces/index.ts  # IRestaurant, IOrder, IUser, etc. + API contracts
│   └── schemas/index.ts     # Zod schemas, inferred input types
│
├── server/                  # pure Node backend
│   ├── repositories/        # all Prisma queries (one file per entity)
│   ├── services/            # business logic, orchestrates repositories
│   ├── validators/          # thin wrappers: schema.parse(body)
│   └── middleware/
│       └── withAuth.ts      # session guard for API routes
│
└── src/                     # Next.js app
    ├── app/
    │   ├── layout.tsx        # root layout, SessionProvider, global font
    │   ├── page.tsx          # homepage (hero, categories, featured)
    │   ├── loading.tsx       # global loading skeleton
    │   ├── error.tsx         # global error boundary
    │   ├── not-found.tsx     # 404 with Navbar + Footer
    │   ├── (auth)/           # login, register (route group, no shared layout)
    │   ├── restaurants/
    │   │   ├── page.tsx      # listing, filters, server-side pagination
    │   │   └── [id]/page.tsx # detail, menu by category, CartFloatingBar
    │   ├── cart/page.tsx     # cart review, order summary
    │   ├── checkout/page.tsx # address selection, payment mode, place order
    │   ├── orders/
    │   │   ├── page.tsx      # order history
    │   │   └── [id]/page.tsx # order tracking + timeline
    │   └── api/              # route handlers
    │       ├── auth/[...nextauth]/  # NextAuth handler
    │       ├── auth/register/       # POST — new user
    │       ├── restaurants/         # GET list, GET [id]
    │       ├── addresses/           # GET, POST
    │       ├── orders/              # GET list, POST create, GET/PATCH [id]
    │       └── search/             # GET — unified search
    ├── components/
    │   ├── layout/           # Navbar, Footer
    │   ├── home/             # HeroSearch, CategoryCarousel, RestaurantCard
    │   ├── restaurant/       # RestaurantHeader, MenuSection, MenuItemCard,
    │   │                     #   RestaurantFiltersBar, CartFloatingBar
    │   ├── cart/             # CartItem, CartSummary
    │   ├── order/            # OrderTracker
    │   └── ui/               # Button, Input, Badge, Spinner, Skeleton
    ├── store/
    │   └── cartStore.ts      # Zustand cart (localStorage persist)
    ├── lib/
    │   └── utils.ts          # re-exports shared helpers + cn()
    ├── types/index.ts        # frontend type aliases (maps to shared interfaces)
    └── styles/globals.css    # Tailwind directives, design tokens, animations
```

## Data flow

```
Browser
  │
  ├─ Server Component (page.tsx)
  │     └─ calls service directly ──► service ──► repository ──► Prisma ──► Neon DB
  │
  └─ Client Component
        └─ fetch('/api/...') ──► API route ──► validates ──► service ──► repository ──► Neon DB
```

Server components never call API routes for their own data — they import services directly, which eliminates a network hop and keeps sensitive logic server-side.

## Auth flow

```
POST /api/auth/register   →  userService.create()  →  bcrypt hash  →  DB
POST /api/auth/signin     →  NextAuth credentials  →  compare hash →  JWT session
useSession() / getServerSession()  →  session.user.{id, email, name, role}
```

Session is a JWT (no DB session table). `withAuth` middleware reads the session server-side and returns 401 if absent.

## Cart architecture

Cart state lives entirely on the client — Zustand store persisted to `localStorage`. On checkout, the client POSTs the cart snapshot to `/api/orders`. The server re-validates totals using `shared/helpers` rather than trusting client-computed values.

Switching restaurants while items are in the cart replaces the cart (confirmed via UX prompt — not yet implemented; currently silently clears).

## Pricing constants (single source of truth)

All computed in `shared/helpers/index.ts`, sourced from `shared/constants/index.ts`:

| Constant | Value |
|---|---|
| `DELIVERY_FEE` | ₹40 flat |
| `FREE_DELIVERY_THRESHOLD` | ₹299 subtotal |
| `TAX_RATE` | 5% GST |

## Validation strategy

- Input schemas defined in `shared/schemas/index.ts` (Zod)
- `server/validators/` are one-liner wrappers: `schema.parse(body)`
- API routes: `ZodError.issues` → 422 with joined messages; other errors → 400
- Frontend form validation is UI-only (not a security boundary)

## Database schema (summary)

```
User ──< Address
User ──< Order ──< OrderItem
Order ──> Restaurant
Order ──< OrderTimeline
Restaurant ──< MenuCategory ──< MenuItem
```

Key decisions: no separate session table (JWT), no DB cart table (localStorage), OTP generated server-side on order creation.

## Pagination

Restaurant listing uses URL-based pagination (`/restaurants?page=N`). `buildPageUrl()` in `restaurants/page.tsx` copies all active filter params before setting the new page number, ensuring filters persist across pages. Default limit: 12, max: 50.

## Image hosting

Restaurant and menu item images are sourced from Unsplash (`images.unsplash.com`). Allowed via `next.config.mjs` `remotePatterns`. Images use `?w=400&h=300&fit=crop` query params for consistent sizing.
