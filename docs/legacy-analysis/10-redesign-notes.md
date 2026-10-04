# Modernization & Redesign Blueprint

---

## Architectural Enhancements in the New App

1. **Next.js App Router + React 19:**
   - Replace server-rendered Blade/Bootstrap templates with client-side reactive components, instant search, and optimistic UI updates.
2. **Row-Level Security (RLS) as Single Source of Truth:**
   - Every single SQL table enforces `org_id = (auth.jwt() ->> 'org_id')::uuid` to ensure 100% tenant isolation at the database layer.
3. **Supabase Storage with Signed URLs:**
   - Migrate document uploads from direct file paths to S3-compatible private Supabase storage buckets with time-limited signed download URLs.
4. **Modern UI & Design System:**
   - Clean, professional dark/light theme tokens, Framer Motion micro-animations, Lucide React icons, and accessible Radix UI primitives.
5. **Type Safety & Shared Validation:**
   - Zod schemas shared between frontend forms (React Hook Form) and Fastify backend endpoints.
