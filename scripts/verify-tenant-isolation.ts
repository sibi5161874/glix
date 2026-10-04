/**
 * Sanity check: a user from Org A must NOT see Org B's rows.
 * Run: pnpm tsx scripts/verify-tenant-isolation.ts
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"]!;
const ANON_KEY = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!;

async function main(): Promise<void> {
  const client = createClient(SUPABASE_URL, ANON_KEY);

  const { error: signInErr } = await client.auth.signInWithPassword({
    email: process.env["TEST_USER_EMAIL"]!,
    password: process.env["TEST_USER_PASSWORD"]!,
  });
  if (signInErr) throw signInErr;

  const { data, error } = await client.from("organizations").select("*");
  if (error) throw error;

  const orgCount = data?.length ?? 0;
  // eslint-disable-next-line no-console
  console.log(`Visible organizations for this user: ${orgCount}`);

  if (orgCount > 1) {
    throw new Error("❌ TENANT ISOLATION FAILED — user sees multiple orgs");
  }
  // eslint-disable-next-line no-console
  console.log("✅ Tenant isolation OK");
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
