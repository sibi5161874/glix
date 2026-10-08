import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /v1/reports/*", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/reports/employees" });
    expect(res.statusCode).toBe(401);
  });

  it("denies org_viewer (reports:read is admin/staff only)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/employees",
      headers: authHeader({ role: "org_viewer" }),
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns employee demographics including the seeded employees", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/employees",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    const data = res.json().data;
    expect(data.totalEmployees).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(data.byDepartment)).toBe(true);
    expect(Array.isArray(data.byStatus)).toBe(true);
  });

  it("returns leave utilization for a given year", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/leaves?year=2026",
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(200);
    const data = res.json().data;
    expect(data.year).toBe(2026);
    expect(Array.isArray(data.byLeaveType)).toBe(true);
    expect(data.byLeaveType.length).toBeGreaterThanOrEqual(6); // 6 seeded leave types
  });

  it("returns document expiry summary and type breakdown", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/documents",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    const data = res.json().data;
    expect(typeof data.summary.total).toBe("number");
    expect(Array.isArray(data.byType)).toBe(true);
  });

  it("returns loan balances summary and status breakdown", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/loans",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    const data = res.json().data;
    expect(typeof data.summary.total).toBe("number");
    expect(Array.isArray(data.byStatus)).toBe(true);
  });
});

describe("GET /v1/reports/*/export", () => {
  it.each(["csv", "xlsx", "pdf"] as const)(
    "exports the employees report as %s with the right content-type",
    async (format) => {
      const res = await app.inject({
        method: "GET",
        url: `/v1/reports/employees/export?format=${format}`,
        headers: authHeader({ role: "org_admin" }),
      });
      expect(res.statusCode).toBe(200);
      const expectedType =
        format === "csv" ? "text/csv" : format === "pdf" ? "application/pdf" : "spreadsheetml";
      expect(res.headers["content-type"]).toContain(expectedType);
      expect(res.rawPayload.length).toBeGreaterThan(0);
    },
  );

  it("denies export for a role without reports:export (none configured, but org_viewer lacks reports:read entirely)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/loans/export?format=csv",
      headers: authHeader({ role: "org_viewer" }),
    });
    expect(res.statusCode).toBe(403);
  });

  it("defaults to xlsx when no format is given", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/documents/export",
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("spreadsheetml");
  });
});
