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
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 text-5xl">😟</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          पेज लोड नहीं हो पाया
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।
        </p>
        {error.digest && <p className="mb-4 text-xs text-gray-400">Error ID: {error.digest}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-[#FF6B00] px-6 py-3 font-medium text-white transition-colors hover:bg-[#e55f00]"
          >
            दोबारा कोशिश करें
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            होम पेज पर जाएँ
          </Link>
        </div>
      </div>
    </div>
  );
}
