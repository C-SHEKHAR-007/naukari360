import { test, expect, type Page } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin";

// Most visitors are on phones: every page must fit the screen width at phone,
// tablet and laptop sizes (no sideways scrolling, nothing sticking out).

const PUBLIC_ROUTES = [
  "/",
  "/latest-jobs",
  "/results",
  "/admit-card",
  "/syllabus",
  "/10th-pass",
  "/graduate",
  "/state/all-india",
  "/eligibility?qualification=graduate&age=25",
  "/search?q=ssc",
  "/exam-calendar",
  "/bookmarks",
  "/tracker",
  "/profile",
  "/about",
  "/contact",
  "/privacy-policy",
  "/admin/login",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/analytics",
  "/admin/posts",
  "/admin/posts/new",
  "/admin/syllabuses",
  "/admin/syllabuses/new",
  "/admin/categories",
  "/admin/states",
  "/admin/pages",
  "/admin/menus",
  "/admin/banners",
  "/admin/announcements",
  "/admin/notifications",
  "/admin/subscribers",
  "/admin/contact-inbox",
  "/admin/ads",
  "/admin/affiliate-links",
  "/admin/monetization",
  "/admin/interstitial",
  "/admin/site-settings",
  "/admin/styleguide",
];

const WIDTHS = [
  { name: "phone", width: 360, height: 740 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
];

async function expectFitsWidth(page: Page, route: string) {
  const result = await page.evaluate(() => {
    const vw = window.innerWidth;
    const insideScroller = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true;
      }
      return false;
    };
    const sticking: string[] = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || cs.position === "fixed" || cs.visibility === "hidden") continue;
      if (r.right > vw + 1 && !insideScroller(el)) {
        sticking.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
      }
    }
    return { overflow: document.documentElement.scrollWidth - vw, sticking: sticking.slice(0, 3) };
  });
  expect(result.overflow, `${route} scrolls sideways by ${result.overflow}px`).toBeLessThanOrEqual(
    0
  );
  expect(result.sticking, `${route} has elements past the screen edge`).toEqual([]);
}

for (const size of WIDTHS) {
  test.describe(`fits the screen on ${size.name} (${size.width}px)`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    test("public pages", async ({ page }) => {
      for (const route of PUBLIC_ROUTES) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await expectFitsWidth(page, route);
      }
    });

    test("admin pages", async ({ page }) => {
      test.setTimeout(120_000);
      await loginAsAdmin(page);
      for (const route of ADMIN_ROUTES) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await expectFitsWidth(page, route);
      }
    });
  });
}

test("admin login fits a phone screen without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/login");
  const extra = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  expect(extra).toBeLessThanOrEqual(0);
});
