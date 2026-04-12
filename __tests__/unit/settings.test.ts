import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSiteSettings } from "@/lib/settings";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSetting: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

describe("getSiteSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns settings as key-value record", async () => {
    (prisma.siteSetting.findMany as any).mockResolvedValue([
      { key: "site_name", value: "Naukari360", type: "text" },
      { key: "tagline", value: "Your 360° Government Jobs Portal", type: "text" },
      { key: "telegram_url", value: "https://t.me/naukari360", type: "text" },
    ]);

    const settings = await getSiteSettings();

    expect(settings.site_name).toBe("Naukari360");
    expect(settings.tagline).toBe("Your 360° Government Jobs Portal");
    expect(settings.telegram_url).toBe("https://t.me/naukari360");
  });

  it("returns empty record when no settings exist", async () => {
    (prisma.siteSetting.findMany as any).mockResolvedValue([]);

    const settings = await getSiteSettings();

    expect(Object.keys(settings)).toHaveLength(0);
  });
});
