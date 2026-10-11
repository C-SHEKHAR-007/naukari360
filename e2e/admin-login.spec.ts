import { test, expect } from "@playwright/test";
import { adminNavLink, loginAsAdmin } from "./helpers/admin";

test.describe("Admin Login", () => {
  test("redirects to login when accessing admin without auth", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });

  test("login page has email and password fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "wrong@email.com");
    await page.fill('input[type="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    // Should still be on login page or show error
    const errorMessage = page.locator('[role="alert"], .error, .text-red');
    const isStillOnLogin = page.url().includes("/admin/login");
    expect(isStillOnLogin || (await errorMessage.isVisible())).toBeTruthy();
  });

  test("successful login redirects to admin dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
    expect(page.url()).not.toContain("/admin/login");
  });

  test("admin dashboard shows grouped sidebar navigation", async ({ page }) => {
    await loginAsAdmin(page);
    for (const href of ["/admin/posts", "/admin/categories", "/admin/site-settings"]) {
      await expect(await adminNavLink(page, href)).toBeVisible();
    }
    await expect(
      page.locator("aside:visible").getByText("Monetization", { exact: true }).first()
    ).toBeVisible();
  });

  test("logout works", async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });

  // Caps Lock state can't be toggled in headless browsers; that warning is unit-tested
  test("toggles password visibility", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator('input[type="password"]').fill("secret");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(page.locator("#password")).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
  });
});
