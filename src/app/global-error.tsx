"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mb-6 text-gray-600">An unexpected error occurred. Please try again.</p>
          {error.digest && <p className="mb-4 text-xs text-gray-400">Error ID: {error.digest}</p>}
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-[#FF6B00] px-6 py-3 font-medium text-white transition-colors hover:bg-[#e55f00]"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
