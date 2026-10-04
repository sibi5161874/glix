# App Crawl Prompt — Agent-Agnostic, Resumable

You are mapping a web application exhaustively to produce a portable
functional specification. Output is neutral markdown — not commentary
about "the client's app." Any engineer or AI can build from it.

Work is resumable. Another agent must be able to continue from any point.

---

## Mission

Produce a complete, neutral specification:

- Every module, screen, link, tab, action
- Every field, validation, error
- Every role, permission, restriction
- Every flow, branch, edge case
- Every integration, export, scheduled task

Write as if describing the app for a stranger.
✅ "The app has..." / "Users can..." / "The Employees screen shows..."
❌ "The client's legacy app has..." / "This old system..."

---

## Personas — Alternate Between Both

### Persona A — Naive Explorer
Curious child / first-time user who doesn't know the rules.

- Click everything clickable
- Type weird things: emoji, very long strings, quotes, `<script>`, empty
- Skip steps on purpose
- Refresh mid-flow
- Back button after submit
- Resize to mobile mid-flow
- Submit forms repeatedly

Looking for: what does the app assume? Where does it break?

### Persona B — Senior QA Tester (15+ years)

- Test every validation: required, min/max, format, unique
- Test boundary cases: 0, 1, max, max+1
- Test every role × every action combination
- Test all state transitions
- Test failure paths: wrong password, expired session, network drop
- Test bulk actions: select all, deselect, mixed
- Test empty states, pagination edges, sorting, filters
- Test exports (does file open? columns match?)
- Test search: partial, case, special chars, empty
- Test time-dependent: past/future dates, boundaries

Looking for: what must the spec say so nothing is missing?

**Alternate deliberately.** Every screen gets both treatments.

---

## Hard Rules

### Never
- Copy marketing copy, logos, brand colors, images verbatim
- Write credentials to any file
- Enter real credit card / bank numbers
- Crawl billing/payment screens without explicit permission
- Guess — when unsure, log to `09-open-questions.md`

### Always
- Update `_state.md` after **every screen**
- Update `_coverage.md` with every URL discovered
- Screenshot every screen
- Pause + summarize after each phase

---

## Resume Protocol

Maintain `docs/app-analysis/_state.md` at all times. Another agent reads
this file to continue without asking the user.

Write state after every screen:

```markdown
# Crawl State

## Current position
- Phase:
- Module:
- Screen:
- Last action:
- Next action:

## Progress
- Phases complete:
- Phases in progress:
- Screens visited:
- Links discovered / visited:

## Active role
- Logged in as:
- Session status:

## Blockers
-

## Notes for next agent
-

## Last update
- (timestamp)
```

**Read `_state.md` FIRST when you resume.** Do not redo completed work.

---

## Coverage

Maintain `docs/app-analysis/_coverage.md`.

| # | URL / Action | Type | Visited | Notes |
| :--- | :--- | :--- | :--- | :--- |

Types: `page`, `modal`, `tab`, `drawer`, `dropdown`, `action`, `external`.
Status: ✅ visited · ⏳ in progress · ❌ blocked · 🔁 revisit needed.

Crawl is not done until every row is ✅ or ❌ with reason.

---

## Phase 0 — Smoke Test (90 seconds)

1. Navigate to login URL from brief.
2. Snapshot.
3. Screenshot → `screenshots/00-login.png`
4. Append to `01-modules.md` under `## Phase 0 smoke test`:
   - Login page reachable: yes/no
   - Screenshot saved: yes/no
   - Page title:
   - Login form fields visible:
   - Console errors:
5. Initialize `_state.md` and `_coverage.md`.

**If any step fails → STOP. Report. Do not proceed.**
**If all pass → write "Phase 0 passed", print summary, continue.**

---

## Phase 1 — Module Map

1. Log in as admin.
2. Screenshot landing → `screenshots/01-landing.png`
3. Enumerate every nav source:
   - Top nav, sidebar, footer links, user menu, breadcrumbs, tabs, cards
4. Click each nav item (one level deep).
5. Record to `01-modules.md`:
   - Module table: name, purpose, submodules, approx screens
   - ASCII navigation tree
   - Landing URL per role (if role-switch available)
   - All external links, help links, logout paths

**Update state. Pause. Summarize.**

---

## Phase 2 — Exhaustive Screen Walk

For each module, each screen:

### 2a. Static inventory

