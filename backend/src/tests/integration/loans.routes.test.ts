import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader, SEEDED_STAFF_EMPLOYEE_ID } from "../helpers";

let app: FastifyInstance;
const createdLoanIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  if (createdLoanIds.length > 0) {
    const pool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
    await pool.query("delete from public.loans where id = any($1::uuid[])", [createdLoanIds]);
    await pool.end();
  }
  await app.close();
});

describe("loans routes", () => {
  it("creates a loan request for employee as admin", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/loans",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        principalAmount: 5000,
        monthlyInstallment: 500,
        termMonths: 10,
        startMonth: "2026-04-01",
        reason: "Personal medical expense",
      },
    });

    expect(res.statusCode).toBe(201);
    const data = res.json().data;
    expect(data.id).toBeDefined();
    expect(data.status).toBe("pending");
    expect(data.employeeId).toBe(SEEDED_STAFF_EMPLOYEE_ID);
    expect(data.principalAmount).toBe("5000.00");
    // Regression: start_month is a `date` column — node-pg parses it as a JS
    // Date at local midnight, and naively calling .toISOString() on that
    // shifts the date backward by one day in any positive-UTC-offset
    // timezone (caught in dev under IST: 2026-04-01 round-tripped as
    // 2026-03-31). Must round-trip exactly.
    expect(data.startMonth).toBe("2026-04-01");
    createdLoanIds.push(data.id);
  });

  it("approves loan and records payment with balance computation", async () => {
    // Create loan
    const createRes = await app.inject({
      method: "POST",
      url: "/v1/loans",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        principalAmount: 2000,
        monthlyInstallment: 1000,
        termMonths: 2,
        startMonth: "2026-04-01",
        reason: "Home advance",
      },
    });
    expect(createRes.statusCode).toBe(201);
    const loanId = createRes.json().data.id;
    createdLoanIds.push(loanId);

    // Approve loan
    const approveRes = await app.inject({
      method: "POST",
      url: `/v1/loans/${loanId}/approve`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(approveRes.statusCode).toBe(200);
    expect(approveRes.json().data.status).toBe("active");

    // Record partial payment
    const payment1Res = await app.inject({
      method: "POST",
      url: `/v1/loans/${loanId}/payments`,
      headers: authHeader({ role: "org_admin" }),
      payload: {
        amount: 1000,
        paymentDate: "2026-04-30",
        note: "April salary installment",
      },
    });
    expect(payment1Res.statusCode).toBe(200);

    // Check loan status and remaining amount
    const fetchRes = await app.inject({
      method: "GET",
      url: `/v1/loans/${loanId}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(fetchRes.statusCode).toBe(200);
    const loan = fetchRes.json().data;
    expect(loan.repaidAmount).toBe("1000.00");
    expect(loan.remainingAmount).toBe("1000.00");
    expect(loan.status).toBe("active");

    // Record final payment
    const payment2Res = await app.inject({
      method: "POST",
      url: `/v1/loans/${loanId}/payments`,
      headers: authHeader({ role: "org_admin" }),
      payload: {
        amount: 1000,
        paymentDate: "2026-05-31",
      },
    });
    expect(payment2Res.statusCode).toBe(200);

    // Re-check loan status (should now be paid_off)
    const finalRes = await app.inject({
      method: "GET",
      url: `/v1/loans/${loanId}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(finalRes.json().data.status).toBe("paid_off");
    expect(finalRes.json().data.remainingAmount).toBe("0.00");
    expect(finalRes.json().data.progressPercent).toBe(100);
  });

  it("fetches loan summary KPIs", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/loans/summary",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    const summary = res.json().data;
    expect(summary.total).toBeGreaterThanOrEqual(0);
    expect(summary.activeCount).toBeGreaterThanOrEqual(0);
    expect(summary.pendingCount).toBeGreaterThanOrEqual(0);
  });
});
