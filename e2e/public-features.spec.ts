import { test, expect } from "@playwright/test";

test.describe("Public User Features (V2)", () => {
  test("UserNav shows Sign In button when unauthenticated", async ({ page }) => {
    await page.goto("/");
    
    // Look for the Sign In button inside the Header's UserNav
    const signInButton = page.locator('button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
  });

  test("Jobs For You feed is hidden when unauthenticated", async ({ page }) => {
    await page.goto("/");
    
    // The "Jobs For You" header shouldn't be present if not logged in
    const personalizedHeader = page.locator('h2:has-text("Jobs For You")');
    await expect(personalizedHeader).not.toBeVisible();
  });

  test("redirects to login when accessing /profile without auth", async ({ page }) => {
    await page.goto("/profile");
    // NextAuth's auth() guard redirects to the configured signIn page (/admin/login)
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });

  test("redirects to login when accessing /bookmarks without auth", async ({ page }) => {
    await page.goto("/bookmarks");
    // NextAuth's auth() guard redirects to the configured signIn page (/admin/login)
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });
});
