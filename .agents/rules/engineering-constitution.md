# 🌐 GLOBAL ENGINEERING CONSTITUTION
## Code Optimization & Engineering Excellence Standard
### Version 1.0 · Universal · Authoritative

> **Scope:** This document is a **technology-agnostic, project-agnostic** engineering constitution. It defines the universal laws of clean, performant, maintainable, and optimized software — applicable to any stack, any team size, any company, any AI assistant.

---

## ⭐ THE GOLDEN RULE

> **This ruleset is CLOSED and COMPLETE.**
>
> No pattern, dependency, abstraction, or approach that is not explicitly sanctioned by the project's *local* engineering charter may be introduced — by any human or AI.
>
> This global constitution defines the **non-negotiable baseline**. Each project may *extend* it (with written approval) but may **never weaken it**.
>
> If something new is needed:
> 1. Discuss with the tech lead / architect.
> 2. Get explicit written approval.
> 3. Update the local charter **first**.
> 4. Only then does it enter the codebase.
>
> **AI assistants must NEVER introduce a library, pattern, or shortcut absent from the charter — even if it "works."**

---

## 0 · CORE PHILOSOPHY

| Principle | Meaning |
|---|---|
| **Optimize for the reader** | Code is read 10× more than written. Clarity > cleverness. |
| **Measure before optimizing** | Never guess at performance. Profile → identify → fix → verify. |
| **Optimize the whole path** | A fast function inside a slow pipeline is still slow. |
| **Delete before adding** | The fastest code is code that doesn't exist. |
| **Reuse before rewrite** | Search the codebase first — the solution likely exists. |
| **Extend, never fork** | Modify the canonical implementation; never duplicate it. |
| **Fail loudly, recover gracefully** | Errors must be visible to devs, invisible to users. |
| **Ship small, ship often** | Small, focused changes reduce risk and review cost. |

---

## 1 · UNIVERSAL ENGINEERING LAWS

These apply to **every** codebase regardless of language or framework.

### 1.1 — The Four Optimization Axes
Every optimization effort must target one (or more) of these, and must be **measured**:

1. **Time** — CPU cycles, latency, response time, TTI, FCP.
2. **Space** — memory, disk, bundle size, payload size.
3. **I/O** — network round-trips, DB queries, file reads.
4. **Cognitive** — code complexity, readability, maintainability.

> **Rule:** If you cannot name which axis you are optimizing and how you measured it, you are not optimizing — you are guessing.

### 1.2 — The Cost Ladder (prefer top over bottom)

```
1. Don't do it at all        ← best
2. Do it once, cache it
3. Do it at build time
4. Do it on the edge
5. Do it on the server
6. Do it on the client
7. Do it on every render     ← worst
```

### 1.3 — The Three-Strike Rule for Abstraction
Do **not** abstract until the pattern has appeared **at least three times**.
Premature abstraction is as harmful as duplication.

### 1.4 — The Boy-Scout Rule
Leave every file you touch **slightly cleaner** than you found it — but **never** expand scope beyond the task.

### 1.5 — The YAGNI Law
You Aren't Gonna Need It. Build for today's requirement, structured so tomorrow's is not painful.

---

## 2 · READ BEFORE YOU WRITE

**Non-negotiable workflow for every task:**

1. Read **all** related files — entry points, dependencies, consumers, tests.
2. Map the **full data flow**: source → transform → store → render.
3. Search for existing solutions:
   - Query keys / cache keys
   - Service methods / API clients
   - UI primitives / shared components
   - Utilities / helpers
4. If a feature partially exists — **extend it**.
5. If a util exists — **reuse it**.
6. **Never modify a file outside the current task.**

> AI and humans alike must **summarize existing code before proposing changes**.

---

## 3 · PROJECT STRUCTURE PRINCIPLES

*(Language-agnostic — adapt names to your stack.)*

