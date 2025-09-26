# UAlearn Agent Guide

## Overview
- Ukrainian language learning platform with NestJS API, React/Tailwind frontend, and PostgreSQL via Prisma.
- Supports registration/login, lessons with exercises, XP/streak tracking, achievements, and admin management tools.
- Local workflows rely on Node.js 18+, Docker (optional but recommended), and npm.

## Repository Layout
- `backend/` — NestJS monolith (`src/app.module.ts`) with modules for auth, users, lessons, progress, achievements, admin, email, and Prisma integration. Contains Prisma schema/seeds and upload directory for avatar files.
- `frontend/` — React 18 + TypeScript app (CRA) with contexts for auth/language, Tailwind styling, and pages for dashboard, lessons, admin, etc.
- `docker-compose.yml` — Development stack: Postgres 15, backend, frontend with shared bridge network and bind-mounted workdirs.
- `run-app.sh` — Convenience launcher for backend or frontend with Dockerized Postgres bootstrap and Prisma sync (`backend/run-app.sh`).
- `start.sh` / `dev-setup.sh` — Helpers to bootstrap Docker services or install dependencies + seed data locally.

## Backend (NestJS)
- Entry point: `backend/src/main.ts` bootstraps NestFactory with global validation pipes and Swagger at `/api`.
- Modules:
  - `auth/` — JWT-based auth, password hashing via `bcryptjs`, optional email verification flow (disabled by default via `AuthService.isVerificationEnabled()`; toggle with `EMAIL_VERIFICATION_ENABLED=true`).
  - `users/` — CRUD, profile updates, avatar upload handling (stored in `backend/uploads`). Leaderboard and public profile endpoints.
  - `lessons/` — Lesson catalog, exercise retrieval, lesson completion tracking, and XP increment logic.
  - `progress/` — Aggregates daily stats, streak calculations, XP breakdown.
  - `achievements/` — Unlock logic for milestones (lessons completed, streak length, level) with XP rewards when applicable.
  - `admin/` — Admin-protected endpoints for user moderation (`/admin/users`).
  - `email/` — Nodemailer transport configured via SMTP env vars for verification emails.
  - `database/` — `PrismaService` wrapper (`backend/src/database/prisma.service.ts`) handling connection lifecycle and logging.
- Scripts & tooling:
  - `npm run start:dev` — Watch mode via Nest CLI.
  - `npm run prisma:migrate` / `prisma:push` / `prisma:studio` for schema management.
  - `npm run db:seed` executes `prisma/seed.ts` (achievements + sample lessons/exercises).
  - `scripts/delete-non-admin.ts` removes all users except `ADMIN_EMAIL` (set in env).
- Key dependencies: `@nestjs/*`, `@prisma/client`, `class-validator`, `passport`, `@nestjs/jwt`, `nodemailer`, and associated dev tooling (`eslint`, `jest`, `prisma`).

## Database & Prisma
- Schema defined in `backend/prisma/schema.prisma` with models for `User`, `Lesson`, `Exercise`, `Progress`, `CompletedLesson`, `Achievement`, `UserAchievement`, `EmailVerificationToken` plus enums for `Level`, `Category`, `ExerciseType`, `UserRole`.
- Default `DATABASE_URL`: `postgresql://postgres:postgres@localhost:5432/ukrainian_app` (override for Docker via service name `postgres`).
- `docker-entrypoint.sh` runs `prisma db push` with retry loop before starting backend to ensure schema sync in containers.

## Frontend (React + Tailwind)
- CRA-based app with TypeScript (`frontend/src/App.tsx`). Uses `AuthContext` for auth state and `LanguageContext` for toggling locales (`i18n/locales/{en,uk}.ts`).
- Routing via `react-router-dom` with guarded routes (`components/auth/ProtectedRoute` & `AdminRoute`). Pages include home, dashboard, lesson catalog/detail, leaderboard, profile editing, admin dashboard, and auth flows (login/register/verify email).
- API layer: `frontend/src/services/api.ts` wraps Axios with auth interceptors, typed helpers for auth, users, lessons, progress, achievements, admin endpoints.
- Styling: Tailwind (`tailwind.config.js`, `index.css`) plus Headless UI & Heroicons for components.
- PWA assets in `public/` (manifest, icons, `sw.js`).

## Environment Configuration
- Copy `backend/env.example` → `.env`; specify `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, SMTP settings, admin email, and toggle verification via `EMAIL_VERIFICATION_ENABLED`.
- Copy `frontend/env.example` → `.env`; set `REACT_APP_API_URL` (e.g., `http://localhost:3001`). CRA exposes variables prefixed with `REACT_APP_`.
- Root `.env` consumed by Docker Compose for cross-service variables.

## Development Workflow
1. **One-time setup**: run `./dev-setup.sh` (installs deps, prepares env files, syncs Prisma, seeds DB). Requires Docker for Postgres step.
2. **Manual start**:
   - Backend: `cd backend && npm run start:dev` (ensure Postgres + Prisma schema via `run-app.sh` helper or manual `npx prisma db push`).
   - Frontend: `cd frontend && npm start` (proxied to backend via CRA dev server).
3. **Combined helper**: `./run-app.sh backend` (spins Postgres container `ualearn_db`, generates Prisma client, `db push`, runs Nest). Run frontend in separate terminal with `./run-app.sh frontend`.

## Docker & Deployment
- `docker-compose.yml` orchestrates Postgres + backend + frontend in dev; backend/frontend containers mount local source for live reload and run `npm install` on start.
- Backend Dockerfile (`backend/Dockerfile`): Node 18 slim, installs OpenSSL, `npm ci --include=dev`, generates Prisma client, builds Nest app, entrypoint handles Prisma sync.
- Frontend Dockerfile (`frontend/Dockerfile`): Node 18 alpine, `npm ci`, runs `npm start` (dev server). For production, adjust to build static assets and serve via nginx.
- Use `docker compose up --build` after copying `.env` to run full stack; `docker compose down` to stop (volumes: Postgres data, node_modules, uploads).

## Testing & Quality
- Backend: Jest configured (`package.json#jest`). Run `npm test`, `npm run test:watch`, `npm run test:cov`, `npm run test:e2e`.
- Frontend: CRA testing (`npm test`). No custom test suites checked in yet.
- Linting/formatting: backend `npm run lint`, `npm run format`; frontend uses CRA lint defaults.

## Data & Seeding Notes
- Default seed creates two achievements (`First Steps`, `Bookworm`) and sample A1 lessons/exercises (greetings & food) (`backend/prisma/seed.ts`). Extend as needed.
- Achievements service auto-unlocks badges based on lesson completions, streaks, and level, awarding XP via `UsersService.updateXP`.
- Email verification tokens stored in `email_verification_tokens`; flow disabled unless `EMAIL_VERIFICATION_ENABLED=true`.

## Operational Tips
- Avatar uploads stored in `backend/uploads`; ensure volume persistence in Docker (`backend_uploads`).
- Admin-only endpoints guarded in backend and via `AdminRoute` in frontend; set `role` to `ADMIN` manually via Prisma or SQL when needed.
- For cleaning test data, use `scripts/delete-non-admin.ts` with `ts-node` (ensure `ADMIN_EMAIL` is set).
- Keep Prisma schema and generated client in sync after any model change: `npm run prisma:generate` + migrations.
