# @app/backend

Fastify (Node.js) — API layer.

**Scaffolded in Step 5.**

Uses user JWT (RLS enforced). `service_role` key is used ONLY for
migrations, seeds, and admin cron jobs — never for user requests.
