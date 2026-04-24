"use client";

import { useState } from "react";
import { BookmarkCheck, Trash2 } from "lucide-react";
import Link from "next/link";

interface TrackedJob {
  slug: string;
  title: string;
  status: "saved" | "applied" | "interested";
  addedAt: string;
}

const STORAGE_KEY = "applicationTracker";

export function addToTracker(job: { slug: string; title: string }, status: TrackedJob["status"]) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const jobs: TrackedJob[] = stored ? JSON.parse(stored) : [];

  // Don't duplicate
  if (jobs.some((j) => j.slug === job.slug)) {
    // Update status
    const updated = jobs.map((j) => (j.slug === job.slug ? { ...j, status } : j));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return;
  }

  jobs.unshift({ ...job, status, addedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs.slice(0, 50)));
}

export function removeFromTracker(slug: string) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  const jobs: TrackedJob[] = JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs.filter((j) => j.slug !== slug)));
}

export default function ApplicationTracker() {
  const [jobs, setJobs] = useState<TrackedJob[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [filter, setFilter] = useState<TrackedJob["status"] | "all">("all");

  function handleRemove(slug: string) {
    removeFromTracker(slug);
    setJobs((prev) => prev.filter((j) => j.slug !== slug));
  }

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        <BookmarkCheck className="h-4 w-4 text-primary" />
        My Job Tracker
      </h3>

      <div className="mb-3 flex gap-1">
        {(["all", "saved", "applied", "interested"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-md px-2 py-1 text-xs capitalize transition-colors ${
              filter === s
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground">No jobs tracked yet.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {filtered.map((job) => (
            <li key={job.slug} className="flex items-center justify-between gap-2 text-sm">
              <Link
                href={`/post/${job.slug}`}
                className="text-foreground hover:text-primary line-clamp-1 flex-1"
              >
                {job.title}
              </Link>
              <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary capitalize">
                {job.status}
              </span>
              <button
                onClick={() => handleRemove(job.slug)}
                className="shrink-0 text-muted-foreground hover:text-red-500"
                aria-label={`Remove ${job.title} from tracker`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
