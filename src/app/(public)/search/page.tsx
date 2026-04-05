import type { Metadata } from "next";
import { searchPosts } from "@/lib/db";
import PostCard from "@/components/public/PostCard";
import { PostListEmpty } from "@/components/public/Pagination";
import SearchInput from "@/components/public/SearchInput";

export const metadata: Metadata = {
  title: "Search Government Jobs",
  description: "Search for government job notifications, results, admit cards, and more.",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchPosts(query, 30) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 lg:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Search Jobs
        </h1>
        <p className="mt-2 text-sm text-muted">
          Find government job notifications, results, and admit cards
        </p>
      </div>

      <SearchInput defaultValue={query} />

      {query && (
        <p className="mb-6 text-sm text-muted">
          Found <strong className="text-foreground">{results.length}</strong> result
          {results.length !== 1 ? "s" : ""} for &ldquo;
          <span className="font-medium text-foreground">{query}</span>&rdquo;
        </p>
      )}

      {query && results.length === 0 && <PostListEmpty />}

      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
