# Bootstrap Protocol

You are entering an existing project. Follow this protocol exactly.
Do not write code until Phase C completes.

---

## Phase A — Read the manifest

Read `.agents/manifest.json` first.

It tells you:
- What this project is
- Every file you must read, in order
- Every phase that must be executed
- Verification requirements
- Hard constraints

Do not skip any file in `readingOrder`.

---

## Phase B — Read every file in order

For each stage in `readingOrder`:

1. Read every file listed.
2. Print one line per file: `[stage] ✓ READ path/to/file.ts — <10-word summary>`
3. If a file is missing, print `[stage] ✗ MISSING path — <reason>` and stop.
4. After the stage completes, print a stage summary.

After all stages complete, print:
- Total files read
- Any missing files
- Any inconsistencies between docs

---

## Phase C — Prove understanding

Produce a single message containing:

### 1. Project identity (5 lines max)
- Name, domain, tenancy model, actors, tiers

### 2. Architecture (10 lines max)
- Stack: frontend, backend, DB, auth, storage
- How a request flows: browser → frontend → backend → DB (RLS)
- Where tenancy is enforced

### 3. Data model (one-line per table)
- List every entity you'll implement

### 4. Roles (one-line each)
- super_admin, org_admin, org_staff, org_viewer

### 5. Phases (compare your plan to manifest)
- Print the 12 phases
- Flag any phase you'd reorder or split
- Justify each change in one line

### 6. Constraints you will obey
- Print the 10 `never` items + 10 `always` items from the manifest

### 7. Unknowns
- Anything unclear in the docs
- Anything missing that blocks Phase 0

Then STOP.
Do not proceed until the user replies with `approved`.

---

## Phase D — Create the session file

Create `.agents/_session.md`:

```markdown
# Session State

## Project
- Name: Glix Connect HR Portal
- Started: <timestamp>

## Current phase
- Phase: 0 (Basement)
- Task: —
- Last action: Bootstrap complete

## Progress
- Phases complete: —
- Phases in progress: —
- Phases pending: 0–11
- Files read: N
- Files missing: N

## Blockers
- —

## Next action
- Await user approval to start Phase 0

## Last update
- <timestamp>
```

Update this file after every task.

---

## Phase E — Wait for approval

Do NOT start Phase 0 until the user says `approved`.

When approved, begin Phase 0 by:

1. Opening `docs/BUILD_PLAN.md`
2. Printing the exact task list for Phase 0
3. Executing tasks one at a time
4. Running verification after each task
5. Updating `.agents/_session.md` after each task
6. Committing after the phase passes verification

---

## Resume Protocol

If a session ends abruptly:

1. Read `.agents/_session.md` FIRST.
2. Read `.agents/manifest.json` for context.
3. Skip Phase A/B/C.
4. Continue from `Next action` in `_session.md`.

Never redo work already marked ✅.

---

## Hard Rules

- Do not write code before Phase C prints.
- Do not skip files in `readingOrder`.
- Do not proceed to Phase 0 without explicit user approval.
- Do not commit without passing verification.
- Do not modify `RULES.md`, `manifest.json`, or `bootstrap.md` without asking.
- If you hit a blocker, write it to `_session.md` and STOP.

---

## Anti-Patterns

- ❌ "I'll read the files later" — read them now
- ❌ Guessing at stack / tenancy / roles
- ❌ Starting Phase 0 automatically
- ❌ Skipping verification "to save time"
- ❌ Modifying migrations that are already pushed
- ❌ Writing code that violates RULES.md
- ❌ Leaving `_session.md` stale
