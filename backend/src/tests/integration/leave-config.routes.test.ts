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

describe("leave-types routes", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/leave-types" });
    expect(res.statusCode).toBe(401);
  });

  it("lists the seeded leave types", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/leave-types",
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.length).toBeGreaterThanOrEqual(6);
  });

  it("denies write for org_staff", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/leave-types",
      headers: authHeader({ role: "org_staff" }),
      payload: { name: "Study Leave", code: "study", daysPerYear: 5 },
    });
    expect(res.statusCode).toBe(403);
  });

  it("creates, updates and deletes a leave type as org_admin", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/leave-types",
      headers: authHeader({ role: "org_admin" }),
      payload: { name: "Study Leave", code: "study_test", daysPerYear: 5 },
    });
    expect(created.statusCode).toBe(201);
    const id = created.json().data.id as string;

    const updated = await app.inject({
      method: "PUT",
      url: `/v1/leave-types/${id}`,
      headers: authHeader({ role: "org_admin" }),
      payload: { daysPerYear: 7 },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().data.daysPerYear).toBe("7.0");

    const deleted = await app.inject({
      method: "DELETE",
      url: `/v1/leave-types/${id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(deleted.statusCode).toBe(200);
  });
});

describe("holidays routes", () => {
  it("creates, lists by year, and deletes a holiday", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/holidays",
      headers: authHeader({ role: "org_admin" }),
      payload: { name: "Test Holiday", date: "2026-12-25" },
    });
    expect(created.statusCode).toBe(201);
    const id = created.json().data.id as string;

    const list = await app.inject({
      method: "GET",
      url: "/v1/holidays?year=2026",
      headers: authHeader({ role: "org_viewer" }),
    });
    expect(list.statusCode).toBe(200);
    expect(list.json().data.some((h: { id: string }) => h.id === id)).toBe(true);

    await app.inject({
      method: "DELETE",
      url: `/v1/holidays/${id}`,
      headers: authHeader({ role: "org_admin" }),
    });
  });
});
