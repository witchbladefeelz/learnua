# UAlearn — Agent Handbook

This document is a high-signal briefing for Codex-style agents working in the UAlearn repository. Use it as the single source of truth about the codebase layout, dependencies, workflows, and expectations when modifying the project.

## 1. Project Mission & Tech Stack
- **Purpose:** A Ukrainian language learning platform combining a NestJS REST API, a React/Tailwind frontend, and a PostgreSQL database managed with Prisma.
- **Primary languages:** TypeScript (backend & frontend), SQL (Prisma schema), Bash (tooling), YAML (CI/docker), JSON (configuration).
- **Runtime targets:** Node.js 18+, Docker Desktop/Engine, modern browsers for the SPA.

## 2. Repository Topography
- `backend/` — NestJS monolith with feature modules for auth, lessons, progress tracking, achievements, admin tools, email, and Prisma-backed persistence.
- `frontend/` — React 18 CRA application with routing, contexts for auth/language, Tailwind styling, and API integrations.
- `docker-compose.yml` — Development stack orchestrating Postgres, backend, and frontend containers with hot-reload volumes.
- `run-app.sh` — Bash helper to spin up either backend or frontend locally, auto-provisioning Postgres + Prisma client generation for the API.
- `dev-setup.sh` / `start.sh` — Bootstrap scripts for installing dependencies, preparing env files, seeding data, or starting dockerized services.
- `package-lock.json` (root) — Aggregated lock file to keep backend/frontend dependency trees in sync when installing from the repo root.
- `agent.md` — Legacy summary (superseded by this file but still informative).

### Backend structure (`backend/src`)
```
achievements/    # Achievement unlock logic, service & controller
admin/           # Admin-only endpoints for user moderation
app.module.ts    # Root module wiring feature modules and Prisma
auth/            # Local + JWT auth strategies, guards, controllers
database/        # PrismaService wrapper + database module
email/           # Nodemailer transport configuration & service
lessons/         # Lessons + exercises retrieval/completion APIs
main.ts          # Application bootstrap with Swagger + validation
progress/        # Daily stats, streaks, XP aggregation endpoints
users/           # Profile CRUD, avatar upload, leaderboard, XP
```
Support directories:
- `prisma/` — `schema.prisma`, migrations (if added), seed script.
- `scripts/` — Utility TS scripts (`delete-non-admin.ts` etc.).
- `uploads/` — Avatar storage (mounted volume in Docker).
- `docker-entrypoint.sh` — Container start script that waits for Postgres and syncs Prisma schema.

### Frontend structure (`frontend/src`)
```
App.tsx          # Root component with routing + layout shells
components/      # UI building blocks (forms, modals, nav, etc.)
contexts/        # AuthContext, LanguageContext, Theme toggles
pages/           # Dashboard, Lessons, Leaderboard, Profile, Admin
services/        # Axios API wrapper + typed request helpers
i18n/            # Locale bundles (en/uk) used via contexts
index.tsx/css    # CRA bootstrap + Tailwind/global styles
types/           # Shared TS interfaces matching backend DTOs
```
`public/` hosts CRA static assets (favicon, manifest, PWA service worker).

