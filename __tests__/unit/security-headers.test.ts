import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const configPath = join(process.cwd(), "next.config.ts");
const configContent = readFileSync(configPath, "utf-8");

describe("Security Headers — next.config.ts", () => {
  describe("HSTS (Strict-Transport-Security)", () => {
    it("includes HSTS header", () => {
      expect(configContent).toContain("Strict-Transport-Security");
    });

    it("has max-age of at least 1 year (31536000)", () => {
      expect(configContent).toMatch(/max-age=\d{7,}/);
    });

    it("includes includeSubDomains directive", () => {
      expect(configContent).toContain("includeSubDomains");
    });

    it("includes preload directive", () => {
      expect(configContent).toContain("preload");
    });
  });

  describe("Content-Security-Policy", () => {
    it("includes CSP header", () => {
      expect(configContent).toContain("Content-Security-Policy");
    });

    it("restricts default-src to self", () => {
      expect(configContent).toContain("default-src 'self'");
    });

    it("blocks object-src", () => {
      expect(configContent).toContain("object-src 'none'");
    });

    it("restricts base-uri to self", () => {
      expect(configContent).toContain("base-uri 'self'");
    });

    it("restricts form-action to self", () => {
      expect(configContent).toContain("form-action 'self'");
    });

    it("blocks framing via frame-ancestors", () => {
      expect(configContent).toContain("frame-ancestors 'none'");
    });

    it("enables upgrade-insecure-requests", () => {
      expect(configContent).toContain("upgrade-insecure-requests");
    });
  });

  describe("Other security headers", () => {
    it("includes X-Frame-Options DENY", () => {
      expect(configContent).toContain("X-Frame-Options");
      expect(configContent).toContain("DENY");
    });

    it("includes X-Content-Type-Options nosniff", () => {
      expect(configContent).toContain("X-Content-Type-Options");
      expect(configContent).toContain("nosniff");
    });

    it("includes Referrer-Policy", () => {
      expect(configContent).toContain("Referrer-Policy");
    });

    it("includes Permissions-Policy", () => {
      expect(configContent).toContain("Permissions-Policy");
      expect(configContent).toContain("camera=()");
      expect(configContent).toContain("microphone=()");
    });
  });
});
