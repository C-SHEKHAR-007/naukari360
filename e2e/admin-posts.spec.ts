import { test, expect } from "@playwright/test";

test.describe("Admin Posts Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/admin/login");
    await page.locator("input[name='email'], input[type='email']").fill("admin@naukari360.in");
    await page.locator("input[name='password'], input[type='password']").fill("admin123");
    await page.locator("button[type='submit']").click();
    await page.waitForURL(/\/admin/);
  });

  test("can navigate to posts page", async ({ page }) => {
    await page.locator("a[href*='posts'], text=Posts").first().click();
    await page.waitForURL(/\/admin\/posts/);
    await expect(page.locator("h1, h2")).toContainText(/posts/i);
  });

  test("posts page shows table or list", async ({ page }) => {
    await page.goto("/admin/posts");
    const tableOrList = page.locator("table, [role='table'], .posts-list, [data-testid='posts']");
    await expect(tableOrList.first()).toBeVisible({ timeout: 10000 });
  });

  test("can navigate to create new post", async ({ page }) => {
    await page.goto("/admin/posts");
    const newPostBtn = page.locator("a[href*='new'], a[href*='create'], button:has-text('New'), button:has-text('Create'), button:has-text('Add')");
    await newPostBtn.first().click();
    await page.waitForURL(/\/admin\/posts\/(new|create)/);
    await expect(page.locator("form")).toBeVisible();
  });

  test("new post form has required fields", async ({ page }) => {
    await page.goto("/admin/posts/new");
    await expect(page.locator("input[name='titleEn'], input[name='title'], label:has-text('Title')").first()).toBeVisible();
    await expect(page.locator("input[name='slug'], label:has-text('Slug')").first()).toBeVisible();
  });

  test("can navigate to categories page", async ({ page }) => {
    await page.locator("a[href*='categories'], text=Categories").first().click();
    await page.waitForURL(/\/admin\/categories/);
    await expect(page.locator("body")).toContainText(/categor/i);
  });
});
