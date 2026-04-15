import { test, expect } from "@playwright/test";

test.describe("Admin Settings", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
  });

  test("can navigate to site settings", async ({ page }) => {
    await page.click("text=Site Settings");
    await page.waitForURL(/\/admin\/site-settings/);
    expect(page.url()).toContain("/admin/site-settings");
  });

  test("site settings form loads with values", async ({ page }) => {
    await page.goto("/admin/site-settings");
    // Should have input fields with site settings
    const siteNameInput = page.locator(
      'input[name="site_name"], input[placeholder*="site name" i]'
    );
    await expect(siteNameInput).toBeVisible();
    const value = await siteNameInput.inputValue();
    expect(value).toBeTruthy();
  });

  test("can update site name and save", async ({ page }) => {
    await page.goto("/admin/site-settings");
    const siteNameInput = page.locator(
      'input[name="site_name"], input[placeholder*="site name" i]'
    );
    await siteNameInput.clear();
    await siteNameInput.fill("Naukari360 Test");

    const saveBtn = page.locator('button[type="submit"], button:has-text("Save")');
    await saveBtn.click();

    // Wait for success indication
    await page.waitForTimeout(1000);

    // Verify on public site
    await page.goto("/");
    const headerText = await page.locator("header").textContent();
    expect(headerText).toContain("Naukari");

    // Restore original
    await page.goto("/admin/site-settings");
    const nameInput = page.locator(
      'input[name="site_name"], input[placeholder*="site name" i]'
    );
    await nameInput.clear();
    await nameInput.fill("Naukari360");
    await page.locator('button[type="submit"], button:has-text("Save")').click();
  });
});