```
src/
├── app/              Entry points, routes, pages
├── components/       UI — reusable, presentation-focused
│   ├── ui/             Primitives (buttons, inputs, modals)
│   └── shared/         Cross-feature composites
├── hooks/            Reusable stateful logic
├── services/         All external I/O (API, DB, storage)
├── context/          Cross-cutting app state providers
├── lib/              Third-party wrappers & singletons
├── types/            Shared type definitions
├── utils/            Pure, stateless helpers
├── config/           Environment, feature flags, constants
└── assets/           Static files
```

### Laws
- **One responsibility per folder.** Components never call APIs directly.
- **One file per concept.** A file exports one primary thing.
- **No new top-level folders** without approval.
- **Feature-first** when scaling beyond ~10 features; **layer-first** otherwise.
- **Co-locate** feature-specific code; **hoist** only when ≥3 features share it.

---

## 4 · IMPORT & DEPENDENCY DISCIPLINE

### 4.1 Import Rules
- Always use **path aliases** (`@/`, `@src/`, etc.) — never deep relative (`../../..`).
- Strict import order:
  1. Language/framework core
  2. Third-party libraries
  3. Internal aliases
  4. Styles (last)
- **Named exports** everywhere. Default exports only for framework-mandated files.
- **Zero unused imports.** They bloat bundles and signal dead code.

### 4.2 Dependency Rules
- **Every dependency is a liability.** Justify each one.
- Prefer **native platform APIs** over libraries (e.g., `fetch` over `axios` if only basic needs; `Intl` over `moment`).
- Prefer **small, focused** libraries over large frameworks for single tasks.
- **Lock versions** in the manifest. No floating `*` or `latest`.
- **Never add a dependency** without: bundle-size check, maintenance-health check, security check, license check.
- **Never duplicate** a library's job (one date lib, one HTTP client, one state lib, one icon set).

### 4.3 Bundle Budget (hard limits)
| Asset type | Budget |
|---|---|
| Initial JS (gzipped) | ≤ 170 KB |
| Any single route's JS | ≤ 250 KB |
| Any single image | ≤ 200 KB (else compress / lazy-load) |
| Any single font family | ≤ 2 weights, subset |

> A PR that pushes past these budgets must justify or revert.

---

## 5 · TYPES & CORRECTNESS

- **Strict mode ON** in every language that supports it (TypeScript `strict`, Python `mypy --strict`, etc.).
- **No escape hatches in production code:** no `any`, no `# type: ignore`, no `@ts-ignore`, no `eval`.
- Escape hatches are permitted **only in tests**, and prefer explicit casts (`as unknown as T`) over blanket suppression.
- **Every exported function has an explicit return type.**
- Use **interfaces** for extendable shapes; **type aliases** for unions/intersections.
- **No duplicated types.** Import the canonical one.
- **Prefer `const`** over `let`; ban `var`.
- **Boolean names** are prefixed: `isLoading`, `hasError`, `canDelete`.

### Correctness Laws
- **Validate at the boundary** — user input, API responses, file reads.
- **Trust internal code.** Do not re-validate what the compiler already guarantees.
- **Model the domain** — don't pass primitives when a domain type fits.
- **Make illegal states unrepresentable** with discriminated unions.

---

## 6 · ASYNC, I/O & CONCURRENCY

### Laws
- **`async/await` only.** No `.then().catch()` chains.
- **Never block the main thread** with synchronous I/O.
- **Parallelize independent I/O** (`Promise.all`, `asyncio.gather`, goroutines) — never serialize what could run together.
- **Cancel what you start.** Use `AbortController` / cancellation tokens.
- **Bound concurrency** — never fire 10 000 requests at once. Use a pool.
- **Timeouts on every network call.** No infinite waits.
- **Retry with exponential backoff + jitter** on transient failures only.
- **Idempotency keys** for any mutating retryable operation.

