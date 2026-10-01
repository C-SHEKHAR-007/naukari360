import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// next/cache needs a Next.js request/incremental-cache context that doesn't exist under vitest.
vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}));
