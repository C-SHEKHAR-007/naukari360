"use client";

import { useEffect, useState } from "react";

interface InterstitialCountdownProps {
  url: string;
  seconds?: number;
}

export default function InterstitialCountdown({ url, seconds = 5 }: InterstitialCountdownProps) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count <= 0) {
      window.location.href = url;
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, url]);

  return (
    <div className="my-8 flex flex-col items-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-border/40"></div>
        <div
          className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"
          style={{ animationDuration: `${seconds}s`, animationTimingFunction: "linear" }}
        ></div>
        <span className="text-4xl font-extrabold text-primary">{count}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-muted">
        Redirecting in {count} second{count !== 1 ? "s" : ""}...
      </p>
    </div>
  );
}
