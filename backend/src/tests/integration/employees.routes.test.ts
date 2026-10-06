import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../app";
import { authHeader, SEEDED_STAFF_EMPLOYEE_ID } from "../helpers";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

function newEmployeePayload(suffix: string): Record<string, unknown> {
  return {
    employeeCode: `TEST-${suffix}`,
    firstName: "Test",
    lastName: "Employee",
    email: `test.${suffix.toLowerCase()}@acme.test`,
    joiningDate: "2026-01-01",
    basicSalary: 5000,
  };
}

describe("employees routes", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/employees" });
    expect(res.statusCode).toBe(401);
  });

  it("lists employees for an org_admin, including the seeded employee", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/employees",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.items.some((e: { id: string }) => e.id === SEEDED_STAFF_EMPLOYEE_ID)).toBe(
      true,
    );
  });

  it("denies create for org_staff (missing employees:create permission is granted, but org_viewer is not)", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/employees",
      headers: authHeader({ role: "org_viewer" }),
      payload: newEmployeePayload("DENY1"),
    });
    expect(res.statusCode).toBe(403);
  });

  it("validates input with Zod before hitting the DB", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/employees",
      headers: authHeader({ role: "org_admin" }),
      payload: { firstName: "Missing fields" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().code).toBe("VALIDATION_ERROR");
  });

  it("creates, reads, updates and deletes an employee end-to-end", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/employees",
      headers: authHeader({ role: "org_admin" }),
      payload: newEmployeePayload("CRUD1"),
    });
    expect(created.statusCode).toBe(201);
    const id = created.json().data.id as string;

    const fetched = await app.inject({
      method: "GET",
      url: `/v1/employees/${id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(fetched.statusCode).toBe(200);
    expect(fetched.json().data.employeeCode).toBe("TEST-CRUD1");

    const updated = await app.inject({
      method: "PUT",
      url: `/v1/employees/${id}`,
      headers: authHeader({ role: "org_admin" }),
      payload: { status: "on_leave" },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().data.status).toBe("on_leave");

    const deleted = await app.inject({
      method: "DELETE",
      url: `/v1/employees/${id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(deleted.statusCode).toBe(200);

    const afterDelete = await app.inject({
      method: "GET",
      url: `/v1/employees/${id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(afterDelete.statusCode).toBe(404);
  });

  it("rejects a duplicate employee code within the same org", async () => {
    const payload = newEmployeePayload("DUPE1");
    const first = await app.inject({
      method: "POST",
      url: "/v1/employees",
      headers: authHeader({ role: "org_admin" }),
      payload,
    });
    expect(first.statusCode).toBe(201);

    const second = await app.inject({
      method: "POST",
      url: "/v1/employees",
      headers: authHeader({ role: "org_admin" }),
      payload: { ...payload, email: "different.dupe1@acme.test" },
    });
    expect(second.statusCode).toBe(409);

    await app.inject({
      method: "DELETE",
      url: `/v1/employees/${first.json().data.id}`,
      headers: authHeader({ role: "org_admin" }),
    });
  });

  it("reports a bodyless JSON-content-type request as 400, not a raw 500", async () => {
    // Regression: real browsers (via apiFetch) used to send `Content-Type:
    // application/json` on every request, including bodyless DELETEs. That
    // combination is genuinely malformed (the frontend fix is to not send
    // the header without a body) — but Fastify's own parser error used to
    // fall through sendError's generic branch and surface as an opaque 500
    // instead of the 400 it actually is. See utils/http.ts's
    // isFastifyClientError.
    const created = await app.inject({
      method: "POST",
      url: "/v1/employees",
      headers: authHeader({ role: "org_admin" }),
      payload: newEmployeePayload("NOBODY1"),
    });
    const id = created.json().data.id as string;

    const deleted = await app.inject({
      method: "DELETE",
      url: `/v1/employees/${id}`,
      headers: { ...authHeader({ role: "org_admin" }), "content-type": "application/json" },
    });
    expect(deleted.statusCode).toBe(400);
    expect(deleted.json().code).toBe("FST_ERR_CTP_EMPTY_JSON_BODY");

    await app.inject({
      method: "DELETE",
      url: `/v1/employees/${id}`,
      headers: authHeader({ role: "org_admin" }),
    });
  });

  it("enforces tenant isolation — a forged orgId cannot see another org's employee", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/v1/employees/${SEEDED_STAFF_EMPLOYEE_ID}`,
      headers: authHeader({ role: "org_admin", orgId: "99999999-9999-9999-9999-999999999999" }),
    });
    expect(res.statusCode).toBe(404);
  });

  it("exports an XLSX workbook for org_admin", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/employees/export",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("spreadsheetml");
  });
});
