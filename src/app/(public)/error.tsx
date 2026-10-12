"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[PublicError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl">😟</div>
        <h2 className="mb-2 text-xl font-bold text-foreground">पेज लोड नहीं हो पाया</h2>
        <p className="mb-6 text-muted-foreground">कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।</p>
        {error.digest && (
          <p className="mb-4 text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            दोबारा कोशिश करें
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent"
          >
            होम पेज पर जाएँ
          </Link>
        </div>
      </div>
    </div>
  );
}
