import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { connection } from "next/server";

// Tag attached to every cached public-content query. Admin mutations
// invalidate it so edits show up immediately instead of after REVALIDATE_SECONDS.
export const CONTENT_TAG = "content";
export const REVALIDATE_SECONDS = 300;

// unstable_cache JSON-serializes results, which turns Date objects into strings.
// Revive ISO timestamps so cached Prisma rows keep their Date fields.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

function reviveDates<T>(value: T): T {
  if (typeof value === "string") {
    return (ISO_DATE.test(value) ? new Date(value) : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map(reviveDates) as T;
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = reviveDates(v);
    return out as T;
  }
  return value;
}

export function cached<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  key: string
): (...args: Args) => Promise<R> {
  const cachedFn = unstable_cache(fn, [key], {
    tags: [CONTENT_TAG],
    revalidate: REVALIDATE_SECONDS,
  });
  return async (...args: Args) => {
    try {
      return reviveDates(await cachedFn(...args));
    } catch (err) {
      // Builds without a reachable DB (Docker/CI use a dummy DATABASE_URL): bail this
      // route out to request-time rendering instead of failing the build.
      if (process.env.NEXT_PHASE === "phase-production-build") await connection();
      throw err;
    }
  };
}

// Call after any admin write that affects public pages.
export function invalidatePublicContent() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

// Wraps an admin Route Handler so a successful write clears the public cache.
export function withInvalidation<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>
): (...args: Args) => Promise<Response> {
  return async (...args: Args) => {
    const res = await handler(...args);
    if (res.ok) invalidatePublicContent();
    return res;
  };
}
