import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Client } from "pg";
import { config } from "dotenv";
import argon2 from "argon2";

// Known dev-only password for every seeded user (superadmin, org owner, staff).
// Never used outside local/CI fixtures — db/seed.sql must never run against
// a shared/staging/production database.
const DEV_PASSWORD = "DevPass123!";
// Staff (...0003 / EMP-001) deliberately excluded: it demonstrates the
// employee_code + DOB login path instead, which only applies when the
// linked user has no password_hash set (see auth.service.ts).
const SEEDED_USER_IDS = [
  "00000000-0000-0000-0000-000000000001", // superadmin
  "00000000-0000-0000-0000-000000000002", // Acme owner
];

config({ path: join(process.cwd(), ".env.local") });
config({ path: join(process.cwd(), ".env") });

const SEED_FILE = join(process.cwd(), "db", "seed.sql");
// Seeding inserts directly into tables (users, organizations, employees, ...)
// bypassing app-level flows, so it must run as the owner role — the
// restricted runtime role (glix_app) can't satisfy most insert policies
// directly. See db/migrations/020_roles.sql.
const DATABASE_URL = process.env.DATABASE_URL_MIGRATE ?? process.env.DATABASE_URL;
if (!DATABASE_URL)
  throw new Error("DATABASE_URL_MIGRATE (or DATABASE_URL) required in environment");

async function main() {
  if (!existsSync(SEED_FILE)) {
    console.log("No db/seed.sql found, skipping seed.");
    return;
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("Applying db/seed.sql...");
  const sql = readFileSync(SEED_FILE, "utf-8");
  await client.query("begin");
  try {
    await client.query(sql);
    const passwordHash = await argon2.hash(DEV_PASSWORD, { type: argon2.argon2id });
    await client.query("update public.users set password_hash = $1 where id = any($2::uuid[])", [
      passwordHash,
      SEEDED_USER_IDS,
    ]);
    await client.query("commit");
    console.log("Database seeded successfully.");
    console.log(`Dev login password for seeded users: ${DEV_PASSWORD}`);
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
