"use client";

import { useState } from "react";
import { updateTrackerStatus, removeTrackerItem } from "@/app/(public)/tracker/actions";
import Link from "next/link";
import { Clock, MapPin, Trash2, Calendar, FileText, CheckCircle2, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";

type TrackedJob = {
  id: string;
  status: string;
  createdAt: Date;
  post: {
    titleEn: string;
    titleHi: string | null;
    slug: string;
    organization: string | null;
    state: { name: string } | null;
    lastDate: Date | null;
  };
};

const COLUMNS = [
  { id: "interested", label: "Interested", icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "applied", label: "Applied", icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { id: "admit_card", label: "Admit Card Out", icon: FileText, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { id: "result", label: "Result Declared", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
];

export default function TrackerBoard({ initialData }: { initialData: TrackedJob[] }) {
  const [data, setData] = useState<TrackedJob[]>(initialData);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: string) {
    setLoadingId(id);
    // Optimistic update
    const previous = [...data];
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));

    try {
      await updateTrackerStatus(id, newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
      setData(previous); // Revert
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRemove(id: string) {
    const confirmDelete = window.confirm("Remove this job from your tracker?");
    if (!confirmDelete) return;

    setLoadingId(id);
    const previous = [...data];
    setData((prev) => prev.filter((item) => item.id !== id));

    try {
      await removeTrackerItem(id);
    } catch (err) {
      console.error("Failed to remove item", err);
      setData(previous);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const columnJobs = data.filter((item) => item.status === col.id);

        return (
          <div key={col.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <col.icon className={`h-4 w-4 ${col.color}`} />
                {col.label}
              </h2>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${col.bg} ${col.color}`}>
                {columnJobs.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {columnJobs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted">
                  No jobs here
                </div>
              ) : (
                columnJobs.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col gap-2 rounded-lg border border-border bg-background p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md ${
                      loadingId === item.id ? "opacity-50" : ""
                    }`}
                  >
                    <Link
                      href={`/post/${item.post.slug}`}
                      className="font-semibold leading-snug text-foreground hover:text-primary line-clamp-2 text-sm"
                    >
                      {item.post.titleEn}
                    </Link>
                    
                    {item.post.organization && (
                      <p className="text-xs text-muted truncate">{item.post.organization}</p>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      {item.post.state && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" /> {item.post.state.name}
                        </span>
                      )}
                      {item.post.lastDate && (
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" /> {formatDate(item.post.lastDate)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                      <div className="relative inline-block w-full max-w-[120px]">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`w-full appearance-none rounded border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground outline-none transition-colors hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary`}
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 text-muted-foreground" />
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        title="Remove from tracker"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
