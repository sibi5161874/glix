import { test, expect } from "@playwright/test";

test.describe("Leave Workflow & Entitlements", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@company.com or EMP-001").fill("owner@acme.test");
    await page.getByPlaceholder("••••••••").fill("DevPass123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });

  test("can navigate to leave requests and inspect balances", async ({ page }) => {
    await page.goto("/leaves/requests");
    await expect(page.getByRole("heading", { name: /leave/i })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: /request leave|apply leave/i })).toBeVisible();
  });
});
