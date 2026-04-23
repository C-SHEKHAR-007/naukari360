"use client";

import { useState, useEffect } from "react";
import { AArrowUp, AArrowDown } from "lucide-react";

const STORAGE_KEY = "textSize";
const MIN_SIZE = 14;
const MAX_SIZE = 22;
const DEFAULT_SIZE = 16;
const STEP = 2;

export default function TextSizeControl() {
  const [size, setSize] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_SIZE;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= MIN_SIZE && parsed <= MAX_SIZE) return parsed;
    }
    return DEFAULT_SIZE;
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--article-font-size", `${size}px`);
  }, [size]);

  function changeSize(delta: number) {
    const newSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, size + delta));
    setSize(newSize);
    localStorage.setItem(STORAGE_KEY, String(newSize));
    document.documentElement.style.setProperty("--article-font-size", `${newSize}px`);
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-background">
      <button
        onClick={() => changeSize(-STEP)}
        disabled={size <= MIN_SIZE}
        className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
        aria-label="Decrease text size"
      >
        <AArrowDown className="h-4 w-4" />
      </button>
      <span className="min-w-[2rem] text-center text-xs text-muted-foreground">{size}px</span>
      <button
        onClick={() => changeSize(STEP)}
        disabled={size >= MAX_SIZE}
        className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
        aria-label="Increase text size"
      >
        <AArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
