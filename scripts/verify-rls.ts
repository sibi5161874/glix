// Proves Postgres RLS actually isolates tenants for the runtime role
// (glix_app) — not just that policies exist, but that they filter rows.
//
// Fixture setup runs as the owner role (DATABASE_URL_MIGRATE / glix_user),
// which is RLS-exempt by default — that's fine, it's only creating test
// data, not the thing being tested. All assertions below run as the
// restricted runtime role (DATABASE_URL / glix_app).
//
// Fixtures are permanent and idempotent (on conflict do nothing), not
// deleted after the run: deleting the fixture orgs would cascade-delete
// their audit_log rows, and audit_log's append-only trigger (004_audit_log.sql)
// unconditionally blocks every delete, including the owner's — correctly,
// per RULES.md. Re-running this script is safe; it reuses the same rows.
import { Client } from "pg";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), ".env.local") });
config({ path: join(process.cwd(), ".env") });

const OWNER_URL = process.env.DATABASE_URL_MIGRATE;
const APP_URL = process.env.DATABASE_URL;
if (!OWNER_URL) throw new Error("DATABASE_URL_MIGRATE required in environment");
if (!APP_URL) throw new Error("DATABASE_URL required in environment");

const ORG_X = "aaaaaaaa-0000-0000-0000-000000000001";
const ORG_Y = "aaaaaaaa-0000-0000-0000-000000000002";
const USER_X = "aaaaaaaa-0000-0000-0000-000000000011";
const USER_Y = "aaaaaaaa-0000-0000-0000-000000000012";
const EMP_X = "aaaaaaaa-0000-0000-0000-000000000021";
const EMP_Y = "aaaaaaaa-0000-0000-0000-000000000022";

let failures = 0;

function check(label: string, pass: boolean, detail?: string): void {
  if (pass) {
    console.log(`PASS  ${label}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function setFixtures(owner: Client): Promise<void> {
  const { rows } = await owner.query("select id from public.plans where slug = 'free' limit 1");
  const planId = rows[0]?.id;
  if (!planId) throw new Error("no 'free' plan found — run migrations/seed first");

  await owner.query("begin");
  try {
    await owner.query(
      `insert into public.users (id, email, full_name) values ($1, $2, 'RLS Test X'), ($3, $4, 'RLS Test Y')
       on conflict (id) do nothing`,
      [USER_X, "rls-test-x@example.test", USER_Y, "rls-test-y@example.test"],
    );
    await owner.query(
      `insert into public.organizations (id, name, slug, owner_id, plan_id, currency)
       values ($1, 'RLS Test Org X', 'rls-test-x', $2, $3, 'AED'),
              ($4, 'RLS Test Org Y', 'rls-test-y', $5, $3, 'AED')
       on conflict (id) do nothing`,
      [ORG_X, USER_X, planId, ORG_Y, USER_Y],
    );
    await owner.query(
      `insert into public.employees (id, org_id, employee_code, first_name, last_name, email, joining_date)
       values ($1, $2, 'RLS-X-001', 'Test', 'EmployeeX', 'rls-x-emp@example.test', current_date),
              ($3, $4, 'RLS-Y-001', 'Test', 'EmployeeY', 'rls-y-emp@example.test', current_date)
       on conflict (id) do nothing`,
      [EMP_X, ORG_X, EMP_Y, ORG_Y],
    );
    await owner.query("commit");
  } catch (err) {
    await owner.query("rollback");
    throw err;
  }
}

async function asApp(fn: (c: Client) => Promise<void>): Promise<void> {
  const client = new Client({ connectionString: APP_URL });
  await client.connect();
  try {
    await fn(client);
  } finally {
    await client.end();
  }
}

async function setSession(
  c: Client,
  ctx: { orgId?: string; userId?: string; role?: string },
): Promise<void> {
  await c.query("select set_config('app.org_id', $1, false)", [ctx.orgId ?? ""]);
  await c.query("select set_config('app.user_id', $1, false)", [ctx.userId ?? ""]);
  await c.query("select set_config('app.role', $1, false)", [ctx.role ?? ""]);
  await c.query("select set_config('app.employee_id', $1, false)", [""]);
  await c.query("select set_config('app.is_platform_admin', $1, false)", ["false"]);
}

async function main(): Promise<void> {
  const owner = new Client({ connectionString: OWNER_URL });
  await owner.connect();
  await setFixtures(owner);

  try {
    await asApp(async (c) => {
      const { rows } = await c.query("select id from public.organizations");
      check(
        "no session context -> 0 organizations visible",
        rows.length === 0,
        `got ${rows.length}`,
      );
    });

    await asApp(async (c) => {
      await setSession(c, { orgId: "ffffffff-ffff-ffff-ffff-ffffffffffff" });
      const { rows } = await c.query("select id from public.organizations");
      check("bogus org_id -> 0 organizations visible", rows.length === 0, `got ${rows.length}`);
    });

    await asApp(async (c) => {
      await setSession(c, { orgId: ORG_X });
      const { rows } = await c.query("select id from public.organizations");
      check(
        "org_id = X -> exactly org X visible, nothing else",
        rows.length === 1 && rows[0].id === ORG_X,
        JSON.stringify(rows),
      );
    });

    await asApp(async (c) => {
      await setSession(c, { orgId: ORG_X, role: "org_admin" });
      const { rows } = await c.query("select id, org_id from public.employees");
      check(
        "org_id = X, role org_admin -> only employee X visible (not Y)",
        rows.length === 1 && rows[0].id === EMP_X,
        JSON.stringify(rows),
      );
    });

    await asApp(async (c) => {
      await setSession(c, { orgId: ORG_Y, role: "org_admin" });
      const { rows } = await c.query("select id, org_id from public.employees");
      check(
        "org_id = Y, role org_admin -> only employee Y visible (not X)",
        rows.length === 1 && rows[0].id === EMP_Y,
        JSON.stringify(rows),
      );
    });

    await asApp(async (c) => {
      await setSession(c, { orgId: ORG_X, role: "org_admin" });
      const { rows } = await c.query("select id from public.employees where org_id = $1", [ORG_Y]);
      check(
        "session scoped to X, query explicitly filters to Y -> still 0 rows",
        rows.length === 0,
        `got ${rows.length}`,
      );
    });
  } finally {
    await owner.end();
  }

  if (failures > 0) {
    console.error(`\n${failures} check(s) failed. RLS is NOT correctly isolating tenants.`);
    process.exit(1);
  }
  console.log("\nAll checks passed. RLS isolates tenants under the glix_app runtime role.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
