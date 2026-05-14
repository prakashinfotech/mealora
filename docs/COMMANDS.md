# COMMANDS.md — Development Command Reference

## Next.js (run from project root)

```bash
npm run dev          # start dev server → http://localhost:3000
npm run build        # production build (tsc + Next.js compiler)
npm run lint         # ESLint across src/ shared/ server/
npm start            # serve production build (after npm run build)
```

## Database (Prisma)

```bash
npm run db:migrate   # prisma migrate dev — apply pending migrations + generate client
npm run db:seed      # tsx prisma/seed/index.ts — upsert demo user, restaurants, coupons
npm run db:studio    # open Prisma Studio GUI → http://localhost:5555
npx prisma generate  # regenerate Prisma client after schema change (no migration)
npx prisma migrate reset   # drop + re-apply all migrations + reseed (dev only)
npx prisma db push   # push schema to DB without migration file (prototyping only)
```

> **Two env files required:** `.env` (Prisma CLI reads `DATABASE_URL`) and `.env.local` (Next.js runtime reads all vars).

## Flutter Mobile (run from `mobile/`)

```bash
cd mobile
flutter pub get              # install dependencies
flutter run                  # build + launch on connected device/simulator
flutter run --release        # release build
flutter build ios            # production iOS build
flutter build apk            # production Android APK
flutter clean                # clear build cache (use when switching branches)
flutter analyze              # static analysis (no build_runner in this project)
```

> No `build_runner` — all models are plain Dart. Never add codegen packages without checking `analyzer` compatibility.

## Git Workflow

```bash
# Branch naming
git checkout -b feature/<scope>          # new feature
git checkout -b fix/<scope>              # bug fix
git checkout -b chore/<scope>            # tooling, deps, config

# Commit format
git commit -m "feat: <what and why>"
git commit -m "fix: <what broke and why>"
git commit -m "chore: <tooling change>"
git commit -m "docs: <what was documented>"
```

## Recommended Workflows

### Add a new feature (full stack)

```bash
# 1. Schema change
# edit prisma/schema.prisma
npm run db:migrate            # creates migration + regenerates client

# 2. Add shared types
# edit shared/interfaces/index.ts + shared/schemas/index.ts

# 3. Implement backend
# server/repositories/<entity>.repository.ts
# server/services/<entity>.service.ts
# server/validators/<entity>.validator.ts
# src/app/api/<resource>/route.ts

# 4. Implement frontend
# src/components/<feature>/ + src/app/<route>/page.tsx

# 5. Verify
npm run build                 # catches type errors + missing imports
npm run lint
```

### Reset local database

```bash
npx prisma migrate reset      # drops DB, re-applies migrations, re-seeds
```

### Check what Prisma sees

```bash
npx prisma validate           # validates schema.prisma syntax
npx prisma format             # auto-formats schema.prisma
```

## Troubleshooting

| Symptom | Command |
|---|---|
| Prisma client out of sync | `npx prisma generate` |
| Type errors after schema change | `npm run db:migrate` (regenerates client) |
| Flutter hot reload missed a const | Stop app → `flutter run` (compile-time consts need full rebuild) |
| Flutter iOS ATS error | Check `mobile/ios/Runner/Info.plist` + full rebuild |
| Flutter "no supported devices" | `flutter devices` to confirm simulator is running |
| Stale Next.js cache | `rm -rf .next && npm run dev` |
