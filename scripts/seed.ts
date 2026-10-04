import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: join(process.cwd(), ".env.local") });
config({ path: join(process.cwd(), ".env") });

const SEED_FILE = join(process.cwd(), "db", "seed.sql");
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL required in environment");

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
    await client.query("commit");
    console.log("Database seeded successfully.");
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
