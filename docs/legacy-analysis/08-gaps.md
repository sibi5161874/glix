# Gap Analysis: Legacy Limitations vs. Modern Target

| # | Domain | Legacy App Limitation | Modern Target Specification |
| :--- | :--- | :--- | :--- |
| **G-01** | Architecture | Monolithic server templates with full-page reloads on every navigation. | Next.js 16 App Router SPA experience with client caching & instant transitions. |
| **G-02** | Security & RLS | Tenant separation enforced solely at PHP/ORM layer. | PostgreSQL Row-Level Security (RLS) on 100% of tables with Supabase Auth JWT custom claims. |
| **G-03** | Document Storage | Local webserver disk storage without signed expiry URLs. | Private Supabase S3 Storage with signed expiring URLs (5 min validity) and virus scanning. |
| **G-04** | Form Validation | Basic client-side JavaScript alerts with unformatted errors. | React Hook Form + Zod schema validation with inline visual error feedback. |
| **G-05** | Real-time Updates | Polling or page refreshes required to see leave approval or document expiry status. | Supabase Realtime WebSocket subscriptions for immediate UI badge updates. |
| **G-06** | Mobile Experience | Desktop-first table layouts requiring horizontal scrolling. | Responsive Tailwind design system with dedicated mobile card views and swipe actions. |
