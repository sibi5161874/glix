# BOOTSTRAP.md

Entry point for any AI coding agent (Antigravity, Claude Code, Cursor, etc.).

---

## How to start a session

Open your agent (Antigravity IDE, Claude Code CLI, etc.) at the repo root.
Paste the following as your first message:

---

```
Read .agents/manifest.json and follow .agents/bootstrap.md.

Execute Phases A, B, and C.

When Phase C completes, STOP and wait for me to reply `approved`.

Do not write any code until I approve.
```

---

That's it.

The agent will:
1. Read the manifest
2. Read every file in `readingOrder`
3. Prove understanding
4. Print a phase plan
5. Wait for your `approved`

Then it starts Phase 0 (Basement).

---

## How to resume a session

If a session ends:

```
Read .agents/_session.md and resume from Next action.
```

---

## How to run a single phase

```
Execute Phase <N> from docs/BUILD_PLAN.md.
Follow .agents/manifest.json verification rules.
Update .agents/_session.md when done.
```

---

## How to verify a phase is done

```
Run the per-phase verification from .agents/manifest.json.
Print results.
If all pass, commit as:
  feat(phase-<N>): <phase name>
```

---

## Emergency stop

If the agent goes off-rails:

```
STOP. Read RULES.md again. Report what rule you are about to violate.
```

---

## What's in each file

| File | Purpose |
| :--- | :--- |
| `.agents/manifest.json` | Machine-readable project manifest |
| `.agents/bootstrap.md` | Boot + resume protocol |
| `.agents/_session.md` | Live session state (auto-created) |
| `BOOTSTRAP.md` | This file — human entry point |
| `CLAUDE.md` | AI agent instructions (long-form) |
| `RULES.md` | Non-negotiable rules |
| `docs/BUILD_PLAN.md` | 12-phase execution plan |
| `docs/legacy-analysis/*` | Evidence base from crawl |
