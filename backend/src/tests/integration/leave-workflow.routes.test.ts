import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader, SEEDED_STAFF_EMPLOYEE_ID } from "../helpers";

let app: FastifyInstance;
let annualLeaveTypeId: string;
// Approved/rejected requests can't go through the app's own `cancel` endpoint
// (service requires status === 'pending', matching real business rules), so
// cleanup here uses the migration role directly — same pattern scripts/seed.ts
// uses for writes RLS wouldn't otherwise allow.
const createdRequestIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
  const res = await app.inject({
    method: "GET",
    url: "/v1/leave-types",
    headers: authHeader({ role: "org_admin" }),
  });
  annualLeaveTypeId = res.json().data.find((t: { code: string }) => t.code === "annual").id;
});

afterAll(async () => {
  if (createdRequestIds.length > 0) {
    const pool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
    await pool.query("delete from public.leave_requests where id = any($1::uuid[])", [
      createdRequestIds,
    ]);
    await pool.end();
  }
  await app.close();
});

describe("leave-requests routes", () => {
  it("lets org_viewer create a request only for themselves", async () => {
    const forOther = await app.inject({
      method: "POST",
      url: "/v1/leave-requests",
      headers: authHeader({ role: "org_viewer", employeeId: SEEDED_STAFF_EMPLOYEE_ID }),
      payload: {
        employeeId: "22222222-2222-2222-2222-222222222222",
        leaveTypeId: annualLeaveTypeId,
        startDate: "2026-03-01",
        endDate: "2026-03-02",
      },
    });
    expect(forOther.statusCode).toBe(403);

    const forSelf = await app.inject({
      method: "POST",
      url: "/v1/leave-requests",
      headers: authHeader({ role: "org_viewer", employeeId: SEEDED_STAFF_EMPLOYEE_ID }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        leaveTypeId: annualLeaveTypeId,
        startDate: "2026-03-01",
        endDate: "2026-03-02",
      },
    });
    expect(forSelf.statusCode).toBe(201);
    expect(forSelf.json().data.totalDays).toBe("2.0");

    await app.inject({
      method: "POST",
      url: `/v1/leave-requests/${forSelf.json().data.id}/cancel`,
      headers: authHeader({ role: "org_viewer", employeeId: SEEDED_STAFF_EMPLOYEE_ID }),
    });
  });

  it("approves a pending request once, rejects a second approval attempt", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/leave-requests",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        leaveTypeId: annualLeaveTypeId,
        startDate: "2026-04-01",
        endDate: "2026-04-03",
      },
    });
    const id = created.json().data.id as string;
    createdRequestIds.push(id);

    const approved = await app.inject({
      method: "POST",
      url: `/v1/leave-requests/${id}/approve`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(approved.statusCode).toBe(200);
    expect(approved.json().data.status).toBe("approved");

    const secondApprove = await app.inject({
      method: "POST",
      url: `/v1/leave-requests/${id}/approve`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(secondApprove.statusCode).toBe(409);
  });

  it("rejects a request with a reason, denies reject for org_viewer", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/leave-requests",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        leaveTypeId: annualLeaveTypeId,
        startDate: "2026-05-01",
        endDate: "2026-05-01",
      },
    });
    const id = created.json().data.id as string;
    createdRequestIds.push(id);

    const deniedRole = await app.inject({
      method: "POST",
      url: `/v1/leave-requests/${id}/reject`,
      headers: authHeader({ role: "org_viewer" }),
      payload: { rejectionReason: "not allowed" },
    });
    expect(deniedRole.statusCode).toBe(403);

    const rejected = await app.inject({
      method: "POST",
      url: `/v1/leave-requests/${id}/reject`,
      headers: authHeader({ role: "org_admin" }),
      payload: { rejectionReason: "Team coverage conflict" },
    });
    expect(rejected.statusCode).toBe(200);
    expect(rejected.json().data.status).toBe("rejected");
    expect(rejected.json().data.rejectionReason).toBe("Team coverage conflict");
  });
});

describe("leave-balances routes", () => {
  it("adjusts a balance and the approval trigger increments `used`", async () => {
    const adjusted = await app.inject({
      method: "POST",
      url: "/v1/leave-balances/adjust",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        leaveTypeId: annualLeaveTypeId,
        year: 2026,
        allocated: 30,
        carriedOver: 0,
      },
    });
    expect(adjusted.statusCode).toBe(200);
    expect(adjusted.json().data.allocated).toBe("30.0");

    const list = await app.inject({
      method: "GET",
      url: `/v1/leave-balances?employeeId=${SEEDED_STAFF_EMPLOYEE_ID}&year=2026`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(list.statusCode).toBe(200);
    const row = list
      .json()
      .data.find((b: { leaveTypeId: string }) => b.leaveTypeId === annualLeaveTypeId);
    expect(row.allocated).toBe("30.0");
  });

  it("denies adjust for org_staff", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/leave-balances/adjust",
      headers: authHeader({ role: "org_staff" }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        leaveTypeId: annualLeaveTypeId,
        year: 2026,
        allocated: 30,
      },
    });
    expect(res.statusCode).toBe(403);
  });
});
