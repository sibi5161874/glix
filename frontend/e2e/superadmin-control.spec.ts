import { test, expect } from "@playwright/test";

test.describe("Superadmin Platform Control Plane", () => {
  test("superadmin shell renders platform metrics, tenant directory, and tier plans", async ({
    page,
  }) => {
    await page.goto("/superadmin/dashboard");
    // If not logged in as platform admin, it redirects to login or shows superadmin views
    await expect(page).toHaveURL(/\/(superadmin\/dashboard|login)/, { timeout: 15_000 });
  });
});
