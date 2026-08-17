# RULES.md — Architecture & Engineering Constitution

These rules are non-negotiable. They exist to prevent layer pollution, duplicate logic, and trust boundary violations that have caused real bugs in this project.

---

## Layer Rules

| Layer | Path | Allowed imports |
|---|---|---|
| Shared contracts | `shared/` | Nothing — no Next.js, no React, no Prisma |
| Backend | `server/` | `shared/`, `@prisma/client`, Node built-ins |
| API routes | `src/app/api/` | `server/` services + validators only |
| Frontend | `src/` | `@/lib/utils`, `@/store`, `@/components`, `@/types` |
| Flutter | `mobile/lib/` | Feature-first: `core/ → features/ → shared/` |

---

## NEVER DO

### Architecture
- **NEVER** query Prisma from React components or API routes — use `server/repositories/`
- **NEVER** put business logic in API routes — use `server/services/`
- **NEVER** import from `shared/` directly in `src/` — go through `@/lib/utils` or `@/types`
- **NEVER** define the same constant in more than one file — `shared/constants` is the single source
- **NEVER** duplicate Zod schemas — `shared/schemas/index.ts` owns all input validation
- **NEVER** mix admin and public API routes under the same namespace

### Trust & Security
- **NEVER** trust frontend-computed prices — always recompute subtotal/tax/delivery server-side
- **NEVER** trust the frontend coupon discount — `couponService.validateAndCompute` runs server-side on every order
- **NEVER** skip `withAuth` on routes that modify user data
- **NEVER** store sensitive credentials in client components or Zustand stores
- **NEVER** bypass HMAC verification on Razorpay callbacks

### Frontend
- **NEVER** add `'use client'` to pages that only fetch data — keep them server components
- **NEVER** hardcode hex color values — use design tokens (`brand-primary`, `app-black`, etc.)
- **NEVER** render city-dependent UI before `_hasHydrated` is true (causes SSR mismatch)
- **NEVER** serialize `Date` objects as props to client components — convert to `.toISOString()` first

### Flutter
- **NEVER** add codegen packages (`freezed`, `riverpod_generator`, `json_serializable`) without verifying `analyzer` compatibility — use plain Dart models
- **NEVER** store business logic in widgets — use Riverpod notifiers
- **NEVER** create a new `GoRouter` instance on auth state change — use `refreshListenable`
- **NEVER** trust compile-time constants to hot-reload — always do full `flutter run`

### Code Quality
- **NEVER** use `ZodError.errors` — Zod v4 renamed it to `ZodError.issues`
- **NEVER** call `loadRazorpayScript()` more than once — it is already a singleton
- **NEVER** write Prisma queries outside `server/repositories/`

---

## Validation Rules

- All input validation goes through Zod (`shared/schemas/index.ts`)
- Validators in `server/validators/` are one-liners: `schema.parse(body)`
- API routes catch `ZodError` → 422 with `err.issues`; other errors → 400
- Frontend forms validate on blur and on submit — never only on submit
- Login forms use `validatePassword` (non-empty only); registration uses `validateNewPassword` (full strength policy)
- Password strength: 8+ chars, uppercase, lowercase, digit, special character

---

## Pagination Rules

- Use URL search params (`?page=N`) for server-rendered listing pages
- Use API "Load More" for client-rendered lists (orders)
- `PaginatedResponse<T>` and `PaginationParams` are defined once in `shared/interfaces`
- Default: page=1, limit=10–12; max: 50 — enforced in service layer

---

## Auth & Role Rules

- Session has `id` and `role` — set in `callbacks.jwt` / `callbacks.session`
- Server components use `getServerSession(authOptions)` — never `useSession()`
- Client components guard on `status === 'loading'` before rendering session-dependent UI
- Admin routes require `role === 'ADMIN'` — checked at both middleware and service layer
- Protected pages: `/profile`, `/orders`, `/checkout` — covered by `src/middleware.ts`

---

## Component Rules

- `src/components/ui/` — pure primitives with zero business logic
- Feature components live in named folders under `src/components/`
- No component reaches into another feature's folder — cross-feature communication via stores or props
- Every route must have a `loading.tsx` that exports a route-specific skeleton

---

## API Namespace Rules

- Public API: `/api/restaurants`, `/api/orders`, `/api/users`, `/api/coupons`, `/api/payments`
- Admin API: `/api/admin/**` — always behind `ADMIN` role check
- Auth API: `/api/auth/**` — managed by NextAuth; never add custom handlers inside this namespace

---

## Commit Discipline

- One concern per commit — do not mix feature work with refactors
- Format: `type: description` where type is `feat | fix | chore | docs | refactor | test`
- Never commit `.env`, `.env.local`, or secrets
- Never commit generated files (`*.freezed.dart`, `*.g.dart`) — they don't exist in this project
