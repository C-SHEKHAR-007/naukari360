"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue = "" }: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, results, admit cards..."
          className="w-full rounded-xl border border-border/80 bg-card py-3.5 pl-12 pr-4 text-foreground shadow-[var(--shadow-sm)] placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-[var(--shadow-md)]"
          autoFocus
        />
      </div>
    </form>
  );
}
