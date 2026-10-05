# UI_SPEC.md

Literal design values. No vague words ("big", "nice"). AI copies exact values.
All values map to `shared/config/brand.config.ts` + Tailwind tokens.

---

## 0. Global Tokens

### 0.1 Colors

Defined in `frontend/app/globals.css` as CSS variables, mirrored in
`frontend/tailwind.config.ts`. Source of truth for brand colors is
`shared/config/brand.config.ts`.

| Token | CSS var | Value | Usage |
| :--- | :--- | :--- | :--- |
| `--primary` | `--primary` | `#F57C00` | Buttons, links, focus |
| `--primary-foreground` | | `#FFFFFF` | Text on primary |
| `--accent` | `--accent` | `#1E293B` | Headings, dark surfaces |
| `--destructive` | | `#DC2626` | Errors, delete |
| `--success` | | `#16A34A` | Confirmations |
| `--warning` | | `#F59E0B` | Warnings |
| `--background` | | `#FFFFFF` / `#0A0A0A` | Page bg (light/dark) |
| `--foreground` | | `#0F172A` / `#FAFAFA` | Text (light/dark) |
| `--muted` | | `#F1F5F9` / `#1E293B` | Subtle surfaces |
| `--muted-foreground` | | `#64748B` / `#94A3B8` | Secondary text |
| `--border` | | `#E2E8F0` / `#1E293B` | Dividers, input borders |
| `--ring` | | `#F57C00` | Focus ring |

**Rule:** never hardcode a hex in a component. Always use a token.

### 0.2 Typography

Font: **Inter** (via `next/font`). Fallback: system stack.

| Class | Size / Line-height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| `text-4xl font-semibold tracking-tight` | 36/40 | 600 | Page hero |
| `text-3xl font-semibold` | 30/36 | 600 | Section title |
| `text-2xl font-semibold` | 24/32 | 600 | Card title |
| `text-xl font-medium` | 20/28 | 500 | Subsection |
| `text-base` | 16/24 | 400 | Body |
| `text-sm` | 14/20 | 400 | Secondary body |
| `text-xs` | 12/16 | 400 | Labels, meta |
| `font-mono` | | | IDs, codes |

**Rule:** max two font weights per screen. No custom font sizes.

### 0.3 Spacing

Tailwind default scale. Use only these:

`0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32`
(→ 0px, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px, 96px, 128px)

**Common patterns:**
- Page padding: `px-6 py-8` (mobile) → `px-8 py-12` (desktop)
- Card padding: `p-6`
- Form field gap: `space-y-4`
- Section gap: `space-y-8`
- Grid gap: `gap-6`

### 0.4 Radii

| Token | Value | Usage |
| :--- | :--- | :--- |
| `rounded-sm` | 4px | Badges, chips |
| `rounded-md` | 6px | Inputs, buttons |
| `rounded-lg` | 8px | Cards, dialogs |
| `rounded-xl` | 12px | Modals, large containers |
| `rounded-full` | 9999px | Avatars, pills |

### 0.5 Shadows

Only shadcn defaults:
- `shadow-sm` — subtle elevation
- `shadow` — cards on hover
- `shadow-md` — dropdowns, popovers
- `shadow-lg` — dialogs, sheets

No custom shadows.

### 0.6 Breakpoints

Tailwind defaults:

| Name | Min width |
| :--- | :--- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Mobile-first. Always write base → `md:` → `lg:`.

---

## 1. Component Library

**All primitives come from shadcn/ui.** No new button/input/dialog components.
If shadcn has it, use it. If it doesn't, compose.

Installed in Phase 1 (manual build — the `shadcn` CLI hung non-interactively
in this environment; components were hand-written to the same source
shadcn/ui would generate, same import paths, same `cn()`/CVA conventions):
`button, input, label, form, card, separator, badge, alert, avatar,
dropdown-menu, sheet, select, tooltip, sonner`.
Not yet installed (add when a phase first needs them): `dialog, table, tabs,
checkbox, radio-group, popover, command, calendar, scroll-area`.

**Composition rule:** never modify files under `frontend/components/ui/`.
Wrap them in `frontend/components/<feature>/` if you need variation.

---

## 2. Screen-by-Screen Specs

### 2.1 Auth — Login (`/login`)

Layout: two-column on `lg`, single-column on mobile.

