# System Integrations & External Services

| Service / Dependency | Category | Observed In | Purpose in Legacy App | Status in Modern Stack |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL 16 + RLS** | Database & Tenancy | Core Data Layer | Tenant data isolation | **Replaced Supabase** with self-hosted Postgres + RLS |
| **Local Filesystem + Attachments** | Document Storage | `/documents` | Secure PDF & image storage | **Replaced Supabase Storage** with VPS filesystem + `attachments` table |
| **NextAuth v5 + Fastify JWT** | Authentication | `/login`, `/register` | JWTs carrying `org_id` + `role` | **Replaced Supabase Auth** with NextAuth / JWT |
| **Bootstrap 5 + Alpine.js** | Frontend UI Framework | All legacy screens | Legacy client-side templates | **Replaced** by Next.js + React 19 + Tailwind + shadcn/ui |
| **Cron Email Dispatcher** | Notification Service | `/settings/templates` | Expiry warnings & leave updates | **Modernized** via Fastify cron / background queues |
| **CSV / XLSX Parser** | Data Import / Export | `/employees/import-export` | Batch employee roster import | **Preserved** with Zod schema validation |
