import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header nav links are visible on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop nav is hidden on small screens");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Latest Jobs" })).toBeVisible();
  });

  test("bottom nav is visible on mobile", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile test only");
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Quick links" })).toBeVisible();
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
    const menuButton = page.getByRole("button", { name: "Toggle menu" });
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Results" }).click();
    await page.waitForURL(/\/results/);
    await expect(menu).toBeHidden();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("main")).toBeVisible();
    // Exactly one h1 (CMS content must not add a second one)
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(/contact/i);
  });

  test("search page/modal accessible", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: "Search" }).click();
    await page.waitForURL(/\/search/);
    await expect(page.getByRole("textbox", { name: "Search jobs" })).toBeVisible();
  });
});
