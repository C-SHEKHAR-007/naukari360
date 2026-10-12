import { test, expect } from "@playwright/test";

test.describe("Admin Affiliate Links", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
  });

  test("affiliate links page loads", async ({ page }) => {
    await page.goto("/admin/affiliate-links");
    await expect(page.locator("h1, h2").filter({ hasText: "Affiliate Links" })).toBeVisible();
    await expect(page.locator("button:has-text('Add Link')")).toBeVisible();
  });

  test("can open add link form", async ({ page }) => {
    await page.goto("/admin/affiliate-links");
    await page.locator("button:has-text('Add Link')").click();
    await expect(page.locator('input[placeholder="Link name"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Original URL"]')).toBeVisible();
  });

  test("can create an affiliate link", async ({ page }, testInfo) => {
    await page.goto("/admin/affiliate-links");
    await page.locator("button:has-text('Add Link')").click();

    const slug = `test-link-${Date.now()}`;
    const name = `E2E Test Link ${testInfo.project.name} ${Date.now()}`;
    await page.fill('input[placeholder="Link name"]', name);
    await page.fill('input[placeholder*="Original URL"]', "https://example.com/affiliate");
    await page.fill('input[placeholder*="Slug"]', slug);
    await page.click("button:has-text('Save')");

    await expect(page.getByText(name)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Admin Notifications", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
  });

  test("notifications page loads", async ({ page }) => {
    await page.goto("/admin/notifications");
    await expect(page.locator("h1, h2").filter({ hasText: "Push Notifications" })).toBeVisible();
    await expect(page.locator("h2, h3").filter({ hasText: "Compose Notification" })).toBeVisible();
  });

  test("can send a notification", async ({ page }, testInfo) => {
    const title = `E2E Test Notification ${testInfo.project.name} ${Date.now()}`;
    await page.goto("/admin/notifications");
    await page.fill('input[placeholder*="SSC CGL"]', title);
    await page.fill(
      'textarea[placeholder*="Brief notification"]',
      "This is a test notification from E2E"
    );
    await page.click("button:has-text('Send Notification')");

    await expect(page.locator("text=Notification sent!")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(title)).toBeVisible();
  });
});

test.describe("Admin Interstitial Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
  });

  test("interstitial page loads", async ({ page }) => {
    await page.goto("/admin/interstitial");
    await expect(page.locator("h1, h2").filter({ hasText: "Interstitial" })).toBeVisible();
    await expect(page.locator("button:has-text('Add Config')")).toBeVisible();
  });

  test("can create an interstitial config", async ({ page }, testInfo) => {
    const title = `E2E Test Config ${testInfo.project.name} ${Date.now()}`;
    await page.goto("/admin/interstitial");
    await page.locator("button:has-text('Add Config')").click();

    await page.fill('input[placeholder*="Title"]', title);
    await page.fill('input[placeholder*="Ad Slot Key"]', "e2e_test_slot");
    await page.click("button:has-text('Save')");

    await expect(page.getByText(title)).toBeVisible({ timeout: 5000 });
  });
});
