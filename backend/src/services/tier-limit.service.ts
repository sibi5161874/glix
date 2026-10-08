import type { PoolClient } from "pg";
import { getTier } from "@app/shared/config";
import { ConflictError } from "../utils/errors";

/**
 * Shared tier-limit enforcement (RULES.md §9 — always server-side, never
 * trust the client). Originally lived only in employee.service.ts as
 * `assertWithinEmployeeLimit`; pulled out so Documents' storage limit (and
 * any future per-tier count) doesn't reimplement the same org-lookup +
 * limit-check + ConflictError pattern.
 *
 * Checks `current + aboutToAdd <= limit` directly rather than going through
 * `shared/config/tiers.config.ts`'s `isWithinLimit` — that helper's
 * `current < limit` contract only composes correctly with a "-1" adjustment
 * for *integer counts* (employees: `current + aboutToAdd - 1 < limit`). For a
 * continuous quantity like storage MB, that same "-1" is simply wrong (it
 * would let an upload through up to ~1MB over the real limit). Reading the
 * tier's raw limit via `getTier` and comparing directly is correct for both.
 *
 * Must run on the same tenant-scoped `client` the caller's insert uses — a
 * separate pool connection has no `app.org_id` session var set, so RLS would
 * hide every row and `current` would silently read as zero.
 */
export async function assertWithinTierLimit(
  client: PoolClient,
  orgId: string,
  metric: "employees" | "storageMb",
  current: number,
  aboutToAdd: number,
  label: string,
): Promise<void> {
  const { rows } = await client.query("select tier from public.organizations where id = $1", [
    orgId,
  ]);
  const tierSlug = rows[0]?.tier ?? "free";
  const tier = getTier(tierSlug);
  const limit = metric === "employees" ? tier?.maxEmployees : tier?.maxStorageMb;

  if (limit !== undefined && limit !== 0 && current + aboutToAdd > limit) {
    throw new ConflictError(
      `${label} limit reached for the ${tierSlug} plan. Upgrade to continue.`,
    );
  }
}
