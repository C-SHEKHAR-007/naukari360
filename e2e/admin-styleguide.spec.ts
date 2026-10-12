import { test, expect } from "@playwright/test";

test.describe("Admin style guide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
  });

  test("shows tokens and components, and switches theme", async ({ page }) => {
    await page.goto("/admin/styleguide");
    await expect(page.getByRole("heading", { level: 1, name: "Style guide" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Badges" })).toBeVisible();
    // scoped to main: Next.js adds its own role="alert" route announcer
    await expect(page.locator("main").getByRole("alert")).toHaveText(
      "Something went wrong. Please try again."
    );

    const isDark = () => page.locator("html").evaluate((el) => el.classList.contains("dark"));
    const toggle = page.locator("main").getByRole("button", { name: /theme\. switch to/i });
    // device → light → dark always lands on dark within two clicks
    await toggle.click();
    await toggle.click();
    expect(await isDark()).toBe(true);
  });
});
