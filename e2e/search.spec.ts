import { test, expect } from "@playwright/test";

test.describe("Search functionality", () => {
  test("search input is visible on homepage", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator("input[type='search'], input[placeholder*='search' i], input[name='q']");
    await expect(searchInput.first()).toBeVisible();
  });

  test("can type in search box and submit", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator("input[type='search'], input[placeholder*='search' i], input[name='q']").first();
    await searchInput.fill("SSC CGL");
    await searchInput.press("Enter");
    await page.waitForURL(/\/search/);
    expect(page.url()).toContain("/search");
    expect(page.url()).toContain("SSC");
  });

  test("search results page shows query", async ({ page }) => {
    await page.goto("/search?q=Railway");
    await expect(page.locator("body")).toContainText(/railway/i);
  });

  test("empty search shows appropriate message", async ({ page }) => {
    await page.goto("/search?q=xyznonexistent12345");
    await expect(page.locator("body")).toContainText(/no.*result|not found/i);
  });
});
