# Swiggy Clone — Full-Stack Food Delivery Platform

A production-grade Swiggy clone built with Next.js 14 (App Router), TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js (Credentials + Google OAuth) |
| State | Zustand (cart) |
| Deployment | Vercel + Supabase |

## Features

- **Homepage** — Hero search, cuisine carousel, featured & top-rated restaurants
- **Restaurant Listing** — Filters: rating, delivery time, pure veg, sort by
- **Restaurant Detail** — Menu with collapsible categories, real-time cart
- **Cart** — Persistent Zustand cart, multi-restaurant detection, delivery fee calc
- **Checkout** — Address management, payment mode selection, order placement
- **Order Tracking** — Step-by-step live order status with polling
- **Auth** — Email/password registration + login, Google OAuth (optional)

## Quick Start

### 1. Clone & Install

```bash
git clone <repo>
cd Swiggy_Clone
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Fill in your DATABASE_URL and NEXTAUTH_SECRET
```

Minimum required in `.env`:
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="any-random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to DB (dev)
npm run db:push

# Seed with 8 restaurants + menus
npm run db:seed
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:** `demo@swiggy.com` / `password123`

## Project Structure

```
app/
├── (auth)/login, register        # Auth pages
├── restaurants/[id]/             # Restaurant detail + menu
├── cart/                         # Cart page
├── checkout/                     # Checkout page
├── orders/[id]/                  # Order tracking
├── api/
│   ├── auth/[...nextauth]/       # NextAuth handler
│   ├── auth/register/            # User registration
│   ├── restaurants/              # List + detail endpoints
│   ├── addresses/                # Address CRUD
│   ├── orders/                   # Order create + track
│   └── search/                   # Full-text search
├── page.tsx                      # Homepage
└── layout.tsx                    # Root layout

components/
├── ui/                           # Button, Input, Badge, Spinner
├── layout/                       # Navbar, Footer
├── home/                         # HeroSearch, CategoryCarousel, RestaurantCard
├── restaurant/                   # RestaurantHeader, MenuSection, MenuItemCard
├── cart/                         # CartItem, CartSummary
└── order/                        # OrderTracker

lib/
├── prisma.ts                     # Singleton Prisma client
├── auth.ts                       # NextAuth config
└── utils.ts                      # formatPrice, slugify, etc.

store/
└── cartStore.ts                  # Zustand cart with localStorage persist

types/
└── index.ts                      # All TypeScript interfaces
```

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/restaurants` | List restaurants (filterable) |
| GET | `/api/restaurants/[id]` | Restaurant + full menu |
| GET | `/api/search?q=` | Full-text search |
| POST | `/api/auth/register` | Create user |
| GET/POST | `/api/addresses` | User addresses |
| GET/POST | `/api/orders` | List / place orders |
| GET/PATCH | `/api/orders/[id]` | Track / update order status |

## Database Schema

Core models: `User`, `Restaurant`, `MenuCategory`, `MenuItem`, `Order`, `OrderItem`, `Address`

See `prisma/schema.prisma` for the full schema.

## Deployment

1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Set `DATABASE_URL` to a PostgreSQL provider (Supabase, Neon, Railway)
5. Run `npx prisma migrate deploy` in the Vercel build command or via a migration script
