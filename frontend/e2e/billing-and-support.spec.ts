import { test, expect } from "@playwright/test";

test.describe("Billing, Subscriptions, and Support", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@company.com or EMP-001").fill("owner@acme.test");
    await page.getByPlaceholder("••••••••").fill("DevPass123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });

  test("can view subscription plans and open tier change dialog", async ({ page }) => {
    await page.goto("/settings/subscription");
    await expect(page.getByRole("heading", { name: /subscription & billing/i })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("button", { name: /change plan/i })).toBeVisible();
  });

  test("can view support tickets and open create ticket modal", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: /support helpdesk/i })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("button", { name: /raise ticket/i })).toBeVisible();
  });
});
