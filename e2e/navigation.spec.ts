import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header nav links are visible on desktop", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("clicking category link navigates correctly", async ({ page }) => {
    await page.goto("/");
    const latestJobsLink = page.locator('a:has-text("Latest Jobs")').first();
    if (await latestJobsLink.isVisible()) {
      await latestJobsLink.click();
      await page.waitForURL(/\/(category|latest)/);
      expect(page.url()).toMatch(/\/(category|latest)/);
    }
  });

  test("logo navigates to home", async ({ page }) => {
    await page.goto("/contact");
    const logo = page.locator("header a").first();
    await logo.click();
    await page.waitForURL("/");
    expect(page.url()).toMatch(/\/$/);
  });

  test("mobile menu toggle works", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile test only");
    await page.goto("/");
    const menuButton = page.locator('[aria-label="Open menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Should show mobile menu
      await expect(page.locator('[role="dialog"], [data-state="open"]')).toBeVisible();
    }
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toContainText(/contact/i);
  });

  test("search page/modal accessible", async ({ page }) => {
    await page.goto("/");
    const searchBtn = page.locator('[aria-label="Search"]');
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      // Should open search modal or navigate to search page
      await page.waitForTimeout(500);
    }
  });
});