```
Container:       min-h-screen flex
Left (brand):    hidden lg:flex lg:w-1/2 bg-accent text-accent-foreground
                 p-12 flex-col justify-between
  - Logo:        h-8 w-auto
  - Tagline:     text-3xl font-semibold tracking-tight max-w-md
  - Footer:      text-sm text-muted-foreground

Right (form):    flex flex-1 items-center justify-center p-6
  Card:          w-full max-w-sm space-y-6
  Title:         text-2xl font-semibold
  Subtitle:      text-sm text-muted-foreground
  Form:          space-y-4
  Email field:   Input type=email autoComplete=email
  Password:      Input type=password autoComplete=current-password
  Submit:        Button variant=default w-full
  OAuth:         Button variant=outline w-full (Google)
  Footer link:   text-sm text-center (Sign up / Forgot)
```

### 2.2 Auth — Signup (`/signup`)

Same layout as Login. Different fields: `fullName`, `email`, `password`,
`organizationName`. After submit → org auto-created → user is `org_admin`.

### 2.3 App Shell (`/(app)/layout.tsx`)

```
Sidebar (desktop, lg+):
  w-64 border-r bg-background
  Logo top:        h-14 px-4 flex items-center border-b
  Nav items:       px-3 py-2 rounded-md text-sm font-medium
    Active:        bg-muted text-foreground
    Hover:         bg-muted/50
    Icon:          h-4 w-4 mr-3
  Footer:          user avatar + name + role badge

Topbar (mobile + desktop):
  h-14 border-b px-4 flex items-center justify-between
  Mobile:          hamburger → Sheet
  Right:           org switcher (v1.1), notifications, user menu

Content:
  Container:       max-w-7xl mx-auto px-6 py-8
```

### 2.4 Dashboard (`/(app)/dashboard`)

```
Header:       flex items-baseline justify-between
  Title:      text-3xl font-semibold
  Action:     Button (e.g. "Add employee")

KPI grid:     grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8
  Card:       p-6 space-y-2
  Label:      text-sm text-muted-foreground
  Value:      text-2xl font-semibold
  Trend:      text-xs (optional)

Recent activity: mt-8 Card p-6
  List:       divide-y
  Item:       py-3 flex items-center justify-between
```

### 2.5 Employees list (`/(app)/employees`)

```
Toolbar:      flex items-center justify-between mb-6
  Search:     Input w-72
  Filters:    Select (role, status)
  Action:     Button "Add employee"

Table:        Card p-0
  Header:     bg-muted text-xs font-medium text-muted-foreground
  Row:        h-12 px-4 hover:bg-muted/50
  Columns:    name (font-medium), email (text-muted-foreground), role (Badge),
              status (Badge), actions (DropdownMenu)

Empty:        py-16 text-center
  Icon:       h-12 w-12 text-muted-foreground mx-auto
  Title:      text-lg font-medium mt-4
  CTA:        Button mt-4

Pagination:   flex items-center justify-between mt-4
```

### 2.6 Employee detail (`/(app)/employees/[id]`)

```
Header:       flex items-start justify-between
  Avatar:     h-16 w-16 rounded-full
  Name:       text-2xl font-semibold
  Meta:       text-sm text-muted-foreground
  Actions:    DropdownMenu (edit, deactivate, delete)

Tabs:         Tabs
  Info:       Form with fields
  Documents:  Grid of doc cards
  Activity:   Audit entries for this employee
```

### 2.7 Documents (`/(app)/documents`)

```
Upload dropzone:
  Card:       border-2 border-dashed border-border rounded-lg p-12 text-center
  Icon:       h-10 w-10 text-muted-foreground mx-auto
  Text:       text-sm text-muted-foreground mt-2
  Button:     variant=outline mt-4

List:         same table pattern as Employees
Preview:      Sheet (right side, w-96) — file details + signed URL preview
```

### 2.8 Owner panel — Tiers (`/(owner)/tiers`)

```
Warning banner: Alert variant=warning
  "Changes here affect all organizations."

Tier cards:   grid gap-6 md:grid-cols-2
  Card:       p-6
  Name:       text-lg font-semibold + Badge (current)
  Price:      text-3xl font-semibold
  Limits:     form fields (users, employees, storage_gb)
  Features:   checkbox list
  Save:       Button (audit-logged)
```

### 2.9 Error / Empty / Loading states

**Every** list/table/detail screen must render:

| State | Treatment |
| :--- | :--- |
| Loading | `Skeleton` rows matching final layout |
| Empty | Icon + title + subtitle + primary CTA |
| Error | `Alert variant=destructive` + Retry button |
| Permission denied | Icon + "You don't have access" + link to request |

Never show blank screen. Never show raw error messages to users.

---

## 3. Forms

