"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Side = "right" | "bottom";

// Floating label for icon-only controls (collapsed sidebar). Rendered in a portal
// with fixed positioning so overflow-hidden/scroll containers can't clip it.
// Visual only: the control itself must still have an aria-label.
export function Tooltip({
  label,
  side = "right",
  children,
  className,
}: {
  label: string;
  side?: Side;
  children: React.ReactNode;
  className?: string;
}) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const place = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords(
      side === "right"
        ? { left: rect.right + 12, top: rect.top + rect.height / 2 }
        : { left: rect.left + rect.width / 2, top: rect.bottom + 8 }
    );
  };
  const hide = () => setCoords(null);

  useEffect(() => {
    if (!coords) return;
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [coords]);

  return (
    <span
      ref={ref}
      className={cn("relative inline-flex", className)}
      onMouseEnter={place}
      onMouseLeave={hide}
      onFocus={place}
      onBlur={hide}
      onClick={hide}
    >
      {children}
      {coords &&
        createPortal(
          <span
            role="tooltip"
            aria-hidden="true"
            style={{
              top: coords.top,
              left: coords.left,
              translate: side === "right" ? "0 -50%" : "-50% 0",
            }}
            className="animate-tooltip-in pointer-events-none fixed z-[100] whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-lg"
          >
            {label}
          </span>,
          document.body
        )}
    </span>
  );
}