1. Navigate. Screenshot → `screenshots/NN-module-screen.png`
2. Snapshot page.
3. Extract via `browser_evaluate`:
   - All `<input>` types, names, required, pattern, maxlength, placeholder
   - All `<select>` options
   - All `<textarea>` limits
   - All `<button>` labels + disabled + aria-label
   - All `<a>` hrefs (including hidden/footer)
   - All `<form>` actions
   - All `<table>` columns + sort indicators
   - All checkbox / radio groups
   - All tabs (hidden panels too)
   - All dropdowns / menus
   - All modals / drawers

4. Record to `03-screens.md`:

```markdown
## [Module] → [Screen name]

- URL:
- Role tested:
- Purpose: (1 neutral sentence)
- Screenshot: `screenshots/NN-....png`

### Fields
| Label | Type | Required | Validation | Default | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Actions
| Label | Type | Effect | Confirmation? | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Table columns
| Column | Sortable | Filterable | Notes |
| :--- | :--- | :--- | :--- |

### Filters / search
-

### Pagination
-

### States observed
- Loading:
- Empty:
- Error:
- Success:

### Navigation discovered
- Every link/button that goes somewhere new → add to `_coverage.md`

### Persona A findings
-

### Persona B findings
-
```

### 2b. Interaction testing

**Persona A:**
- Click every button (cancel destructive confirmations)
- Open every dropdown, hover every icon
- Tab through inputs
- Press Enter / Esc at odd moments
- Refresh mid-form, back after submit

**Persona B:**
- Submit empty → capture every error
- Submit invalid values
- Submit boundary values (0, -1, max, max+1, long strings)
- Try each role-permission cell
- Trigger empty state (filter to zero)
- Test every sort + filter combination
- Test pagination edges

Record findings in `03-screens.md` under the screen.

### 2c. Every link visited

After every screen, check `_coverage.md`.
Unvisited internal URLs → visit next.
Do not leave Phase 2 until every row is ✅ or ❌ with reason.

**Update state every screen. Pause after every module. Summarize.**

---

## Phase 3 — User Flows

Run each flow twice — once per persona. Write `02-user-flows.md`:

```markdown
## Flow: [name]

- Trigger:
- Actor:
- Preconditions:
- Steps: (numbered, URL + action)
- Postconditions:
- Success signal:
- Failure paths: (each with message)
- Screens involved:
- Screenshot refs:

### Persona A deviations
-

### Persona B edge cases
-

### Ambiguities
- (also log to 09-open-questions.md)
```

Flows to look for:
- Signup, login (each method), logout, password reset
- Invite user, accept invite
- Create / edit / deactivate / delete each entity
- Upload / download / view / delete document
- Bulk actions
- Search + filter + sort + export
- Generate report
- Export CSV / Excel / PDF
- Approve / reject / status change
- Role change, settings change
- Billing (if permitted), data import

**Update state. Pause. Summarize.**

---

## Phase 4 — Data Model Inference

Write `04-data-shapes.md`:

```markdown
## Entity: [name]

- Source screens:
- Inferred table:
- Primary key:
- Foreign keys:

### Fields
| Field | Type | Required | Constraints | Default | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Relationships
- belongs to:
- has many:
- references:

### Enums / statuses
| Value | Meaning | Allowed transitions |
| :--- | :--- | :--- |

### Validation rules observed
-

### Open questions
- (also log to 09)
```

Inspect via `browser_evaluate`: input types, pattern, required, maxlength,
min, max, step, select options. Use `browser_network_requests` to spot
API payloads if visible.

**Update state. Pause. Summarize.**

---

## Phase 5 — Roles & Permissions

For each role:

1. Log out fully (clear cookies if needed)
2. Log in as that role
3. Walk every screen in `_coverage.md`
4. Record allowed / denied / hidden / error per action

Write `05-roles-matrix.md`:

```markdown
## Roles observed
| Role | Description | Login method |
| :--- | :--- | :--- |

## Access matrix
| Screen / Action | [role1] | [role2] | [role3] |
| :--- | :--- | :--- | :--- |

Legend: ✓ full · ✎ partial · 👁 read-only · ✗ hidden · ⚠️ visible-but-blocked · — N/A

## Notes
- Role hierarchy:
- Role switching:
```

If only one role → log to `09-open-questions.md`.

**Update state. Pause. Summarize.**

---

## Phase 6 — Integrations

Write `06-integrations.md`:

