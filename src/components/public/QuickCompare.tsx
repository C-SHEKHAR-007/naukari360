"use client";

import { useState, useEffect } from "react";
import { X, GitCompareArrows } from "lucide-react";

interface ComparePost {
  id: string;
  titleEn: string;
  slug: string;
  organization?: string;
  qualification?: string;
  salary?: string;
  ageLimit?: string;
  lastDate?: string;
  totalPosts?: string;
  feeGeneral?: string;
}

const STORAGE_KEY = "compare_posts";

export default function QuickCompare() {
  const [posts, setPosts] = useState<ComparePost[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    function handleCompareUpdate() {
      const data = localStorage.getItem(STORAGE_KEY);
      setPosts(data ? JSON.parse(data) : []);
    }

    window.addEventListener("compare-updated", handleCompareUpdate);
    return () => window.removeEventListener("compare-updated", handleCompareUpdate);
  }, []);

  function removePost(id: string) {
    const updated = posts.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPosts(updated);
    window.dispatchEvent(new Event("compare-updated"));
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    setPosts([]);
    setShowTable(false);
    window.dispatchEvent(new Event("compare-updated"));
  }

  if (posts.length === 0) return null;

  return (
    <>
      {/* Floating bar */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2.5 shadow-lg">
        <div className="flex items-center gap-3">
          <GitCompareArrows className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {posts.length} job{posts.length > 1 ? "s" : ""} selected
          </span>
          {posts.length >= 2 && (
            <button
              onClick={() => setShowTable(true)}
              className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary-dark"
            >
              Compare
            </button>
          )}
          <button onClick={clearAll} className="text-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comparison modal */}
      {showTable && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Job Comparison</h2>
              <button
                onClick={() => setShowTable(false)}
                className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-medium text-muted">Field</th>
                    {posts.map((p) => (
                      <th key={p.id} className="px-3 py-2 text-left font-medium text-foreground">
                        <div className="flex items-center gap-1">
                          <span className="line-clamp-2">{p.titleEn}</span>
                          <button
                            onClick={() => removePost(p.id)}
                            className="ml-1 shrink-0 text-red-400 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { label: "Organization", key: "organization" },
                    { label: "Total Posts", key: "totalPosts" },
                    { label: "Qualification", key: "qualification" },
                    { label: "Salary", key: "salary" },
                    { label: "Age Limit", key: "ageLimit" },
                    { label: "Fee (General)", key: "feeGeneral" },
                    { label: "Last Date", key: "lastDate" },
                  ].map((row) => (
                    <tr key={row.key} className="hover:bg-surface/50">
                      <td className="px-3 py-2 font-medium text-muted">{row.label}</td>
                      {posts.map((p) => (
                        <td key={p.id} className="px-3 py-2 text-foreground">
                          {(p as unknown as Record<string, string | undefined>)[row.key] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearAll}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Utility to add a post to compare (call from PostCard)
export function addToCompare(post: ComparePost) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const posts: ComparePost[] = stored ? JSON.parse(stored) : [];
  if (posts.length >= 3) return false;
  if (posts.find((p) => p.id === post.id)) return false;
  posts.push(post);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event("compare-updated"));
  return true;
}

export function removeFromCompare(postId: string) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const posts: ComparePost[] = stored ? JSON.parse(stored) : [];
  const updated = posts.filter((p) => p.id !== postId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("compare-updated"));
}

export function isInCompare(postId: string): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  const posts: ComparePost[] = JSON.parse(stored);
  return posts.some((p) => p.id === postId);
}
