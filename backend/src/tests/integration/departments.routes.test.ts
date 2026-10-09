import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

let app: FastifyInstance;
const createdDepartmentIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  if (createdDepartmentIds.length > 0) {
    const pool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
    await pool.query("delete from public.departments where id = any($1::uuid[])", [
      createdDepartmentIds,
    ]);
    await pool.end();
  }
  await app.close();
});

describe("departments routes", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/departments" });
    expect(res.statusCode).toBe(401);
  });

  it("lists departments scoped to the caller's org", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/departments",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().data)).toBe(true);
  });

  it("creates, reads, updates, and deletes a department as org_admin", async () => {
    const uniqueName = `SecOps ${Date.now()}`;
    const updatedName = `CyberSec ${Date.now()}`;

    // 1. Create
    const createRes = await app.inject({
      method: "POST",
      url: "/v1/departments",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        name: uniqueName,
        code: "SEC-OPS",
      },
    });
    expect(createRes.statusCode).toBe(201);
    const dept = createRes.json().data;
    expect(dept.id).toBeDefined();
    expect(dept.name).toBe(uniqueName);
    expect(dept.code).toBe("SEC-OPS");
    createdDepartmentIds.push(dept.id);

    // 2. List
    const listRes = await app.inject({
      method: "GET",
      url: `/v1/departments?search=${encodeURIComponent(uniqueName)}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().data.length).toBeGreaterThanOrEqual(1);

    // 3. Update
    const updateRes = await app.inject({
      method: "PUT",
      url: `/v1/departments/${dept.id}`,
      headers: authHeader({ role: "org_admin" }),
      payload: {
        name: updatedName,
        code: "C-SEC",
      },
    });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.json().data.name).toBe(updatedName);
    expect(updateRes.json().data.code).toBe("C-SEC");

    // 4. Delete
    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/v1/departments/${dept.id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(deleteRes.statusCode).toBe(200);
  });

  it("denies department creation for org_viewer", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/departments",
      headers: authHeader({ role: "org_viewer" }),
      payload: {
        name: `Denied Dept ${Date.now()}`,
      },
    });
    expect(res.statusCode).toBe(403);
  });
});
