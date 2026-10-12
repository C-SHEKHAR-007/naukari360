import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// next/cache needs a Next.js request/incremental-cache context that doesn't exist under vitest.
vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}));

// Node 22+ ships its own `localStorage` global, which is undefined unless Node runs with
// --localstorage-file and shadows jsdom's implementation. Install an in-memory one.
if (typeof window !== "undefined" && !window.localStorage) {
  class MemoryStorage implements Storage {
    private store = new Map<string, string>();
    get length() {
      return this.store.size;
    }
    clear() {
      this.store.clear();
    }
    getItem(key: string) {
      return this.store.has(key) ? this.store.get(key)! : null;
    }
    key(index: number) {
      return Array.from(this.store.keys())[index] ?? null;
    }
    removeItem(key: string) {
      this.store.delete(key);
    }
    setItem(key: string, value: string) {
      this.store.set(key, String(value));
    }
  }
  for (const name of ["localStorage", "sessionStorage"] as const) {
    Object.defineProperty(globalThis, name, {
      value: new MemoryStorage(),
      configurable: true,
      writable: true,
    });
    Object.defineProperty(window, name, {
      value: globalThis[name],
      configurable: true,
      writable: true,
    });
  }
}