## 3. Dependencies & Tooling
### Backend key packages
- NestJS core (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`).
- Auth stack: `@nestjs/passport`, `passport`, `passport-local`, `passport-jwt`, `@nestjs/jwt`, `bcryptjs`.
- Validation/serialization: `class-validator`, `class-transformer`.
- Persistence: `@prisma/client` with `prisma` CLI for migrations/seeding.
- Email: `nodemailer`.
- Observability: `rxjs` streams inside services.
- Dev/test: `jest`, `ts-jest`, `supertest`, `eslint`, `prettier`, Nest CLI.

### Frontend key packages
- React ecosystem (`react`, `react-dom`, `react-router-dom`, CRA toolchain).
- UI tooling: `@headlessui/react`, `@heroicons/react`, `react-hot-toast`.
- Styling: `tailwindcss`, `@tailwindcss/forms`, `postcss`, `autoprefixer`.
- HTTP client: `axios` with a central API service.
- Validation helpers: `ajv` for JSON schema validation where required.

### Cross-cutting tooling
- Docker images (`node:18`, `postgres:15`) used in `docker-compose.yml` and Dockerfiles.
- Bash scripts assume Unix shell (use Git Bash or WSL on Windows).
- Environment management relies on `.env` files inside `backend/`, `frontend/`, and repo root for Docker Compose.

## 4. Environment Configuration
1. Copy `backend/env.example` ➜ `backend/.env`; configure `DATABASE_URL`, JWT secret, frontend URL, optional SMTP credentials, `EMAIL_VERIFICATION_ENABLED` toggle, and `ADMIN_EMAIL` for maintenance scripts.
2. Copy `frontend/env.example` ➜ `frontend/.env`; set `REACT_APP_API_URL` (defaults to `http://localhost:3001`). CRA exposes only `REACT_APP_*` variables.
3. If using Docker Compose, copy `.env.example` (if present) ➜ `.env` in repo root or create one with shared variables (Postgres credentials, API URL overrides). Compose injects these into all services.
4. Prisma expects PostgreSQL with TLS disabled locally; adjust `DATABASE_URL` when deploying to production or using managed instances.

## 5. Common Workflows
### Local development (without Docker)
- **Backend:**
  1. Ensure PostgreSQL is running (manually or via `run-app.sh backend`).
  2. `cd backend && npm install` (once) then `npm run prisma:generate && npm run prisma:push`.
  3. Seed data with `npm run db:seed` if needed.
  4. Start dev server: `npm run start:dev` (Nest hot reload).
- **Frontend:**
  1. `cd frontend && npm install`.
  2. Start CRA dev server: `npm start` (runs on port 3000, proxies API to 3001).
- **Helper script:** `./run-app.sh backend` auto-handles env, dependencies, Postgres container, and Prisma sync; run in one terminal for API and `./run-app.sh frontend` in another for the SPA.

### Docker-first workflow
1. Copy `.env` files (backend/frontend/root).
2. `docker compose up --build` — builds backend & frontend images, starts Postgres, exposes ports 3000/3001/5432, and mounts local source for live reload.
3. Stop the stack with `docker compose down`; add `-v` to drop volumes (will reset database/uploads).
4. Backend container entrypoint waits for Postgres (`pg_isready`), runs `prisma db push`, then executes `npm run start:dev`. Frontend container executes `npm start` with polling enabled for reliable file watching on mounted volumes.

### Database maintenance
- Prisma schema lives in `backend/prisma/schema.prisma`; regenerate client after schema edits (`npm run prisma:generate`).
- Use `npm run prisma:migrate` to create dev migrations; `prisma db push` is used during local iteration & containers for schema sync without migrations.
- Seed script `prisma/seed.ts` populates baseline achievements, lessons, and exercises. Trigger via `npm run db:seed`.
- Utility script `scripts/delete-non-admin.ts` removes all users except the configured admin (requires `ADMIN_EMAIL` in env).

## 6. Testing & Quality Gates
- **Backend:** Run `npm test` for unit tests, `npm run test:e2e` for integration (requires running Postgres). Lint with `npm run lint`; format with `npm run format` (Prettier).
- **Frontend:** CRA tests via `npm test`. Tailwind/ESLint uses CRA defaults (no extra lint script). Consider `npm run build` to ensure TypeScript compilation passes.
- **Repository expectations:** When you modify backend logic, run backend tests and lint. For frontend changes, run `npm test` and `npm run build`. Mention executed commands in task summaries.

## 7. Coding Conventions
- Backend: Follow NestJS standards (controllers in `*.controller.ts`, services in `*.service.ts`, DTOs with `class-validator` decorators). Keep DTOs in `dto/` subfolders inside each module. Use dependency injection instead of direct imports where possible.
- Frontend: Stick to function components with hooks. Keep reusable UI in `components/`, route-level logic in `pages/`. Manage auth state through `AuthContext`; API calls via `services/api.ts` to preserve interceptors. Tailwind utility classes are the default styling approach; avoid inline styles unless necessary.
- Internationalization: Strings should go through the locale dictionaries in `i18n/locales`. Add keys for both `en` and `uk` when expanding text content.
- File naming: TypeScript files use camelCase/pascalCase depending on export (components PascalCase, hooks camelCase).

## 8. Platform Notes (Windows, macOS, Linux)
- The project is cross-platform. On Windows, prefer **WSL2** or Git Bash for Bash scripts and consistent file watching. Docker Desktop with WSL2 integration is the recommended setup.
- If running everything natively on Windows, ensure PostgreSQL is installed or rely on Docker containers started via `run-app.sh`/`docker compose`.
- File watchers inside Docker require `CHOKIDAR_USEPOLLING=true` (already set in Compose). Avoid using network drives for the repo to prevent watch issues.

## 9. Deployment Guidance (high level)
- Backend Dockerfile builds the NestJS app in production mode (install deps, generate Prisma client, `npm run build`, then `node dist/main`). Modify the entrypoint for production to run migrations (`prisma migrate deploy`) before start.
- Frontend Dockerfile currently runs `npm start` (dev server). For production deploys, create a multi-stage Dockerfile that runs `npm run build` then serves static assets via Nginx or another web server.
- External services (SMTP, object storage for uploads) are optional; default configuration keeps avatars locally.

## 10. How to Work on Tasks
1. **Read instructions** from `AGENT.MD` (this file) and any nested `AGENTS.md` once they appear in subdirectories.
2. **Plan your changes**: identify affected modules, update DTOs/interfaces on both backend and frontend where needed.
3. **Modify code** adhering to conventions above. Keep TypeScript strictness in mind (enable types where possible).
4. **Update documentation & env samples** if you add new variables or scripts.
5. **Run relevant tests/lints** before committing; include the commands and outcomes in your task report.
6. **Keep the workspace clean**: no stray debug logs, respect `.gitignore`, and ensure `git status` is clean prior to handing back control.

## 11. Quick Reference Commands
- Backend: `npm run start:dev`, `npm run lint`, `npm run test`, `npm run prisma:generate`, `npm run prisma:migrate`, `npm run db:seed`.
- Frontend: `npm start`, `npm test`, `npm run build`.
- Docker: `docker compose up --build`, `docker compose down`, `docker compose down -v`.
- Tooling: `./run-app.sh backend`, `./run-app.sh frontend`, `./dev-setup.sh` (initial bootstrap).

Stay consistent, keep the API contracts mirrored between backend DTOs and frontend types, and document any new flows inside this handbook for future agents.