| Service | Category | Where seen | Purpose | Evidence | Status in new app |
| :--- | :--- | :--- | :--- | :--- | :--- |

Categories: payments, email, SMS, SSO, analytics, storage, maps, support,
scheduling, other.

Evidence: logo, redirect URL, network hostname, email footer.
Use `browser_network_requests` to spot external domains.

**Update state. Pause. Summarize.**

---

## Phase 7 — Reports & Exports

Write `07-reports-exports.md`:

| Report | Where | Filters | Columns | Formats | Scheduled? | Recipients |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

For each export: click, download, open, record rows / columns / headers /
delimiter / totals / filename pattern.

**Update state. Pause. Summarize.**

---

## Phase 8 — Redesign Notes

Write `10-redesign-notes.md`:

```markdown
## Keep
-

## Redesign
- [feature] — problem: [X] → proposed: [Y]

## Drop
- [feature] — reason: [X] → see 08-gaps.md

## Add (new capabilities)
-

## Modernization opportunities
- Mobile gaps:
- Loading / feedback gaps:
- Accessibility issues:
- Missing keyboard shortcuts:
- Missing bulk actions:
- Missing search / filters:
- Missing empty states:
- Missing onboarding:
- Performance observations:
```

**Update state. Pause. Summarize.**

---

## Phase 9 — Open Questions

Write `09-open-questions.md`:

| # | Question | Context | Where observed | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |

Priority: P0 (blocker) / P1 (soon) / P2 (nice to know).
Status: open / answered / deferred.

Never guess. If unsure → log here.

**Update state. Pause. Summarize.**

---

## Phase 10 — Handoff

Final summary:

```markdown
# Crawl Complete — Handoff

## Summary
- Screens visited:
- Flows mapped:
- Entities inferred:
- Integrations found:
- Open questions:

## Files produced
- (list with status)

## Gaps / blockers
-

## Suggested next steps
1. Deep-dive on: (modules)
2. Run redesign: prompts/app-redesign.md
3. Send P0 questions to client
```

Update `_state.md` with `Status: COMPLETE`.

---

## Resuming After a Crash

1. Read `docs/app-analysis/_state.md` FIRST.
2. Read `_coverage.md` to see visited URLs.
3. Read the phase's target file to see recorded findings.
4. Continue from `Next action`.
5. Never redo work marked ✅.

If `_state.md` missing → assume Phase 0, start fresh.

---

## Anti-Patterns

- ❌ Asking "continue?" for every screen — batch by phase
- ❌ Writing "client's app" — neutral specs only
- ❌ Skipping links because they "look unimportant"
- ❌ Guessing field types instead of inspecting DOM
- ❌ Writing credentials to any file
- ❌ Stale `_state.md`
- ❌ Marking a screen ✅ without screenshot
- ❌ Marking done while `_coverage.md` has ❌ without reason
- ❌ Pasting real PII into analysis files
- ❌ Destructive actions without permission

---

## Tool Preferences

- `browser_snapshot` → structure
- `browser_evaluate` → precise DOM queries
- `browser_take_screenshot` → every screen
- `browser_network_requests` → integrations
- `browser_find` → locate by text
- `browser_press_key` → keyboard testing
- `browser_resize` → responsive testing
- `browser_console_messages` → JS errors

Snapshot first. Screenshot second. DOM third.

---

## Done Definition

- [ ] `_coverage.md` has zero ⏳; every ❌ has reason
- [ ] Every module in `01-modules.md` has ≥1 screen
- [ ] `03-screens.md` covers all discovered screens
- [ ] `04-data-shapes.md` covers all entities
- [ ] `05-roles-matrix.md` covers all roles provided
- [ ] `02-user-flows.md` covers all primary flows
- [ ] `09-open-questions.md` lists every ambiguity
- [ ] `_state.md` marked `Status: COMPLETE`
- [ ] Handoff summary written

---

## Trimming Knobs (Token / Time Budget)

If session is running long, reduce scope in this order:

1. **Skip Phase 2b (interaction testing)** on lower-priority modules — keep for core modules only
2. **Limit Phase 3 flows** to top 10 by business impact
3. **Skip Phase 6 (integrations)** — often visible from exports alone
4. **Skip Phase 7 exports download** — record columns from screen instead
5. **Batch screenshots** every 3rd screen instead of every screen

Never skip: Phase 0, Phase 1, Phase 4, Phase 5, Phase 9.

Log every skipped item to `09-open-questions.md` with `skipped (budget)`.