- Always wrap in `<Form>` (react-hook-form + Zod resolver)
- Label above input (`text-sm font-medium`)
- Error message below (`text-xs text-destructive mt-1`)
- Disabled state during submit (Button `disabled` + spinner)
- Success: toast (`sonner`) + optimistic update
- Server errors: field-level mapping from `{ code }` → `form.setError`

---

## 4. Accessibility (non-negotiable)

- Every input has a `<Label>` and `aria-invalid` on error
- Every icon-only button has `aria-label`
- Focus ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Color contrast: AA minimum (4.5:1 body, 3:1 large)
- Keyboard nav: full tab order, `Esc` closes dialogs, `Enter` submits forms
- No `div` with `onClick` — use `button`

---

## 5. Responsive Rules

| Breakpoint | Behavior |
| :--- | :--- |
| `< md` | Single column, sidebar → Sheet, tables → cards |
| `md` | Two columns for cards, tables stay tabular |
| `lg` | Sidebar visible, three+ columns for grids |
| `xl` | Max-width container (`max-w-7xl`) centered |

---

## 6. Theme

- Default: **system** (respect OS preference)
- Toggle in user menu
- Stored in cookie (`theme=light|dark|system`)
- No flash — SSR sets `class` on `<html>` from cookie
- Both themes must pass AA contrast

---

## 7. Icons

- Library: `lucide-react`
- Sizes: `h-4 w-4` (inline), `h-5 w-5` (buttons), `h-6 w-6` (nav)
- Stroke width: default (2)
- Never mix icon libraries

---

## 8. Motion

- Transitions: `transition-colors`, `transition-transform`, `transition-opacity`
- Duration: `150ms` (default), `200ms` (dialogs)
- Respect `prefers-reduced-motion` — disable non-essential
- No bounce, no spring, no parallax

### 8.1 Animation library (approved addition)

Goal: a professional, "company-standard" feel for both the public marketing
site (landing, pricing, register wizard) and the app itself (dashboards,
tables, forms) — polished micro-interactions, not flashy/experimental motion.

- **Approved: [Animate UI](https://animate-ui.com)** — shadcn-compatible
  animated primitives, installed per-component the same way as any other
  shadcn/ui piece: `pnpm dlx shadcn@latest add @animate-ui/<component>`.
  Lightweight, performance-optimized, built for exactly this use case (SaaS
  dashboards + landing pages). Use for: page transitions, animated numbers/counters
  (KPI tiles on the dashboard), sliding/fading lists, tab/accordion motion.
- **Secondary, case-by-case: [Smooth UI](https://smoothui.dev)** — subtle
  micro-interactions aimed at enterprise/admin panels. Pull in an individual
  component only when Animate UI doesn't cover the need (e.g. a specific
  loading/hover micro-interaction) — don't add it as a second blanket dependency.
- **Not approved:** Acernity UI, Cult UI (pull in `framer-motion` + `three.js`/`@react-three/fiber`
  — too heavy and visually loud for an HR portal), Berlix UI (installs from a
  third-party personal registry domain, not an acceptable supply-chain source
  per the engineering constitution's dependency rules).
- Same rule as every other shadcn component (UI_SPEC §1): never modify the
  installed primitive under `frontend/components/ui/` — wrap it in
  `frontend/components/<feature>/` for variations.
- Still subject to `prefers-reduced-motion` and the no-bounce/no-spring/no-parallax
  rules above — these libraries provide the *mechanism*, not a license to override
  the restraint this section already requires.

---

## 9. Copy & Content

- Sentence case for buttons and labels (`Save changes`, not `Save Changes`)
- Title case for page titles (`Employees`, not `employees`)
- Second person ("You", "Your org") — not "the user"
- Errors: what went wrong + what to do (`Couldn't save. Try again.`)
- Empty states: friendly, action-oriented
- **No hardcoded strings about currency/language** — read from `shared/config/locale.config.ts`

---

## 10. Amendments

Later decisions that supersede earlier sections are appended here with date.

| Date | Section | Change | Reason |
| :--- | :--- | :--- | :--- |
| 2026-10-05 | 0.1 Colors | Confirmed `--primary` = `#F57C00` as the single source of truth; `shared/config/brand.config.ts` updated to match (was `#2563EB`). | Resolve brand/UI_SPEC color conflict — `#F57C00` is the legacy app's orange. |
| 2026-10-05 | 8.1 Motion | Approved Animate UI (primary) + Smooth UI (secondary, case-by-case) as the project's shadcn-compatible animation libraries. | Project owner asked for a "professional company standard" site/app feel; this sets one approved source instead of ad-hoc per-component choices later. |
