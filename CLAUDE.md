# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root (monorepo)
```bash
npm run dev              # Start all services concurrently
npm run dev:gateway      # API Gateway (port 3000)
npm run dev:user         # User Service (port 3001)
npm run dev:book         # Book Authoring Service (port 3002)
npm run dev:ai           # AI Orchestrator Service (port 3003)
npm run dev:safety       # Safety Service (port 3004)
npm run dev:publishing   # Publishing Service (port 3005)
npm run dev:payment      # Payment Service (port 3006)
npm run dev:notification # Notification Service (port 3007)
npm run dev:admin        # Admin Service (port 3008)
npm run build            # Build all packages/services
npm test                 # Run tests
```

### Database (from root or packages/database)
```bash
npm run db:migrate       # Run Prisma migrations
npm run db:seed          # Seed database with default data
npm run db:studio        # Open Prisma Studio
```

### Frontend (from mybackend-frontend/)
```bash
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Production build
npm run lint             # ESLint
```

### Individual service
```bash
# From any service directory (e.g., services/user-service)
npm run dev              # ts-node-dev with transpile-only
npm run build            # tsc compile to dist/
npm start                # Run compiled dist/index.js
```

## Architecture

### Overview
BriBooks is a children's book authoring platform with a Node.js/TypeScript microservices backend and a React/Vite frontend. All client traffic flows through the API Gateway.

### Request Flow
```
Frontend (port 5173) → API Gateway (port 3000) → Individual Services (ports 3001–3008)
```

The API gateway (`services/api-gateway/`) uses `http-proxy-middleware` to route by path prefix:
- `/api/auth`, `/api/users` → user-service:3001
- `/api/books`, `/api/chapters` → book-authoring-service:3002
- `/api/ai` → ai-orchestrator-service:3003
- `/api/safety` → safety-service:3004
- `/api/publishing` → publishing-service:3005
- `/api/notifications` → notification-service:3007
- `/api/admin` → admin-service:3008
- `/api/payments` → payment-service:3006

### Shared Packages
- **`@bribooks/database`** (`packages/database/`): Prisma client singleton + schema. All services that need DB access import from here. Schema and migrations are centralized in `packages/database/prisma/`.
- **`@bribooks/shared`** (`packages/shared/`): Auth middleware (JWT), error handler, validation middleware (Zod), Winston logger, and shared TypeScript types. Imported by services via the `@bribooks/shared` path alias.

### TypeScript Path Aliases (root tsconfig.json)
```
@bribooks/shared  → ./packages/shared/src
@bribooks/database → ./packages/database/src
```

### Frontend Architecture
React 19 + Vite app in `mybackend-frontend/`:
- **`src/context/AuthContext.tsx`**: JWT auth state, login/logout, persisted in localStorage
- **`src/services/api/`**: Axios-based service modules per domain (books, AI, etc.)
- **`src/pages/`**: Route-level page components (Dashboard, BookEditor, BookOnboardingWizard, etc.)
- **`src/components/`**: Shared UI components including wizard steps (`components/wizard/`)
- **`src/hooks/`**: Custom React hooks
- All API calls go to the gateway at `http://localhost:3000`

### AI Integration
`services/ai-orchestrator-service/` uses `@google/generative-ai` (Gemini). Prompt templates are in a `prompts/` subdirectory within the service.

### Authentication
JWT-based auth: tokens are issued by user-service, verified by `@bribooks/shared` auth middleware. Services call the shared middleware directly (no inter-service auth calls for token validation).

### Database
PostgreSQL via Neon (cloud-hosted). Prisma ORM with a single schema in `packages/database/prisma/schema.prisma`. The `docker-compose.yml` provides a local PostgreSQL alternative on port 5432.

### Default Seed Users
- `admin@bribooks.com` / `Admin@123`
- `author@bribooks.com` / `Author@123`
