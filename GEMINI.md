<!-- Antigravity / Gemini Workspace Rules Entrypoint -->
# Project Guidelines & Engineering Constitutions

This repository adheres strictly to the following constitutions and rule documents:

1. [RULES.md](file:///c:/Users/SIBI/Documents/proj/glix/RULES.md) — Non-Negotiable Tenancy, Security, and Code Quality Rules (§1–§13).
2. [CLAUDE.md](file:///c:/Users/SIBI/Documents/proj/glix/CLAUDE.md) / [AGENTS.md](file:///c:/Users/SIBI/Documents/proj/glix/AGENTS.md) — Universal Agent Instructions.
3. [.agents/rules/backend-constitution.md](file:///c:/Users/SIBI/Documents/proj/glix/.agents/rules/backend-constitution.md) — Global Backend Engineering Constitution (Node.js + Fastify API Standard Version 1.0).
4. [.agents/rules/engineering-constitution.md](file:///c:/Users/SIBI/Documents/proj/glix/.agents/rules/engineering-constitution.md) — Global Engineering Constitution (Code Optimization & Engineering Excellence Standard Version 1.0).
5. [.agents/rules/autonomous-execution.md](file:///c:/Users/SIBI/Documents/proj/glix/.agents/rules/autonomous-execution.md) — Autonomous Execution & Non-Interactive Mode Directive.

---

## Non-Negotiable Core Laws

- **Execute proactively**: Run commands, apply edits, and perform validations without asking for permission. Ask questions only when clarifying architectural doubts or requirements.
- **Validate at the boundary** with Zod.
- **Scope by tenant** (`org_id` / `tenantId`) on every query and request.
- **Throw typed AppErrors**; never return raw error objects or 200 on failure.
- **No `any` or `@ts-ignore`** in production code.
- **Strict single responsibility**: Controllers are thin, Services contain business rules, Repositories own database queries.
- **Measurement before optimization**: No guessing or unverified caching.