### Anti-patterns
- ❌ `await` inside a `for` loop over independent items — use `Promise.all`.
- ❌ Fire-and-forget promises without error handling.
- ❌ `setTimeout` for sequencing — use real async coordination.
- ❌ Polling when push/subscription is available.

---

## 7 · DATA ACCESS & CACHING

### 7.1 Server State (when using a query library)
- **All server state flows through one cache layer** (React Query, SWR, Apollo, etc.).
- **Never `useState + useEffect` to fetch data.**
- **Cache keys are centralized** in one registry — never inline.
- **Invalidate precisely** — broad invalidation is a performance bug.
- **`staleTime` and `gcTime` are chosen intentionally** per data type:

| Data type | Typical staleTime |
|---|---|
| Real-time (notifications, presence) | 0 |
| User/auth | 1–5 min |
| Dashboard/analytics | 1–5 min |
| Reference data (countries, tax codes) | 10–60 min |
| Static config | Infinity |

### 7.2 Caching Layers (in order of preference)
1. **Build-time** — precomputed at compile
2. **CDN / edge cache** — immutable assets, long TTL, hashed filenames
3. **Server cache** — Redis/Memcached, per-entity TTL
4. **Client cache** — query library, memoization
5. **Component memo** — `useMemo`/`useCallback`/`memo` — **only when measured**

> **Rule:** Every cache has an explicit **eviction policy**. Unbounded caches are memory leaks.

### 7.3 Database (if applicable)
- **Index every foreign key** and every column used in `WHERE`/`ORDER BY`.
- **N+1 queries are forbidden.** Use joins, `IN`, or batched loaders.
- **Select only needed columns.** Never `SELECT *` in production.
- **Paginate every list** — no unbounded reads.
- **Explain-plan any query on a table > 100 k rows.**
- **Migrations are forward-only** and reversible.

---

## 8 · RENDER & UI PERFORMANCE

*(Applies to React, Vue, Svelte, Solid — adapt naming.)*

- **Server-render by default** when the framework supports it; make client-only components explicit.
- **`"use client"` (or equivalent) is opt-in and justified** — never on wrapper layouts unnecessarily.
- **Memoization is earned, not assumed:**
  - `React.memo` — only after profiling shows wasted renders.
  - `useMemo` — only for expensive computations or referential stability.
  - `useCallback` — only for handlers passed to memoized children.
- **Virtualize long lists** (> 100 rows).
- **Lazy-load heavy, below-the-fold, or conditional UI:** charts, editors, maps, PDFs, video.
- **Debounce user input** (search, resize, scroll) — 150–300 ms typical.
- **Throttle scroll/resize listeners** or use `IntersectionObserver` / `ResizeObserver`.
- **Avoid layout thrash:** read → write → read is forbidden; batch DOM reads/writes.

---

## 9 · CODE STYLE & CLARITY

### Style Laws
- **One component / one class / one module per file.** Filename matches the export.
- **Keep files under 200 lines.** Split when larger.
- **Keep functions under 40 lines.** Extract named helpers.
- **Cyclomatic complexity < 10** per function.
- **No magic numbers** — name them: `const MAX_RETRIES = 3`.
- **No deep nesting** — early returns, guard clauses.
- **No commented-out code** committed. Use version control.
- **No `TODO` comments** committed. Use the issue tracker.
- **No `console.log`** in committed code. Use a logger.
- **JSDoc / docstrings** on every exported function and non-obvious hook.
- **Empty `catch` blocks are forbidden.** Handle, log, or re-throw.
- **Lint with zero warnings.** Warnings are future errors.
- **Format is automated.** No style debates — the formatter decides.

### Naming Conventions
| Kind | Convention | Example |
|---|---|---|
| Components / Classes | PascalCase | `InvoiceTable` |
| Hooks | `use` + PascalCase | `useInvoices` |
| Functions / Variables | camelCase | `formatCurrency` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Files (non-component) | kebab-case | `invoice-utils.ts` |
| Booleans | `is`/`has`/`can` prefix | `isLoading` |
| Event handlers | `handle` + Noun | `handleSubmit` |
| Services | noun + Service | `invoiceService` |

