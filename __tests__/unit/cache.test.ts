import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mimic Next's real behaviour: unstable_cache JSON-serializes cached values
vi.mock("next/cache", () => ({
  unstable_cache: vi.fn(
    (fn: (...args: unknown[]) => Promise<unknown>) =>
      async (...args: unknown[]) =>
        JSON.parse(JSON.stringify(await fn(...args)))
  ),
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/server", () => ({
  connection: vi.fn().mockRejectedValue(new Error("dynamic bailout")),
}));

import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { connection } from "next/server";
import {
  cached,
  withInvalidation,
  invalidatePublicContent,
  CONTENT_TAG,
  REVALIDATE_SECONDS,
} from "@/lib/cache";

describe("cached()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers the function with the content tag and revalidate window", () => {
    const fn = vi.fn().mockResolvedValue(null);
    cached(fn, "myKey");
    expect(unstable_cache).toHaveBeenCalledWith(fn, ["myKey"], {
      tags: [CONTENT_TAG],
      revalidate: REVALIDATE_SECONDS,
    });
  });

  it("revives Date fields lost by JSON serialization, including nested ones", async () => {
    const created = new Date("2026-01-02T03:04:05.000Z");
    const getPost = cached(
      async () => ({
        createdAt: created,
        lastDate: null,
        title: "2026-01-02 not a timestamp",
        importantDates: [{ date: new Date("2026-05-01T00:00:00.000Z") }],
      }),
      "post"
    );

    const post = await getPost();
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(post.createdAt.getTime()).toBe(created.getTime());
    expect(post.importantDates[0].date).toBeInstanceOf(Date);
    expect(post.lastDate).toBeNull();
    expect(post.title).toBe("2026-01-02 not a timestamp");
  });

  it("passes arguments through to the wrapped function", async () => {
    const fn = vi.fn(async (slug: string, limit: number) => ({ slug, limit }));
    const wrapped = cached(fn, "args");
    expect(await wrapped("jobs", 6)).toEqual({ slug: "jobs", limit: 6 });
    expect(fn).toHaveBeenCalledWith("jobs", 6);
  });

  describe("when the query fails", () => {
    const originalPhase = process.env.NEXT_PHASE;
    afterEach(() => {
      process.env.NEXT_PHASE = originalPhase;
    });

    it("rethrows at runtime without touching connection()", async () => {
      delete process.env.NEXT_PHASE;
      const failing = cached(async () => {
        throw new Error("db down");
      }, "fail");
      await expect(failing()).rejects.toThrow("db down");
      expect(connection).not.toHaveBeenCalled();
    });

    it("bails out to dynamic rendering during a build without a DB", async () => {
      process.env.NEXT_PHASE = "phase-production-build";
      const failing = cached(async () => {
        throw new Error("db down");
      }, "fail");
      await expect(failing()).rejects.toThrow("dynamic bailout");
      expect(connection).toHaveBeenCalled();
    });
  });
});

describe("invalidatePublicContent()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("expires the content tag and the whole route tree", () => {
    invalidatePublicContent();
    expect(revalidateTag).toHaveBeenCalledWith(CONTENT_TAG, { expire: 0 });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});

describe("withInvalidation()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalidates after a successful response and returns it unchanged", async () => {
    const res = new Response("ok", { status: 201 });
    const handler = withInvalidation(async () => res);
    expect(await handler()).toBe(res);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("does not invalidate when the handler returns an error response", async () => {
    const handler = withInvalidation(async () => new Response("bad", { status: 400 }));
    await handler();
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("forwards the request arguments to the handler", async () => {
    const inner = vi.fn<(req: Request, ctx: { id: string }) => Promise<Response>>(
      async () => new Response(null)
    );
    await withInvalidation(inner)(new Request("http://x"), { id: "1" });
    expect(inner).toHaveBeenCalledWith(expect.any(Request), { id: "1" });
  });
});
