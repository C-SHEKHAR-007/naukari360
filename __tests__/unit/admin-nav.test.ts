import { describe, it, expect } from "vitest";
import { ADMIN_NAV, findNavItem, initials, isActive } from "@/components/admin/nav";

describe("admin nav", () => {
  it("groups every page exactly once", () => {
    const hrefs = ADMIN_NAV.flatMap((g) => g.items.map((i) => i.href));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs).toContain("/admin/styleguide");
    expect(ADMIN_NAV.find((g) => g.label === "System")?.items.map((i) => i.href)).toContain(
      "/admin/styleguide"
    );
  });

  it("matches the dashboard only exactly, and sections by prefix", () => {
    expect(isActive("/admin", "/admin")).toBe(true);
    expect(isActive("/admin/posts", "/admin")).toBe(false);
    expect(isActive("/admin/posts/123", "/admin/posts")).toBe(true);
    expect(isActive("/admin/postsx", "/admin/posts")).toBe(false);
  });

  it("finds the current item and its group", () => {
    expect(findNavItem("/admin/posts/new")).toMatchObject({
      group: { label: "Content" },
      item: { label: "Posts" },
    });
    expect(findNavItem("/admin/unknown")).toBeNull();
  });

  it("builds initials from a name or email", () => {
    expect(initials("Super Admin")).toBe("SA");
    expect(initials(null, "editor@naukari360.in")).toBe("EN");
    expect(initials()).toBe("A");
  });
});