---

## 10 · ERROR HANDLING

### Laws
- **Every route / entry point has an error boundary.**
- **Every network call has an error path.**
- **Never show raw errors to users.** Map to human messages.
- **Never swallow errors silently.**
- **Log with context** — what, where, correlation ID.
- **Fail fast** on programmer errors; **recover gracefully** on user/environment errors.
- **Three states for every data view:**
  1. Loading → skeleton
  2. Error → retry UI
  3. Empty → helpful guidance + CTA

### Error Taxonomy
| Class | Behavior |
|---|---|
| Programmer error (bug) | Crash the boundary in dev; report in prod |
| User error (bad input) | Inline validation message |
| Environment error (network) | Retry / offline UI |
| Server error (5xx) | Toast + log + telemetry |
| Not found (404) | Empty state, not an error page |

---

## 11 · SECURITY BASELINE

- **Secrets in env files only**, never committed.
- **Public prefix only for public data** (`NEXT_PUBLIC_`, `VITE_`, etc.).
- **Sanitize all input** at the boundary.
- **Escape all output** rendered as HTML.
- **Never log secrets, tokens, or PII.**
- **HTTPS everywhere.** HSTS on.
- **CSP, CORS, and SameSite cookies** configured explicitly.
- **Dependency audit** in CI (npm audit, pip-audit, cargo-audit).
- **Least privilege** for every token, role, and service account.
- **No client-side permission checks are trusted** — re-check on the server.
- **Rate-limit** all public endpoints.

---

## 12 · ACCESSIBILITY (a11y)

- **Semantic HTML first** — `<button>`, `<nav>`, `<main>`.
- **Every image has `alt`** — descriptive or `alt=""` if decorative.
- **Every icon-only button has `aria-label`.**
- **Every input has a `<label>`** bound via `htmlFor`/`id`.
- **Keyboard navigable** — Tab, Enter, Escape, Arrows.
- **Visible focus ring always.** Never `outline: none` without a replacement.
- **Color is never the only signal** — pair with text or icon.
- **Contrast ratio ≥ 4.5:1** for body text, ≥ 3:1 for large text.
- **Respect `prefers-reduced-motion`.**

---

## 13 · RESPONSIVENESS & LAYOUT

- **Mobile-first** — write base styles for the smallest screen.
- **Breakpoints:** 375 · 768 · 1024 · 1280 · 1536.
- **Fluid containers** — `max-w-*`, `w-full`, flex, grid. No fixed px widths.
- **Tables scroll horizontally on mobile** — never overflow the viewport.
- **Modals adapt** — bottom-sheet on mobile, centered dialog on desktop.
- **Test at 375 / 768 / 1280** before calling a feature done.

---

## 14 · DESIGN SYSTEM

*(Even a global standard needs a source of truth for visuals.)*

- **Design tokens only** — no hardcoded hex, rgb, hsl values in code.
- **Semantic tokens**, not literal ones: `--color-danger`, not `--color-red-500`.
- **Dark mode driven by tokens**, not per-component overrides.
- **Pre-built utility classes** win over ad-hoc styling.
- **Typography scale** is fixed — no ad-hoc sizes.
- **Spacing scale** is fixed — no arbitrary margins.
- **Every token change requires design + engineering sign-off.**

> **Law:** If it appears more than twice, it becomes a token or a component.

---

## 15 · COMPONENT REUSE LAW

> **Never rebuild what already exists.**

Before writing any UI, check for:
- A primitive in `components/ui/`
- A composite in `components/shared/`
- A util in `utils/`
- A hook in `hooks/`

**Forbidden across every project:**
- Custom buttons when a `<Button>` primitive exists
- Raw `<table>` when `<DataTable>` exists
- Custom modals when `<Modal>` exists
- `alert()` / `confirm()` — use UI primitives
- Duplicating a util instead of importing it

