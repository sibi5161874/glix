import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

let app: FastifyInstance;
let ticketId: string;
const createdTicketIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();

  const createRes = await app.inject({
    method: "POST",
    url: "/v1/support",
    headers: authHeader({ role: "org_staff" }),
    payload: {
      subject: "Platform-support fixture ticket",
      body: "Created by platform-support.routes.test.ts for cross-org listing checks.",
      category: "technical",
      priority: "low",
    },
  });
  ticketId = createRes.json().data.id;
  createdTicketIds.push(ticketId);
});

afterAll(async () => {
  if (createdTicketIds.length > 0) {
    const pool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
    await pool.query("delete from public.support_tickets where id = any($1::uuid[])", [
      createdTicketIds,
    ]);
    await pool.end();
  }
  await app.close();
});

describe("GET /v1/platform/support", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/platform/support" });
    expect(res.statusCode).toBe(401);
  });

  it("denies a regular org_admin (platform:support:read is super_admin-only)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/platform/support",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(403);
  });

  it("lists tickets across every org for a platform admin", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/platform/support",
      headers: authHeader({ isPlatformAdmin: true }),
    });
    expect(res.statusCode).toBe(200);
    const page = res.json().data;
    expect(page.items.some((t: { id: string }) => t.id === ticketId)).toBe(true);
  });
});

describe("PUT /v1/platform/support/:id", () => {
  it("denies a regular org_admin (platform:support:write is super_admin-only)", async () => {
    const res = await app.inject({
      method: "PUT",
      url: `/v1/platform/support/${ticketId}`,
      headers: authHeader({ role: "org_admin" }),
      payload: { status: "in_progress" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("lets a platform admin update status across orgs", async () => {
    const res = await app.inject({
      method: "PUT",
      url: `/v1/platform/support/${ticketId}`,
      headers: authHeader({ isPlatformAdmin: true }),
      payload: { status: "in_progress" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.status).toBe("in_progress");
  });
});
