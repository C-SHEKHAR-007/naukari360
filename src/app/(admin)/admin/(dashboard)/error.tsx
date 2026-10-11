"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-danger-emphasis/25 bg-danger-subtle p-8 text-center">
        <div className="mb-4 text-5xl">🚨</div>
        <h2 className="mb-2 text-xl font-bold text-danger-emphasis">Admin Panel Error</h2>
        <p className="mb-6 text-danger-emphasis">
          Something went wrong while loading this section. Your data is safe.
        </p>
        {error.digest && (
          <p className="mb-4 text-xs text-danger-emphasis/70">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-danger px-6 py-3 font-medium text-white transition-colors hover:bg-danger/90"
          >
            Retry
          </button>
          <button
            onClick={() => (window.location.href = "/admin")}
            className="rounded-lg border border-danger-emphasis/40 px-6 py-3 font-medium text-danger-emphasis transition-colors hover:bg-danger-emphasis/10"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
