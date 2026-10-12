import { test, expect } from "@playwright/test";

test.describe("Search functionality", () => {
  test("header search link opens the search page", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: "Search" }).click();
    await page.waitForURL(/\/search/);
    await expect(page.getByRole("textbox", { name: "Search jobs" })).toBeVisible();
  });

  test("can type in search box and submit", async ({ page }) => {
    await page.goto("/search");
    const searchInput = page.getByRole("textbox", { name: "Search jobs" });
    await searchInput.fill("SSC CGL");
    await searchInput.press("Enter");
    await page.waitForURL(/\/search\?q=SSC/);
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
