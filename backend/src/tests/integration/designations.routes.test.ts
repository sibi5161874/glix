import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

let app: FastifyInstance;
const createdDesignationIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  if (createdDesignationIds.length > 0) {
    const pool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
    await pool.query("delete from public.designations where id = any($1::uuid[])", [
      createdDesignationIds,
    ]);
    await pool.end();
  }
  await app.close();
});

describe("designations routes", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/designations" });
    expect(res.statusCode).toBe(401);
  });

  it("lists designations scoped to the caller's org", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/designations",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().data)).toBe(true);
  });

  it("creates, lists, updates, and deletes a designation as org_admin", async () => {
    const title = `Staff Cloud Architect ${Date.now()}`;
    const updatedTitle = `Principal Cloud Architect ${Date.now()}`;

    // 1. Create
    const createRes = await app.inject({
      method: "POST",
      url: "/v1/designations",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        title,
        level: 5,
      },
    });
    expect(createRes.statusCode).toBe(201);
    const item = createRes.json().data;
    expect(item.id).toBeDefined();
    expect(item.title).toBe(title);
    expect(item.level).toBe(5);
    createdDesignationIds.push(item.id);

    // 2. List
    const listRes = await app.inject({
      method: "GET",
      url: "/v1/designations?search=Cloud",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().data.length).toBeGreaterThanOrEqual(1);

    // 3. Update
    const updateRes = await app.inject({
      method: "PUT",
      url: `/v1/designations/${item.id}`,
      headers: authHeader({ role: "org_admin" }),
      payload: {
        title: updatedTitle,
        level: 6,
      },
    });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.json().data.title).toBe(updatedTitle);
    expect(updateRes.json().data.level).toBe(6);

    // 4. Delete
    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/v1/designations/${item.id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(deleteRes.statusCode).toBe(200);
  });
});