---

## 16 · PERFORMANCE — THE MEASUREMENT LAW

> **"No optimization without a measurement."**

### 16.1 Required Workflow
1. **Define the metric** — FCP, TTI, p95 latency, memory, bundle size.
2. **Capture a baseline** — in a realistic environment.
3. **Set a target** — "reduce p95 from 800 ms to ≤ 300 ms."
4. **Change one variable.**
5. **Re-measure.** Compare against baseline.
6. **Keep or revert.** No guessing.
7. **Add a regression test** if the metric is critical.

### 16.2 Core Web Vitals Targets (web apps)
| Metric | Good | Needs work | Poor |
|---|---|---|---|
| LCP | ≤ 2.5 s | ≤ 4.0 s | > 4.0 s |
| INP | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| TTFB | ≤ 800 ms | ≤ 1.8 s | > 1.8 s |

### 16.3 Forbidden Micro-Optimizations
Do not "optimize" without data:
- ❌ Replacing readable code with obscure bit-twiddling
- ❌ Adding caches "just in case"
- ❌ Wrapping everything in `memo`
- ❌ Precomputing values that are already cheap

---

## 17 · TESTING

- **Unit tests** for pure logic and utilities.
- **Component tests** for user-visible behavior.
- **Integration tests** for every mutation (create / update / delete).
- **E2E tests** for critical user journeys only.
- **Every test covers:** happy path, loading state, error state, empty state.
- **Mock at the boundary** (service layer), never deep internals.
- **Never test implementation details** — test behavior.
- **Tests live next to the code** (`foo.test.ts` beside `foo.ts`).
- **Never ask AI to write tests and implementation in one prompt.**

### Coverage expectations
| Layer | Target |
|---|---|
| Utils / pure logic | ≥ 90 % |
| Services | ≥ 80 % |
| Components | ≥ 70 % |
| End-to-end flows | Critical paths 100 % |

---

## 18 · VERSION CONTROL & COLLABORATION

### Commits — Conventional Commits (strict)
```
feat(scope):     new feature
fix(scope):      bug fix
refactor(scope): behavior-unchanged change
perf(scope):     performance improvement
style(scope):    formatting only
chore(scope):    tooling / deps
docs(scope):     documentation
test(scope):     tests only
```

### Branching
- `feat/*`, `fix/*`, `refactor/*`, `perf/*`, `chore/*`
- **Never commit directly to `main` or `develop`.**
- **PRs target `develop`**, never `main`.
- **Every PR** links an issue, has a description, and passes CI.

### PR Requirements
- Small and focused (≤ 400 LOC ideal).
- Tests included.
- Screenshots for UI changes.
- Performance notes for perf-sensitive changes.
- Self-reviewed before requesting review.

---

## 19 · THE AI WORKFLOW (MANDATORY)

When using AI for any change, follow these steps **in order**:

1. **READ** — Ask AI to summarize existing related code. No writing yet.
2. **PLAN** — Define types, cache keys, and interfaces.
3. **SERVICE** — Write or extend the data-access layer.
4. **HOOK** — Write the stateful logic wrapper.
5. **COMPONENT** — Build UI using only existing primitives.
6. **STATES** — Add loading, error, empty, and permission states.
7. **REVIEW** — Read every line. Accept nothing blindly.
8. **TEST** — Write tests in a **separate** prompt.
9. **COMMIT** — Conventional commit. Push. PR.

> **Rule:** After 8–10 interactions on one feature, summarize and start a **new** session. Context rot is real.

### AI Must Never (without explicit approval)
- Add a library not in the charter
- Introduce a new pattern for a solved problem
- Rewrite an existing module
- Use `any` / `@ts-ignore` / escape hatches
- Skip loading / error / empty states
- Bypass the service layer
- Commit `console.log`, `TODO`, or commented code

---

## 20 · THE OPTIMIZATION CHECKLIST

