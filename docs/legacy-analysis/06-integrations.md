# System Integrations & External Services

| Service / Dependency | Category | Observed In | Purpose in Legacy App | Status in Modern Stack |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase Postgres + RLS** | Database & Tenancy | Core Data Layer | Tenant data isolation | **Primary Target** (PostgreSQL with RLS) |
| **Supabase Storage** | Document Storage | `/documents` | Secure PDF & image storage | **Primary Target** (Signed URLs only) |
| **Supabase Auth** | Authentication | `/login`, `/register` | JWTs carrying `org_id` + `role` | **Primary Target** (JWT custom hook) |
| **Bootstrap 5 + Alpine.js** | Frontend UI Framework | All legacy screens | Legacy client-side templates | **Replaced** by Next.js + React 19 + Tailwind + shadcn/ui |
| **Cron Email Dispatcher** | Notification Service | `/settings/templates` | Expiry warnings & leave updates | **Modernized** via Fastify cron / background queues |
| **CSV / XLSX Parser** | Data Import / Export | `/employees/import-export` | Batch employee roster import | **Preserved** with Zod schema validation |
