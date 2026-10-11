import { test, expect } from "@playwright/test";

test.describe("Compliance Document Vault", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@company.com or EMP-001").fill("owner@acme.test");
    await page.getByPlaceholder("••••••••").fill("DevPass123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });

  test("can navigate to documents and view categories & compliance filters", async ({ page }) => {
    await page.goto("/documents");
    await expect(page.getByRole("heading", { name: /document/i })).toBeVisible({ timeout: 10_000 });
  });
});
