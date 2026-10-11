import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader, SEEDED_STAFF_USER_ID } from "../helpers";

let app: FastifyInstance;
const createdTicketIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
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

describe("POST /v1/support", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "POST", url: "/v1/support" });
    expect(res.statusCode).toBe(401);
  });

  it("creates a ticket for the submitting user", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/support",
      headers: authHeader({ role: "org_staff", sub: SEEDED_STAFF_USER_ID }),
      payload: {
        subject: "Can't export reports",
        body: "The CSV export button does nothing on Firefox.",
        category: "bug",
        priority: "high",
      },
    });
    expect(res.statusCode).toBe(201);
    const ticket = res.json().data;
    expect(ticket.status).toBe("open");
    expect(ticket.category).toBe("bug");
    createdTicketIds.push(ticket.id);
  });
});

describe("GET /v1/support/mine", () => {
  it("returns only the caller's own tickets", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/support/mine",
      headers: authHeader({ role: "org_staff", sub: SEEDED_STAFF_USER_ID }),
    });
    expect(res.statusCode).toBe(200);
    const page = res.json().data;
    expect(page.items.every((t: { userId: string }) => t.userId === SEEDED_STAFF_USER_ID)).toBe(
      true,
    );
    expect(page.items.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /v1/support", () => {
  it("denies org_staff (support:read is admin-only)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/support",
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(403);
  });

  it("lists every ticket in the org for org_admin", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/support",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.total).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /v1/support/:id", () => {
  it("lets the submitter view their own ticket", async () => {
    const id = createdTicketIds[0];
    const res = await app.inject({
      method: "GET",
      url: `/v1/support/${id}`,
      headers: authHeader({ role: "org_staff", sub: SEEDED_STAFF_USER_ID }),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.id).toBe(id);
  });

  it("hides another non-admin employee's ticket (RLS makes it invisible, not just forbidden)", async () => {
    const id = createdTicketIds[0];
    const res = await app.inject({
      method: "GET",
      url: `/v1/support/${id}`,
      headers: authHeader({ role: "org_staff", sub: "99999999-9999-9999-9999-999999999999" }),
    });
    expect(res.statusCode).toBe(404);
  });

  it("lets org_admin view any ticket in the org", async () => {
    const id = createdTicketIds[0];
    const res = await app.inject({
      method: "GET",
      url: `/v1/support/${id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
  });
});
