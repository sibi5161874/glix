/**
 * Guards against the exact bug class documented in CHANGELOG.md: a lib/*.ts
 * wrapper's return type silently drifting from what the backend actually
 * sends (`apiFetch<T>`'s `T` is caller-asserted, not derived from a runtime
 * schema — see lib/api.ts). That drift already crashed `/dashboard` once
 * (`announcements.map is not a function`) because `listAnnouncements` was
 * typed as a bare array while the backend sent the paginated envelope every
 * other list endpoint uses. These tests mock the exact backend response
 * shape and assert on what the wrapper actually returns at runtime, not just
 * what its type annotation claims.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { listAnnouncements } from "./announcements";
import { listDocuments } from "./documents";
import { listEmployees, listDepartments, listDesignations } from "./employees";
import { listLoans } from "./loans";
import { listLeaveTypes, listHolidays, listLeaveRequests, listLeaveBalances } from "./leave";
import { listInvoices, listPlans } from "./billing";
import { listMyTickets, listOrgTickets, listPlatformTickets } from "./support";
import {
  listPlatformOrgs,
  listPlatformPlans,
  listPlatformSettings,
  listPlatformTeam,
} from "./platform";

function mockFetchOnce(data: unknown): void {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data }),
  }) as unknown as typeof fetch;
}

describe("paginated list endpoints return the {items, total, page, limit} envelope", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("listAnnouncements", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listAnnouncements("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listDocuments", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listDocuments("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listEmployees", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listEmployees("tok", {});
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listLoans", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listLoans("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listInvoices", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listInvoices("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listMyTickets", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listMyTickets("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listOrgTickets", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listOrgTickets("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listPlatformTickets", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listPlatformTickets("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });

  it("listPlatformOrgs", async () => {
    mockFetchOnce({ items: [], total: 0, page: 1, limit: 20 });
    const result = await listPlatformOrgs("tok");
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(Array.isArray(result)).toBe(false);
  });
});

describe("unpaginated list endpoints return a bare array", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("listLeaveTypes", async () => {
    mockFetchOnce([]);
    const result = await listLeaveTypes("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listHolidays", async () => {
    mockFetchOnce([]);
    const result = await listHolidays("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listLeaveRequests", async () => {
    mockFetchOnce([]);
    const result = await listLeaveRequests("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listLeaveBalances", async () => {
    mockFetchOnce([]);
    const result = await listLeaveBalances("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listDepartments", async () => {
    mockFetchOnce([]);
    const result = await listDepartments("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listDesignations", async () => {
    mockFetchOnce([]);
    const result = await listDesignations("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listPlans", async () => {
    mockFetchOnce([]);
    const result = await listPlans("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listPlatformPlans", async () => {
    mockFetchOnce([]);
    const result = await listPlatformPlans("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listPlatformSettings", async () => {
    mockFetchOnce([]);
    const result = await listPlatformSettings("tok");
    expect(Array.isArray(result)).toBe(true);
  });

  it("listPlatformTeam", async () => {
    mockFetchOnce([]);
    const result = await listPlatformTeam("tok");
    expect(Array.isArray(result)).toBe(true);
  });
});
