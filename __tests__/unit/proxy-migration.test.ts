import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("Proxy Migration (middleware.ts → proxy.ts)", () => {
  const root = process.cwd();

  describe("File conventions", () => {
    it("proxy.ts exists in src/", () => {
      expect(existsSync(join(root, "src/proxy.ts"))).toBe(true);
    });

    it("middleware.ts is removed from src/", () => {
      expect(existsSync(join(root, "src/middleware.ts"))).toBe(false);
    });
  });

  describe("Proxy file structure", () => {
    const proxyFile = readFileSync(join(root, "src/proxy.ts"), "utf-8");

    it("exports a named proxy function", () => {
      expect(proxyFile).toMatch(/export\s+(async\s+)?function\s+proxy/);
    });

    it("does NOT use default export", () => {
      expect(proxyFile).not.toMatch(/export\s+default/);
    });

    it("exports a config with matcher", () => {
      expect(proxyFile).toContain("export const config");
      expect(proxyFile).toContain("matcher");
    });

    it("matcher targets /admin routes", () => {
      expect(proxyFile).toContain("/admin/:path*");
    });

    it("uses NextRequest type for request parameter", () => {
      expect(proxyFile).toContain("NextRequest");
    });

    it("redirects unauthenticated users to login", () => {
      expect(proxyFile).toContain("/admin/login");
      expect(proxyFile).toContain("NextResponse.redirect");
    });

    it("redirects authenticated users away from login page", () => {
      expect(proxyFile).toContain("isLoginPage");
      expect(proxyFile).toContain("session");
    });

    it("calls auth() to get session", () => {
      expect(proxyFile).toContain("await auth()");
    });
  });
});