Every PR must satisfy **all** applicable items.

### 🧠 Cognition
- [ ] All related files read before writing
- [ ] No duplicated logic — reused from `utils/`, `hooks/`, `services/`
- [ ] Functions < 40 lines, files < 200 lines
- [ ] No magic numbers, no dead code, no commented blocks
- [ ] Zero warnings from linter and type checker

### ⚙️ Correctness
- [ ] Types are explicit at boundaries
- [ ] Input validated; output escaped
- [ ] Errors handled, not swallowed
- [ ] Async I/O parallelized where possible
- [ ] Timeouts on all network calls

### 🚀 Performance
- [ ] Bundle size within budget
- [ ] No N+1 queries; list endpoints paginated
- [ ] Heavy components lazy-loaded
- [ ] Expensive computations memoized (measured, not guessed)
- [ ] Cache invalidation is precise, not broad
- [ ] Core Web Vitals verified

### 🎨 UI / UX
- [ ] Loading skeleton matches final layout (no flash)
- [ ] Error state has retry
- [ ] Empty state has icon + message + CTA
- [ ] Dark mode verified
- [ ] Responsive at 375 / 768 / 1280

### ♿ Accessibility
- [ ] Semantic HTML used
- [ ] Images have `alt`
- [ ] Icon buttons have `aria-label`
- [ ] Focus rings visible
- [ ] Keyboard-navigable

### 🔒 Security
- [ ] No secrets committed
- [ ] No `localStorage` / `sessionStorage` direct access without a wrapper
- [ ] Rate limits respected
- [ ] Auth re-validated server-side

### 🧪 Tests
- [ ] Happy path covered
- [ ] Loading, error, empty covered
- [ ] Mutations have integration tests

### 🌳 Git
- [ ] Branch follows convention
- [ ] Commits follow Conventional Commits
- [ ] PR targets `develop`
- [ ] `.env` files not staged

---

## 21 · ABSOLUTE PROHIBITIONS

The following are **forbidden in every project** adopting this constitution:

| Category | Forbidden |
|---|---|
| **Libraries** | Adding any dependency without approval · Duplicating a lib's function · Floating versions |
| **Types** | `any` · `@ts-ignore` · `@ts-expect-error` · `eval` in prod |
| **State** | `useState + useEffect` for server data · Inline cache keys · Untracked global state |
| **I/O** | Raw `fetch` in components · Multiple HTTP clients · Serial await in loops · No timeouts |
| **Caching** | Unbounded caches · No eviction policy · Caching without measurement |
| **Storage** | Direct `localStorage` / `sessionStorage` access without a wrapper |
| **UI** | Custom buttons/tables/modals when primitives exist · `alert()` / `confirm()` |
| **Styling** | Hardcoded colors · Ad-hoc typography sizes · Fixed px container widths |
| **Performance** | Optimizing without measurement · Memoizing everything blindly |
| **Code quality** | `console.log` · Commented code · `TODO` comments · Empty catches · Dead imports |
| **Async** | `.then()` chains · Unhandled rejections · `sleep()` in production |
| **Security** | Committed secrets · Logging tokens · Client-trusted auth |
| **AI** | Introducing patterns absent from the charter · Skipping review · Bulk-generating a feature in one prompt |

---

## 22 · GOVERNANCE & AMENDMENTS

- This document is **versioned** and **authoritative**.
- **Any change** requires:
  1. A written proposal
  2. Impact analysis (perf, bundle, DX, migration cost)
  3. Approval by the tech lead / architect
  4. PR updating **this document first**
  5. Then, and only then, the change may be merged into code
- **Local charters may extend** this document — never contradict it.
- **Every quarter**, review the constitution against real-world pain points and update deliberately.

---

## 23 · THE ONE-LINE SUMMARY

> **Read first. Reuse second. Measure third. Optimize fourth. Document always. Ship small. Never guess.**

---

**END OF CONSTITUTION · Version 1.0 · Universal**
