import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: join(process.cwd(), ".env.local") });
config({ path: join(process.cwd(), ".env") });

const MIGRATIONS_DIR = join(process.cwd(), "db", "migrations");
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL required in environment");

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  await client.query(`
    create table if not exists _migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const applied = new Set(
    (await client.query("select name from _migrations")).rows.map((r) => r.name),
  );

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip ${file}`);
      continue;
    }
    console.log(`apply ${file}`);
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into _migrations (name) values ($1)", [file]);
      await client.query("commit");
    } catch (err) {
      await client.query("rollback");
      throw err;
    }
  }

  await client.end();
  console.log("migrations complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
