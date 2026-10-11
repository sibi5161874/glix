import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

describe("Platform routes (/v1/platform/*)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /v1/platform/overview", () => {
    it("denies unauthenticated caller with 401", async () => {
      const res = await app.inject({ method: "GET", url: "/v1/platform/overview" });
      expect(res.statusCode).toBe(401);
    });

    it("denies regular org_admin with 403", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/v1/platform/overview",
        headers: authHeader({ role: "org_admin", isPlatformAdmin: false }),
      });
      expect(res.statusCode).toBe(403);
    });

    it("returns platform stats for platform admin", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/v1/platform/overview",
        headers: authHeader({ isPlatformAdmin: true }),
      });
      expect(res.statusCode).toBe(200);
      const data = res.json().data;
      expect(typeof data.orgCount).toBe("number");
      expect(typeof data.activeSubscriptionsCount).toBe("number");
      expect(typeof data.mrrAed).toBe("number");
      expect(typeof data.openTicketsCount).toBe("number");
      expect(Array.isArray(data.recentOrgs)).toBe(true);
    });
  });

  describe("GET /v1/platform/organizations and POST", () => {
    it("lists organizations across the platform", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/v1/platform/organizations",
        headers: authHeader({ isPlatformAdmin: true }),
      });
      expect(res.statusCode).toBe(200);
      const data = res.json().data;
      expect(Array.isArray(data.items)).toBe(true);
      expect(data.items.length).toBeGreaterThan(0);
      expect(data.items[0]).toHaveProperty("name");
      expect(data.items[0]).toHaveProperty("slug");
      expect(data.items[0]).toHaveProperty("planName");
    });

    it("creates a new organization via platform endpoint", async () => {
      const plansRes = await app.inject({
        method: "GET",
        url: "/v1/platform/plans",
        headers: authHeader({ isPlatformAdmin: true }),
      });
      const plan = plansRes.json().data[0];

      const res = await app.inject({
        method: "POST",
        url: "/v1/platform/organizations",
        headers: authHeader({ isPlatformAdmin: true }),
        payload: {
          name: "E2E Platform Org",
          slug: `e2e-plat-${Date.now()}`,
          currency: "AED",
          planId: plan.id,
        },
      });
      expect(res.statusCode).toBe(201);
      const createdOrgId = res.json().data.id;
      expect(createdOrgId).toBeDefined();
    });
  });

  describe("GET /v1/platform/settings and PUT", () => {
    it("upserts and retrieves platform settings", async () => {
      const putRes = await app.inject({
        method: "PUT",
        url: "/v1/platform/settings/landing.banner",
        headers: authHeader({ isPlatformAdmin: true }),
        payload: {
          value: { enabled: true, title: "Special Offer", discount: 20 },
        },
      });
      expect(putRes.statusCode).toBe(200);

      const getRes = await app.inject({
        method: "GET",
        url: "/v1/platform/settings/landing.banner",
        headers: authHeader({ isPlatformAdmin: true }),
      });
      expect(getRes.statusCode).toBe(200);
      expect(getRes.json().data).toEqual({ enabled: true, title: "Special Offer", discount: 20 });
    });
  });

  describe("GET /v1/platform/team", () => {
    it("lists platform team members", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/v1/platform/team",
        headers: authHeader({ isPlatformAdmin: true }),
      });
      expect(res.statusCode).toBe(200);
      const data = res.json().data;
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
