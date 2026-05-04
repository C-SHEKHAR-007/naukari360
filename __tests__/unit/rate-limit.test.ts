import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    // Each test uses unique keys so no cross-test contamination
  });

  it("allows requests within limit", () => {
    const key = `test-allow-${Date.now()}`;
    const result1 = rateLimit(key, { limit: 3, windowMs: 60_000 });
    const result2 = rateLimit(key, { limit: 3, windowMs: 60_000 });
    const result3 = rateLimit(key, { limit: 3, windowMs: 60_000 });

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result3.success).toBe(true);
    expect(result1.remaining).toBe(2);
    expect(result2.remaining).toBe(1);
    expect(result3.remaining).toBe(0);
  });

  it("blocks requests exceeding limit", () => {
    const key = `test-block-${Date.now()}`;
    rateLimit(key, { limit: 2, windowMs: 60_000 });
    rateLimit(key, { limit: 2, windowMs: 60_000 });
    const result = rateLimit(key, { limit: 2, windowMs: 60_000 });

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const key = `test-reset-${Date.now()}`;
    // Use a window of 1ms which will expire immediately
    rateLimit(key, { limit: 1, windowMs: 1 });

    // Wait a tiny bit for the window to pass
    const start = Date.now();
    while (Date.now() - start < 5) {
      // busy wait
    }

    const result = rateLimit(key, { limit: 1, windowMs: 60_000 });
    expect(result.success).toBe(true);
  });

  it("tracks different keys independently", () => {
    const key1 = `test-key1-${Date.now()}`;
    const key2 = `test-key2-${Date.now()}`;

    rateLimit(key1, { limit: 1, windowMs: 60_000 });
    const blocked = rateLimit(key1, { limit: 1, windowMs: 60_000 });
    const allowed = rateLimit(key2, { limit: 1, windowMs: 60_000 });

    expect(blocked.success).toBe(false);
    expect(allowed.success).toBe(true);
  });
});
