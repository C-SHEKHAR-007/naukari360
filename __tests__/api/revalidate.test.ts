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

  function createRequest(body: unknown) {
    return new NextRequest("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid JSON body");
  });

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

  it("returns 400 when path is not a string", async () => {
    const res = await POST(createRequest({ secret: "test-secret", path: 123 }));
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
    expect(data.timestamp).toBeTypeOf("number");
    expect(revalidatePath).toHaveBeenCalledWith("/post/ssc-cgl");
  });

  it("returns 500 when revalidation throws", async () => {
    const { revalidatePath } = await import("next/cache");
    (revalidatePath as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("Cache error");
    });
    const res = await POST(createRequest({ secret: "test-secret", path: "/failing" }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Revalidation failed");
  });

  it("does not leak secret in URL query params", async () => {
    // Old-style query param request should fail (no body)
    const req = new NextRequest(
      "http://localhost:3000/api/revalidate?secret=test-secret&path=/test",
      { method: "POST" }
    );
    const res = await POST(req);
    // Without JSON body, should return 400
    expect(res.status).toBe(400);
  });
});
