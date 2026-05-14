# AGENTS.md — AI Collaboration & Agent Responsibilities

## Philosophy

Each AI session is treated as a specialized agent operating within defined boundaries. Agents share a common constraint: **read RULES.md before writing any code**. Architecture decisions follow the layer policy in ARCHITECTURE.md. Constants, types, and schemas are never duplicated.

---

## Agent Roster

### Architecture Agent
**Trigger:** schema changes, new entities, cross-layer decisions, performance concerns

| | |
|---|---|
| **Can modify** | `prisma/schema.prisma`, `shared/interfaces`, `shared/constants`, `shared/schemas`, `ARCHITECTURE.md` |
| **Cannot modify** | UI components, Flutter widgets, API route handlers |
| **Must verify** | No circular imports; all new entities have repository + service + validator |
| **Output** | Migration file, updated interfaces, updated Zod schemas, ARCHITECTURE.md diff |

---

### Backend Agent
**Trigger:** new API endpoints, service logic, repository queries, payment/coupon flows

| | |
|---|---|
| **Can modify** | `server/repositories/`, `server/services/`, `server/validators/`, `src/app/api/` |
| **Cannot modify** | `src/components/`, Prisma schema (propose to Architecture Agent) |
| **Must verify** | Service handles recompute (never trust client amounts); `withAuth` on mutations; ZodError → 422 |
| **Output** | Repository method + service method + validator + route handler, all typed |

---

### Frontend Agent
**Trigger:** new pages, UI components, Zustand store changes, loading/error states

| | |
|---|---|
| **Can modify** | `src/app/`, `src/components/`, `src/store/`, `src/lib/` |
| **Cannot modify** | `server/`, `shared/` directly (import via `@/lib/utils` or `@/types`) |
| **Must verify** | No `'use client'` on data-only pages; `_hasHydrated` guard for city/cart; design tokens only |
| **Output** | Server or client component with matching `loading.tsx` skeleton |

---

### Admin Panel Agent
**Trigger:** admin CRUD features, role-gated views, dashboard metrics

| | |
|---|---|
| **Can modify** | `src/app/admin/`, `src/components/admin/`, `/api/admin/` routes |
| **Cannot modify** | Public API routes, customer-facing components |
| **Must verify** | `ADMIN` role check present at both middleware and service layer; admin APIs under `/api/admin/` namespace |
| **Output** | Admin page + API route + optional service method |

---

### Flutter Agent
**Trigger:** mobile screens, Riverpod providers, API integration, navigation changes

| | |
|---|---|
| **Can modify** | `mobile/lib/` |
| **Cannot modify** | Web `src/`, shared backend layer |
| **Must verify** | No codegen packages; stable `GoRouter` with `refreshListenable`; plain Dart models; full `flutter run` after const changes |
| **Output** | Feature screen + provider + repository method + model |

---

### Refactoring Agent
**Trigger:** deduplication, layer violations found, component extraction requests

| | |
|---|---|
| **Can modify** | Any file — but must not change observable behaviour |
| **Cannot modify** | Shared contracts without Architecture Agent review |
| **Must verify** | No new imports that violate layer rules; existing tests/types still pass; `npm run build` green |
| **Output** | Refactored files with no new functionality |

---

### QA Agent
**Trigger:** pre-merge review, edge case analysis, error handling audit

| | |
|---|---|
| **Can modify** | Test files only |
| **Cannot modify** | Source files |
| **Must verify** | Server amounts recomputed; auth guards present; ZodError shape correct; no hardcoded secrets |
| **Output** | Bug report list or test coverage additions |

---

### Documentation Agent
**Trigger:** new feature shipped, architecture changes, onboarding updates

| | |
|---|---|
| **Can modify** | `*.md` files, inline comments where WHY is non-obvious |
| **Cannot modify** | Source code |
| **Output** | Updated `PROJECT_PROGRESS.md`, `ARCHITECTURE.md`, or `CLAUDE.md` |

---

## AI Collaboration Workflow

```
User request
    │
    ▼
Identify agent scope (which layer?)
    │
    ├─ Schema / cross-layer ──────→ Architecture Agent
    ├─ API / service / repo ──────→ Backend Agent
    ├─ UI / store / page ─────────→ Frontend Agent
    ├─ Admin panel ───────────────→ Admin Panel Agent
    ├─ Mobile ────────────────────→ Flutter Agent
    └─ Cleanup / audit ───────────→ Refactoring / QA Agent
    │
    ▼
Read: RULES.md + relevant section of ARCHITECTURE.md
    │
    ▼
Implement within boundary → verify build → output
```

---

## Phased Implementation Reference

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundation — scaffold, DB, auth, shared layer | ✅ Done |
| 2 | Restaurant listing + detail, menu display | ✅ Done |
| 3 | Cart (Zustand), checkout page | ✅ Done |
| 4 | Orders — creation, history, detail, tracking | ✅ Done |
| 5 | Payments — Razorpay integration, COD | ✅ Done |
| 6 | Admin panel — restaurants, menu, orders, coupons, users | ✅ Done |
| 7 | Flutter mobile — auth, restaurants, navigation | 🔄 In progress |
| 8 | Flutter mobile — cart, checkout, orders | ⬜ Planned |

---

## Prompt Engineering Conventions

- Always reference the specific file path and line range when reporting a bug
- State which agent scope applies before proposing a change
- When modifying shared contracts (`shared/`), list every file that imports them
- For Flutter changes: distinguish hot-reload-safe changes from changes that need `flutter run`
- Never propose a fix that bypasses a rule — propose a rule-compliant alternative instead
