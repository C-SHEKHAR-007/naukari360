"use client";

import { useEffect } from "react";

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `viewed_${postId}`;
    const lastViewed = sessionStorage.getItem(key);
    const now = Date.now();

    // Debounce: only track once per session per post (or after 30 min gap)
    if (lastViewed && now - parseInt(lastViewed) < 30 * 60 * 1000) return;

    sessionStorage.setItem(key, now.toString());
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => {});
  }, [postId]);

  return null;
}
