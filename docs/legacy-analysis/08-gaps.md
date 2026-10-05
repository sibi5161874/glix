# Gap Analysis: Legacy Limitations vs. Modern Target

| # | Domain | Legacy App Limitation | Modern Target Specification |
| :--- | :--- | :--- | :--- |
| **G-01** | Architecture | Monolithic server templates with full-page reloads on every navigation. | Next.js 15 App Router SPA experience with client caching & instant transitions. |
| **G-02** | Security & RLS | Tenant separation enforced solely at PHP/ORM layer. | PostgreSQL Row-Level Security (RLS) on 100% of tables, driven by session variables (`app.org_id`, etc.) set by Fastify from a verified JWT. |
| **G-03** | Document Storage | Local webserver disk storage without expiry tracking or access control. | Self-hosted PostgreSQL 16 + VPS filesystem (`UPLOAD_DIR`), with authenticated backend routes gating every download — no public URLs. |
| **G-04** | Form Validation | Basic client-side JavaScript alerts with unformatted errors. | React Hook Form + Zod schema validation with inline visual error feedback. |
| **G-05** | Real-time Updates | Polling or page refreshes required to see leave approval or document expiry status. | Deferred — not in the locked stack yet; revisit if a realtime channel (e.g. SSE/WebSocket) is approved. |
| **G-06** | Mobile Experience | Desktop-first table layouts requiring horizontal scrolling. | Responsive Tailwind design system with dedicated mobile card views and swipe actions. |
