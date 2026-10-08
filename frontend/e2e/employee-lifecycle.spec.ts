import { test, expect, request as apiRequest } from "@playwright/test";

const BACKEND_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000";

/**
 * Covers the login → create → list → delete employee lifecycle end to end,
 * against the real backend and a real Postgres instance (seeded via
 * `pnpm db:seed` — see db/seed.sql for the `owner@acme.test` fixture).
 * This is the one E2E flow CLAUDE.md's verification checklist has asked for
 * since Phase 1; none existed until now.
 */
test("org admin can log in, create an employee, see it listed, and delete it", async ({ page }) => {
  const uniqueCode = `E2E-${Date.now().toString().slice(-6)}`;

  await test.step("log in as the seeded org owner", async () => {
    await page.goto("/login");
    await page.getByPlaceholder("you@company.com or EMP-001").fill("owner@acme.test");
    await page.getByPlaceholder("••••••••").fill("DevPass123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });

  await test.step("create a new employee", async () => {
    await page.goto("/employees/create");
    await page.getByLabel("Employee code").fill(uniqueCode);
    await page.getByLabel("First name").fill("Playwright");
    await page.getByLabel("Last name").fill("Test");
    await page.getByLabel("Email").fill(`${uniqueCode.toLowerCase()}@acme.test`);
    await page.getByLabel("Joining date").fill("2026-01-15");
    await page.getByLabel("Basic salary").fill("5000");
    await page.getByRole("button", { name: "Add employee" }).click();
    await expect(page).toHaveURL(/\/employees\/[0-9a-f-]+$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Playwright Test" })).toBeVisible();
  });

  await test.step("find it in the employees list", async () => {
    await page.goto(`/employees?search=${uniqueCode}`);
    await expect(page.getByRole("link", { name: "Playwright Test" })).toBeVisible();
  });

  await test.step("delete it through the UI", async () => {
    await page.goto(`/employees?search=${uniqueCode}`);
    await page.getByRole("button", { name: "Actions for Playwright Test" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByRole("link", { name: "Playwright Test" })).not.toBeVisible();
  });
});

/**
 * Belt-and-suspenders cleanup: if an earlier step throws, the UI delete step
 * never runs, and this test's own row would otherwise sit in the dev database
 * forever (the exact kind of leak this project's backend test suite already
 * hit and fixed more than once). Goes straight to the API with the backend's
 * own seeded credentials so it doesn't depend on anything the test itself
 * was trying to verify.
 */
// Playwright requires this exact destructuring syntax to statically detect
// which fixtures a hook uses.
// eslint-disable-next-line no-empty-pattern
test.afterEach(async ({}, testInfo) => {
  const codePrefix = "E2E-";
  const api = await apiRequest.newContext({ baseURL: BACKEND_URL });
  try {
    const loginRes = await api.post("/v1/auth/login", {
      data: { identifier: "owner@acme.test", secret: "DevPass123!" },
    });
    if (!loginRes.ok()) return;
    const { data } = await loginRes.json();
    const headers = { Authorization: `Bearer ${data.accessToken}` };

    const listRes = await api.get(`/v1/employees?search=${codePrefix}&limit=20`, { headers });
    if (!listRes.ok()) return;
    const { data: list } = await listRes.json();
    for (const item of list.items as Array<{ id: string; employeeCode: string }>) {
      if (item.employeeCode.startsWith(codePrefix)) {
        await api.delete(`/v1/employees/${item.id}`, { headers });
      }
    }
  } finally {
    await api.dispose();
    if (testInfo.status !== testInfo.expectedStatus) {
      // eslint-disable-next-line no-console
      console.log(`Cleaned up any leftover ${codePrefix}* employees after a failed run.`);
    }
  }
});
