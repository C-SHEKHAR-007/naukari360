"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function AdminSearch({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    // Only debounce if the query actually changed relative to URL,
    // otherwise it might trigger an infinite loop if searchParams changes for other reasons (like status toggle).
    const currentQ = searchParams.get("q") || "";
    if (query === currentQ) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset to page 1 on new search
      
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, pathname, searchParams]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isPending ? "text-primary animate-pulse" : "text-muted"}`} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
