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
      <body className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="w-full max-w-md rounded-lg bg-card p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p className="mb-4 text-xs text-muted-foreground">Error ID: {error.digest}</p>
          )}
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
