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
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950">
        <div className="mb-4 text-5xl">🚨</div>
        <h2 className="mb-2 text-xl font-bold text-red-900 dark:text-red-100">Admin Panel Error</h2>
        <p className="mb-6 text-red-700 dark:text-red-300">
          Something went wrong while loading this section. Your data is safe.
        </p>
        {error.digest && <p className="mb-4 text-xs text-red-400">Error ID: {error.digest}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
          >
            Retry
          </button>
          <button
            onClick={() => (window.location.href = "/admin")}
            className="rounded-lg border border-red-300 px-6 py-3 font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
