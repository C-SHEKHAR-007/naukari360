import { describe, it, expect, vi, beforeAll } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import vm from "vm";

// Runs public/sw.js in a sandbox and checks which requests its fetch handler takes over.
type FetchHandler = (event: { request: FakeRequest; respondWith: (r: unknown) => void }) => void;

interface FakeRequest {
  url: string;
  method: string;
  mode: string;
  headers: { get: (name: string) => string | null };
}

let fetchHandler: FetchHandler;
let cacheName: string;

beforeAll(() => {
  const listeners: Record<string, FetchHandler> = {};
  const cache = {
    put: vi.fn(),
    match: vi.fn(),
    keys: vi.fn().mockResolvedValue([]),
    delete: vi.fn(),
  };
  const sandbox = {
    self: {
      location: { origin: "https://naukari360.in" },
      addEventListener: (type: string, fn: FetchHandler) => (listeners[type] = fn),
      skipWaiting: vi.fn(),
      clients: { claim: vi.fn() },
    },
    caches: {
      open: vi.fn().mockResolvedValue(cache),
      match: vi.fn().mockResolvedValue(undefined),
      keys: vi.fn().mockResolvedValue([]),
    },
    fetch: vi.fn().mockResolvedValue({ ok: true, clone: () => ({}) }),
    Response,
    URL,
    Promise,
  };
  const src = readFileSync(path.join(__dirname, "../../public/sw.js"), "utf8");
  vm.runInNewContext(`${src}\n;globalThis.__CACHE_NAME = CACHE_NAME;`, sandbox);
  fetchHandler = listeners.fetch;
  cacheName = (sandbox as unknown as { __CACHE_NAME: string }).__CACHE_NAME;
});

function request(
  pathname: string,
  opts: { mode?: string; method?: string; headers?: Record<string, string> } = {}
) {
  const headers = opts.headers ?? {};
  return {
    url: `https://naukari360.in${pathname}`,
    method: opts.method ?? "GET",
    mode: opts.mode ?? "navigate",
    headers: { get: (name: string) => headers[name] ?? null },
  };
}

function isHandled(req: FakeRequest) {
  const respondWith = vi.fn();
  fetchHandler({ request: req, respondWith });
  return respondWith.mock.calls.length > 0;
}

describe("service worker fetch handler", () => {
  it("uses a new cache version so stale RSC payloads from v1 are purged", () => {
    expect(cacheName).not.toBe("naukari360-v1");
  });

  it("handles full page loads of posts and other pages (offline support)", () => {
    expect(isHandled(request("/post/ssc-cgl-2025"))).toBe(true);
    expect(isHandled(request("/latest-jobs"))).toBe(true);
  });

  it("leaves Next.js client navigations and prefetches (RSC) to the network", () => {
    expect(isHandled(request("/post/ssc-cgl-2025", { mode: "cors", headers: { RSC: "1" } }))).toBe(
      false
    );
    expect(isHandled(request("/latest-jobs?_rsc=abc123", { mode: "cors" }))).toBe(false);
  });

  it("does not intercept non-navigation requests for pages", () => {
    expect(isHandled(request("/post/ssc-cgl-2025", { mode: "cors" }))).toBe(false);
  });

  it("skips API, admin, Next internals, non-GET and cross-origin requests", () => {
    expect(isHandled(request("/api/comments"))).toBe(false);
    expect(isHandled(request("/admin/posts"))).toBe(false);
    expect(isHandled(request("/_next/static/chunks/app.js", { mode: "no-cors" }))).toBe(false);
    expect(isHandled(request("/post/x", { method: "POST" }))).toBe(false);
    expect(isHandled({ ...request("/"), url: "https://example.com/" })).toBe(false);
  });

  it("still caches static public assets", () => {
    expect(isHandled(request("/icons/icon-192x192.svg", { mode: "no-cors" }))).toBe(true);
  });
});
