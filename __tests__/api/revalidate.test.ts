import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { POST } from "@/app/api/revalidate/route";

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.REVALIDATION_SECRET = "test-secret";
  });

  function createRequest(params: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return new NextRequest(`http://localhost:3000/api/revalidate?${searchParams}`, {
      method: "POST",
    });
  }

  it("returns 401 when secret is missing", async () => {
    const res = await POST(createRequest({ path: "/" }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Invalid secret");
  });

  it("returns 401 when secret is incorrect", async () => {
    const res = await POST(createRequest({ secret: "wrong", path: "/" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when path is missing", async () => {
    const res = await POST(createRequest({ secret: "test-secret" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing path parameter");
  });

  it("revalidates path successfully", async () => {
    const { revalidatePath } = await import("next/cache");
    const res = await POST(createRequest({ secret: "test-secret", path: "/post/ssc-cgl" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe("/post/ssc-cgl");
    expect(revalidatePath).toHaveBeenCalledWith("/post/ssc-cgl");
  });

  it("returns 500 when revalidation throws", async () => {
    const { revalidatePath } = await import("next/cache");
    (revalidatePath as any).mockImplementation(() => {
      throw new Error("Cache error");
    });
    const res = await POST(createRequest({ secret: "test-secret", path: "/failing" }));
    expect(res.status).toBe(500);
  });
});
