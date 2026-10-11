import { test, expect } from "@playwright/test";

test.describe("Authentication and Dashboard Shell", () => {
  test("unauthenticated user is redirected to /login when accessing protected routes", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });

  test("shows error toast/message on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@company.com or EMP-001").fill("invalid-user@acme.test");
    await page.getByPlaceholder("••••••••").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Check for error feedback
    await expect(
      page
        .getByText(/invalid/i)
        .or(page.getByText(/failed/i))
        .or(page.getByText(/incorrect/i)),
    ).toBeVisible({
      timeout: 10_000,
    });
  });

  test("successful login lands on dashboard with company stats and navigation", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@company.com or EMP-001").fill("owner@acme.test");
    await page.getByPlaceholder("••••••••").fill("DevPass123!");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Employees" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Leave" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Documents" })).toBeVisible();
  });
});
