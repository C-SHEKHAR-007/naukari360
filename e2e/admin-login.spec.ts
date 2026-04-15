import { test, expect } from "@playwright/test";

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
    expect(isStillOnLogin || await errorMessage.isVisible()).toBeTruthy();
  });

  test("successful login redirects to admin dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
    expect(page.url()).not.toContain("/admin/login");
  });

  test("admin dashboard shows sidebar navigation", async ({ page }) => {
    // Login first
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);

    // Check sidebar
    await expect(page.locator("text=Posts")).toBeVisible();
    await expect(page.locator("text=Categories")).toBeVisible();
    await expect(page.locator("text=Site Settings")).toBeVisible();
  });

  test("logout works", async ({ page }) => {
    // Login
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);

    // Find and click logout
    const logoutBtn = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign Out")');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForURL(/\/admin\/login/);
      expect(page.url()).toContain("/admin/login");
    }
  });
});
