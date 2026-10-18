import { describe, it, expect } from "vitest";
import { SIDEBAR, parseSidebarPrefs } from "@/components/admin/sidebar-prefs";

describe("parseSidebarPrefs", () => {
  it("defaults when cookies are missing or junk", () => {
    expect(parseSidebarPrefs()).toEqual({ collapsed: false, width: SIDEBAR.default });
    expect(parseSidebarPrefs("yes", "wide")).toEqual({ collapsed: false, width: SIDEBAR.default });
  });

  it("reads saved values and clamps the width", () => {
    expect(parseSidebarPrefs("true", "300")).toEqual({ collapsed: true, width: 300 });
    expect(parseSidebarPrefs("false", "9999").width).toBe(SIDEBAR.max);
    expect(parseSidebarPrefs("false", "10").width).toBe(SIDEBAR.min);
  });
});
