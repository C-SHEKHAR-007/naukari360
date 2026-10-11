import { test, expect, type Page } from "@playwright/test";

const toggle = (page: Page) =>
  page.locator("header").getByRole("button", { name: /theme\. switch to/i });
const htmlIsDark = (page: Page) =>
  page.locator("html").evaluate((el) => el.classList.contains("dark"));

test.describe("Theme", () => {
  test("follows the device theme by default", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    expect(await htmlIsDark(page)).toBe(true);

    await page.emulateMedia({ colorScheme: "light" });
    await expect.poll(() => htmlIsDark(page)).toBe(false);
  });

  test("toggle cycles device → light → dark → device", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(toggle(page)).toHaveAccessibleName(/^Device theme/);

    await toggle(page).click();
    await expect(toggle(page)).toHaveAccessibleName(/^Light theme/);
    expect(await htmlIsDark(page)).toBe(false);

    await toggle(page).click();
    await expect(toggle(page)).toHaveAccessibleName(/^Dark theme/);
    expect(await htmlIsDark(page)).toBe(true);

    await toggle(page).click();
    await expect(toggle(page)).toHaveAccessibleName(/^Device theme/);
    expect(await htmlIsDark(page)).toBe(false);
  });

  test("an explicit choice overrides the device theme and persists", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await toggle(page).click(); // light
    await toggle(page).click(); // dark
    expect(await htmlIsDark(page)).toBe(true);

    await page.goto("/contact");
    expect(await htmlIsDark(page)).toBe(true);

    await page.reload();
    expect(await htmlIsDark(page)).toBe(true);
    await expect(toggle(page)).toHaveAccessibleName(/^Dark theme/);
  });

  test("no flash of the wrong theme: the dark class is set before first paint", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForSelector("body");
    expect(await htmlIsDark(page)).toBe(true);
  });
});
