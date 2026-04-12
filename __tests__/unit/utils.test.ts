import { describe, it, expect } from "vitest";
import {
  slugify,
  formatDate,
  truncateText,
  calculateReadingTime,
  daysUntil,
  isClosingSoon,
  getBadgeFromDates,
} from "@/lib/utils";

describe("slugify", () => {
  it("converts text to URL-friendly slug", () => {
    expect(slugify("SSC CGL 2025 Notification")).toBe("ssc-cgl-2025-notification");
  });

  it("handles special characters", () => {
    expect(slugify("Hello & World! #Test")).toBe("hello-world-test");
  });

  it("trims whitespace", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });
});

describe("formatDate", () => {
  it("formats date in English locale", () => {
    const result = formatDate("2025-03-15", "en");
    expect(result).toContain("Mar");
    expect(result).toContain("2025");
  });

  it("formats date in Hindi locale", () => {
    const result = formatDate("2025-03-15", "hi");
    expect(result).toContain("2025");
  });
});

describe("truncateText", () => {
  it("returns full text if under max length", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
  });

  it("truncates and adds ellipsis", () => {
    expect(truncateText("Hello World Testing", 10)).toBe("Hello Worl...");
  });
});

describe("calculateReadingTime", () => {
  it("returns 1 for very short content", () => {
    expect(calculateReadingTime("<p>Hello</p>")).toBe(1);
  });

  it("calculates based on 200 wpm", () => {
    const words = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(`<p>${words}</p>`)).toBe(2);
  });
});

describe("daysUntil", () => {
  it("returns positive for future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(daysUntil(future)).toBe(5);
  });

  it("returns negative for past dates", () => {
    const past = new Date();
    past.setDate(past.getDate() - 3);
    expect(daysUntil(past)).toBeLessThan(0);
  });
});

describe("isClosingSoon", () => {
  it("returns true for dates within 3 days", () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 2);
    expect(isClosingSoon(soon)).toBe(true);
  });

  it("returns false for dates more than 3 days away", () => {
    const later = new Date();
    later.setDate(later.getDate() + 10);
    expect(isClosingSoon(later)).toBe(false);
  });

  it("returns false for null dates", () => {
    expect(isClosingSoon(null)).toBe(false);
  });

  it("returns false for past dates", () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(isClosingSoon(past)).toBe(false);
  });
});

describe("getBadgeFromDates", () => {
  it("returns EXPIRED when last date is past", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(getBadgeFromDates(past, new Date().toISOString())).toBe("EXPIRED");
  });

  it("returns NEW for recently created posts", () => {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 30);
    expect(getBadgeFromDates(future, now.toISOString())).toBe("NEW");
  });

  it("returns null for older posts with future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const old = new Date();
    old.setDate(old.getDate() - 10);
    expect(getBadgeFromDates(future, old.toISOString())).toBeNull();
  });
});
