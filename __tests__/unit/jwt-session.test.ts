import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("JWT Session Timeout Configuration", () => {
  const authFile = readFileSync(join(process.cwd(), "src/lib/auth.ts"), "utf-8");

  it("uses jwt strategy", () => {
    expect(authFile).toContain('strategy: "jwt"');
  });

  it("sets maxAge for session expiry", () => {
    expect(authFile).toMatch(/maxAge:\s*8\s*\*\s*60\s*\*\s*60/);
  });

  it("maxAge is 8 hours (28800 seconds)", () => {
    const match = authFile.match(/maxAge:\s*([\d\s*]+)/);
    expect(match).not.toBeNull();
    // Evaluate the expression: 8 * 60 * 60 = 28800
    const value = eval(match![1].split(",")[0].split("//")[0].trim());
    expect(value).toBe(28800);
  });

  it("sets updateAge for token refresh interval", () => {
    expect(authFile).toMatch(/updateAge:\s*60\s*\*\s*60/);
  });

  it("updateAge is 1 hour (3600 seconds)", () => {
    const match = authFile.match(/updateAge:\s*([\d\s*]+)/);
    expect(match).not.toBeNull();
    const value = eval(match![1].split(",")[0].split("//")[0].trim());
    expect(value).toBe(3600);
  });

  it("session maxAge is less than 24 hours for security", () => {
    const match = authFile.match(/maxAge:\s*([\d\s*]+)/);
    const value = eval(match![1].split(",")[0].split("//")[0].trim());
    expect(value).toBeLessThan(24 * 60 * 60);
  });

  it("updateAge is less than maxAge", () => {
    const maxAgeMatch = authFile.match(/maxAge:\s*([\d\s*]+)/);
    const updateAgeMatch = authFile.match(/updateAge:\s*([\d\s*]+)/);
    const maxAge = eval(maxAgeMatch![1].split(",")[0].split("//")[0].trim());
    const updateAge = eval(updateAgeMatch![1].split(",")[0].split("//")[0].trim());
    expect(updateAge).toBeLessThan(maxAge);
  });

  it("assigns role to JWT token on login", () => {
    expect(authFile).toContain("token.role");
  });

  it("propagates role to session", () => {
    expect(authFile).toContain("session.user");
    expect(authFile).toMatch(/role.*token\.role|token\.role.*role/);
  });
});
