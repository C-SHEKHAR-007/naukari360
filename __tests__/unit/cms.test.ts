import { describe, it, expect } from "vitest";
import { prepareCmsHtml } from "@/lib/cms";

describe("prepareCmsHtml", () => {
  it("drops a leading h1 that repeats the page title", () => {
    expect(prepareCmsHtml("<h1>Contact Us</h1><p>Write to us.</p>", "Contact Us")).toBe(
      "<p>Write to us.</p>"
    );
  });

  it("matches the title case-insensitively and ignores inner tags", () => {
    expect(
      prepareCmsHtml("<h1 class='x'><strong>contact us</strong></h1><p>Hi</p>", "Contact Us")
    ).toBe("<p>Hi</p>");
  });

  it("demotes a leading h1 that differs from the title instead of removing it", () => {
    expect(prepareCmsHtml("<h1>About Naukari360</h1><p>Text</p>", "About Us")).toBe(
      "<h2>About Naukari360</h2><p>Text</p>"
    );
  });

  it("demotes every h1 and keeps attributes", () => {
    expect(prepareCmsHtml('<p>a</p><h1 id="s">Section</h1><H1>Other</H1>')).toBe(
      '<p>a</p><h2 id="s">Section</h2><h2>Other</h2>'
    );
  });

  it("leaves content without h1 untouched", () => {
    const html = "<h2>Section</h2><p>Body <a href='/h1'>h1 link</a></p>";
    expect(prepareCmsHtml(html, "Disclaimer")).toBe(html);
  });

  it("does not touch tags that merely start with h1-like names", () => {
    expect(prepareCmsHtml("<h10>x</h10>")).toBe("<h10>x</h10>");
  });
});
