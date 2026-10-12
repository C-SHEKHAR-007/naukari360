"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Loader2, Check } from "lucide-react";
import { addJobToTracker } from "@/app/(public)/tracker/actions";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TrackApplicationButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);
  const [isCurrentlyTracked, setIsCurrentlyTracked] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Tracked status is per-user, so it's loaded client-side to keep the post page cacheable
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetch(`/api/post-user-state?postId=${postId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.isTracked) setIsCurrentlyTracked(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId, postId]);
  const router = useRouter();

  async function handleTrack() {
    if (!session?.user) {
      // Site users sign in with Google and come back to this job
      signIn("google", { callbackUrl: window.location.href });
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
          ? "border-success-emphasis/40 bg-success-subtle text-success-emphasis"
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
