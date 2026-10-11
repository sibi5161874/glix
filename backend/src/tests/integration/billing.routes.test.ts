import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader, SEEDED_ORG_ID } from "../helpers";

let app: FastifyInstance;
let migratePool: Pool;
let originalPlanId: string;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
  migratePool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
  const res = await migratePool.query("select plan_id from public.organizations where id = $1", [
    SEEDED_ORG_ID,
  ]);
  originalPlanId = res.rows[0]?.["plan_id"] as string;
});

afterAll(async () => {
  // Restore the seeded org's plan and wipe every subscription/invoice this
  // suite created — other tests (and the browser-verified "Tier: Pro" badge)
  // depend on the seeded org staying on its original plan.
  await migratePool.query("update public.organizations set plan_id = $1 where id = $2", [
    originalPlanId,
    SEEDED_ORG_ID,
  ]);
  await migratePool.query("delete from public.subscriptions where org_id = $1", [SEEDED_ORG_ID]);
  await migratePool.query("delete from public.invoices where org_id = $1", [SEEDED_ORG_ID]);
  await migratePool.end();
  await app.close();
});

describe("GET /v1/billing/plans", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/billing/plans" });
    expect(res.statusCode).toBe(401);
  });

  it("denies org_viewer (billing:read is admin-only)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/billing/plans",
      headers: authHeader({ role: "org_viewer" }),
    });
    expect(res.statusCode).toBe(403);
  });

  it("lists the 3 seeded active plans for org_admin", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/billing/plans",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    const plans = res.json().data;
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThanOrEqual(3);
    expect(plans.map((p: { slug: string }) => p.slug)).toEqual(
      expect.arrayContaining(["free", "pro", "enterprise"]),
    );
  });
});

describe("POST /v1/billing/change-tier", () => {
  it("denies org_viewer (billing:update is admin-only)", async () => {
    const plansRes = await app.inject({
      method: "GET",
      url: "/v1/billing/plans",
      headers: authHeader({ role: "org_admin" }),
    });
    const freePlan = plansRes.json().data.find((p: { slug: string }) => p.slug === "free");

    const res = await app.inject({
      method: "POST",
      url: "/v1/billing/change-tier",
      headers: authHeader({ role: "org_viewer" }),
      payload: { planId: freePlan.id },
    });
    expect(res.statusCode).toBe(403);
  });

  it("changes the org's plan, records a subscription and a paid invoice", async () => {
    const plansRes = await app.inject({
      method: "GET",
      url: "/v1/billing/plans",
      headers: authHeader({ role: "org_admin" }),
    });
    const enterprisePlan = plansRes
      .json()
      .data.find((p: { slug: string }) => p.slug === "enterprise");

    const changeRes = await app.inject({
      method: "POST",
      url: "/v1/billing/change-tier",
      headers: authHeader({ role: "org_admin" }),
      payload: { planId: enterprisePlan.id },
    });
    expect(changeRes.statusCode).toBe(200);
    const subscription = changeRes.json().data;
    expect(subscription.planId).toBe(enterprisePlan.id);
    expect(subscription.planSlug).toBe("enterprise");
    expect(subscription.status).toBe("active");
    expect(subscription.gateway).toBe("manual");

    const subRes = await app.inject({
      method: "GET",
      url: "/v1/billing/subscription",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(subRes.statusCode).toBe(200);
    expect(subRes.json().data.planSlug).toBe("enterprise");

    const invoicesRes = await app.inject({
      method: "GET",
      url: "/v1/billing/invoices",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(invoicesRes.statusCode).toBe(200);
    const invoices = invoicesRes.json().data;
    expect(invoices.total).toBeGreaterThanOrEqual(1);
    expect(invoices.items[0].status).toBe("paid");
    expect(invoices.items[0].gateway).toBe("manual");
  });

  it("rejects changing to the plan the org is already on", async () => {
    const subRes = await app.inject({
      method: "GET",
      url: "/v1/billing/subscription",
      headers: authHeader({ role: "org_admin" }),
    });
    const currentPlanId = subRes.json().data.planId;

    const res = await app.inject({
      method: "POST",
      url: "/v1/billing/change-tier",
      headers: authHeader({ role: "org_admin" }),
      payload: { planId: currentPlanId },
    });
    expect(res.statusCode).toBe(409);
  });
});
