import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

let app: FastifyInstance;
const createdTemplateIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  if (createdTemplateIds.length > 0) {
    const pool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
    await pool.query("delete from public.notification_templates where id = any($1::uuid[])", [
      createdTemplateIds,
    ]);
    await pool.end();
  }
  await app.close();
});

describe("settings routes", () => {
  it("fetches and updates organization profile", async () => {
    // 1. Get profile
    const getRes = await app.inject({
      method: "GET",
      url: "/v1/settings/profile",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(getRes.statusCode).toBe(200);
    const org = getRes.json().data;
    expect(org.id).toBeDefined();
    expect(org.currency).toBeDefined();

    // 2. Update profile
    const updateRes = await app.inject({
      method: "PUT",
      url: "/v1/settings/profile",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        industry: "Information Technology",
        phone: "+971501234567",
      },
    });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.json().data.industry).toBe("Information Technology");
    expect(updateRes.json().data.phone).toBe("+971501234567");
  });

  it("fetches role permissions matrix", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/settings/roles",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    const matrix = res.json().data;
    expect(Array.isArray(matrix)).toBe(true);
    expect(matrix.length).toBeGreaterThanOrEqual(4);
    const adminRole = matrix.find((m: { role: string }) => m.role === "org_admin");
    expect(adminRole).toBeDefined();
    expect(adminRole.permissions).toContain("settings:profile:write");
  });

  it("saves and manages notification template overrides", async () => {
    // 1. Save override
    const saveRes = await app.inject({
      method: "POST",
      url: "/v1/settings/templates",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        channel: "email",
        key: "custom_welcome_message",
        subject: "Welcome to Acme Corp Portal!",
        body: "Hello {{employee_name}}, welcome to our workspace.",
        isActive: true,
      },
    });
    expect(saveRes.statusCode).toBe(201);
    const template = saveRes.json().data;
    expect(template.id).toBeDefined();
    expect(template.isCustomOverride).toBe(true);
    createdTemplateIds.push(template.id);

    // 2. List templates
    const listRes = await app.inject({
      method: "GET",
      url: "/v1/settings/templates?channel=email",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().data.length).toBeGreaterThanOrEqual(1);

    // 3. Delete override
    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/v1/settings/templates/${template.id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(deleteRes.statusCode).toBe(200);
  });
});
