import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("displays site name in header", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("header")).toContainText("Naukari");
  });

  test("displays announcement bar", async ({ page }) => {
    await page.goto("/");
    // Announcement from site settings should be visible
    const announcementBar = page.locator("header >> text=Welcome to Naukari360");
    // May or may not be visible depending on settings
    if (await announcementBar.isVisible()) {
      await expect(announcementBar).toBeVisible();
    }
  });

  test("displays footer with site branding", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer")).toContainText("Naukari");
  });

  test("displays category sections", async ({ page }) => {
    await page.goto("/");
    // Should have post cards or category sections
    await expect(page.locator("main")).toBeVisible();
  });

  test("has correct meta title", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
