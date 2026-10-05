# Modernization & Redesign Blueprint

---

## Architectural Enhancements in the New App

1. **Next.js App Router + React 19:**
   - Replace server-rendered Blade/Bootstrap templates with client-side reactive components, instant search, and optimistic UI updates.
2. **Row-Level Security (RLS) as Single Source of Truth:**
   - Every single SQL table enforces `org_id = public.current_org_id()` (a session variable set by Fastify from the verified JWT) to ensure 100% tenant isolation at the database layer.
3. **Self-Hosted Filesystem Storage, Authenticated Access:**
   - Migrate document uploads from legacy disk paths to `UPLOAD_DIR` on the VPS filesystem, with metadata tracked in the `attachments`/`documents` tables and every download gated by an authenticated backend route — no public or signed URLs.
4. **Modern UI & Design System:**
   - Clean, professional dark/light theme tokens, Framer Motion micro-animations, Lucide React icons, and accessible Radix UI primitives.
5. **Type Safety & Shared Validation:**
   - Zod schemas shared between frontend forms (React Hook Form) and Fastify backend endpoints.
