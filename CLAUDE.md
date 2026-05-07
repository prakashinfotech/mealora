# CLAUDE.md — AI Engineering Guide

## Project

Full-stack Swiggy food delivery clone. Next.js 14 App Router, TypeScript strict, PostgreSQL (Neon) via Prisma, NextAuth.js v4, Zustand, Tailwind CSS.

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build (tsc + Next.js compiler)
npm run lint         # ESLint
npm run db:migrate   # prisma migrate dev
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # Prisma Studio GUI
```

## Layer rules — strictly enforced

| Layer | Path | Rule |
|---|---|---|
| Frontend | `src/` | No direct DB access. Import from `@/lib/utils`, `@/store`, `@/components`, `@/types` |
| Backend | `server/` | No Next.js/React imports. Services and repositories only |
| Shared | `shared/` | No framework imports. Types, schemas, constants, pure helpers only |
| API routes | `src/app/api/` | Call `server/` services. Validate via `server/validators/`. No raw Prisma here |

**Path aliases:** `@/*` → `src/*` · `@server/*` → `server/*` · `@shared/*` → `shared/*`

## Adding a feature — checklist

1. Schema changes → `prisma/schema.prisma` + `npm run db:migrate`
2. New entity types → `shared/interfaces/index.ts`
3. Input validation → `shared/schemas/index.ts` (Zod) → thin wrapper in `server/validators/`
4. DB queries → `server/repositories/<entity>.repository.ts`
5. Business logic → `server/services/<entity>.service.ts`
6. API route → `src/app/api/<resource>/route.ts`
7. UI → `src/components/` or `src/app/<route>/page.tsx`

## Key conventions

- **Server components call services directly.** No HTTP round-trip needed for data fetching in page components. Client components use `fetch()` against API routes.
- **Zod is the single validation source.** Schemas in `shared/schemas/index.ts`; validators in `server/validators/` are thin wrappers calling `schema.parse(body)`. API routes catch `ZodError` → 422, other errors → 400.
- **Constants are never duplicated.** `DELIVERY_FEE`, `FREE_DELIVERY_THRESHOLD`, `TAX_RATE` defined once in `shared/constants/index.ts`.
- **Cart is client-only.** Zustand `persist` with `localStorage` key `swiggy-cart`. No DB cart table. Cart auto-clears on restaurant change.
- **`src/lib/utils.ts` is the frontend barrel.** Re-exports `@shared/helpers` and `@shared/constants` so components never import from `shared/` directly.
- **Design tokens only.** Use `brand-orange`, `swiggy-black`, `swiggy-gray`, `swiggy-green`, `swiggy-red`. Never hardcode hex values.
- **`cn()` for class merging.** `import { cn } from '@/lib/utils'` — clsx + tailwind-merge.

## Auth

- NextAuth.js v4 credentials provider (+ optional Google OAuth)
- Session augmented with `id` and `role`
- Server components: `getServerSession(authOptions)`
- Client components: `useSession()` — always guard with `status === 'loading'` check to prevent hydration flash (Navbar is the reference implementation)
- Protected API routes: `server/middleware/withAuth.ts`

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
```

## Database seed

20 restaurants (Bangalore), 10 menu items each, 3 categories per restaurant.
Demo user: `demo@swiggy.com / password123`.
Re-seeding is idempotent — upserts on `slug`, updating `imageUrl` and `bannerUrl`.

## Common mistakes to avoid

- Do not add `'use client'` to pages that only fetch data — keep them server components.
- Do not write Prisma queries outside `server/repositories/`.
- Do not import from `shared/` directly in `src/` components — go through `@/lib/utils` or `@/types`.
- Do not define constants in more than one place — `shared/constants/index.ts` is the source of truth.
- Use `ZodError.issues`, not `.errors` (Zod v4 renamed the field).
