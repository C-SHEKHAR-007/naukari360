"use client";

import { useState } from "react";
import { LayoutDashboard, Loader2, Check } from "lucide-react";
import { addJobToTracker } from "@/app/(public)/tracker/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TrackApplicationButton({ postId, initialTracked }: { postId: string; initialTracked: boolean }) {
  const [loading, setLoading] = useState(false);
  const [isCurrentlyTracked, setIsCurrentlyTracked] = useState(initialTracked);
  const { data: session } = useSession();
  const router = useRouter();

  async function handleTrack() {
    if (!session?.user) {
      router.push("/admin/login?callbackUrl=/tracker");
      return;
    }

    if (isCurrentlyTracked) {
      router.push("/tracker");
      return;
    }

    setLoading(true);
    try {
      await addJobToTracker(postId);
      setIsCurrentlyTracked(true);
    } catch (error) {
      console.error("Failed to add to tracker", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleTrack}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all active:scale-[0.97] ${
        isCurrentlyTracked
          ? "border-emerald-500/40 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
      }`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isCurrentlyTracked ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <LayoutDashboard className="h-3.5 w-3.5" />
      )}
      {isCurrentlyTracked ? "View in Tracker" : "Track Progress"}
    </button>
  );
}
