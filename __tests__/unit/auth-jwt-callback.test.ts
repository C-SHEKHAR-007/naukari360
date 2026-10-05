import { describe, it, expect, vi, beforeEach } from "vitest";

// Capture the config passed to NextAuth so the jwt callback can be called directly
const captured = vi.hoisted(() => ({}) as { config?: any });
vi.mock("next-auth", () => ({
  default: (config: unknown) => {
    captured.config = config;
    return { handlers: {}, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() };
  },
}));
vi.mock("next-auth/providers/credentials", () => ({ default: (c: unknown) => c }));
vi.mock("next-auth/providers/google", () => ({ default: (c: unknown) => c }));
vi.mock("@auth/prisma-adapter", () => ({ PrismaAdapter: () => ({}) }));
vi.mock("bcryptjs", () => ({ default: { compare: vi.fn() } }));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import "@/lib/auth";

const jwt = (args: Record<string, unknown>) => captured.config.callbacks.jwt(args);

describe("auth jwt callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.user.findUnique as any).mockResolvedValue({
      qualification: "graduate",
      state: "bihar",
    });
  });

  it("does not query the database on ordinary session checks", async () => {
    const token = { sub: "u1", role: "user", qualification: "12th", state: "up" };
    const result = await jwt({ token, trigger: undefined });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(result).toMatchObject({ qualification: "12th", state: "up" });
  });

  it("loads profile fields from the database on sign-in", async () => {
    const result = await jwt({
      token: { sub: "u1" },
      user: { id: "u1", role: "admin" },
      trigger: "signIn",
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "u1" } });
    expect(result).toMatchObject({ role: "admin", qualification: "graduate", state: "bihar" });
  });

  it("refreshes profile fields when the session is explicitly updated", async () => {
    const result = await jwt({
      token: { sub: "u1", role: "user", qualification: null },
      trigger: "update",
    });
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ qualification: "graduate", state: "bihar" });
  });
});
