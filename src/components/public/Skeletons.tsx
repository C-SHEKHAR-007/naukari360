// Server-rendered placeholders shown by loading.tsx while a route streams in.

export function PostCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-1.5">
        <div className="skeleton h-4 w-12 rounded-md" />
        <div className="skeleton h-4 w-20 rounded-md" />
      </div>
      <div className="skeleton h-5 w-full rounded" />
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="mt-auto flex justify-between pt-2">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-14 rounded" />
      </div>
    </div>
  );
}

export function PostGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListingPageSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="mb-8 space-y-2">
        <div className="skeleton h-8 w-56 rounded" />
        <div className="skeleton h-4 w-40 rounded" />
      </div>
      <PostGridSkeleton />
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="skeleton h-3 w-48 rounded" />
          <div className="skeleton h-8 w-full rounded" />
          <div className="skeleton h-8 w-2/3 rounded" />
          <div className="flex gap-3">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
          <div className="space-y-2 pt-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`skeleton h-4 rounded ${i % 3 === 2 ? "w-4/5" : "w-full"}`} />
            ))}
          </div>
        </div>
        <div className="space-y-4 lg:col-span-4">
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
