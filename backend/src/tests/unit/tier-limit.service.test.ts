import { describe, it, expect, vi } from "vitest";
import type { PoolClient } from "pg";
import { assertWithinTierLimit } from "../../services/tier-limit.service";
import { ConflictError } from "../../utils/errors";

function mockClient(tier: string): PoolClient {
  return {
    query: vi.fn().mockResolvedValue({ rows: [{ tier }] }),
  } as unknown as PoolClient;
}

describe("assertWithinTierLimit", () => {
  it("allows adding up to exactly the limit (free tier: 25 employees)", async () => {
    const client = mockClient("free");
    await expect(
      assertWithinTierLimit(client, "org-1", "employees", 24, 1, "Employee"),
    ).resolves.toBeUndefined();
  });

  it("rejects the add that would exceed the limit", async () => {
    const client = mockClient("free");
    await expect(
      assertWithinTierLimit(client, "org-1", "employees", 25, 1, "Employee"),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("treats a zero limit (enterprise) as unlimited", async () => {
    const client = mockClient("enterprise");
    await expect(
      assertWithinTierLimit(client, "org-1", "employees", 10_000, 1, "Employee"),
    ).resolves.toBeUndefined();
  });

  it("does the math correctly for a continuous metric (storage MB), not the integer '-1' shortcut", async () => {
    // Free tier: 500MB. At 499.6MB used, a 0.5MB file pushes total to
    // 500.1MB — over the limit. The old `current + aboutToAdd - 1 < limit`
    // formula (correct only for integer counts) would have wrongly allowed
    // this, since 499.6 + 0.5 - 1 = 499.1 < 500.
    const client = mockClient("free");
    await expect(
      assertWithinTierLimit(client, "org-1", "storageMb", 499.6, 0.5, "Storage"),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("allows a storage add that fits exactly", async () => {
    const client = mockClient("free");
    await expect(
      assertWithinTierLimit(client, "org-1", "storageMb", 499, 1, "Storage"),
    ).resolves.toBeUndefined();
  });

  it("defaults to the free tier when the org row is missing", async () => {
    const client = { query: vi.fn().mockResolvedValue({ rows: [] }) } as unknown as PoolClient;
    await expect(
      assertWithinTierLimit(client, "org-1", "employees", 25, 1, "Employee"),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
