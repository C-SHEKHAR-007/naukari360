"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Thin top bar that appears the moment an internal link is clicked and
// disappears once the new route has rendered.
function ProgressBar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [active, setActive] = useState(false);

  // Route changed → navigation finished
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(false);
  }, [pathname, search]);

  useEffect(() => {
    // Capture phase: next/link always calls preventDefault() to do client-side
    // navigation, so a bubble-phase listener can't tell a Link click from a cancelled one.
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      // Controls inside a link (e.g. the bookmark button on a job card) handle the click themselves
      const control = target?.closest("button, input, select, textarea, [role='button']");
      if (control && anchor.contains(control)) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search)
        return;
      setActive(true);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Never leave the bar stuck if a navigation is cancelled
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 15000);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden"
      role="progressbar"
      aria-label="Loading page"
    >
      <div className="nav-progress h-full bg-primary" />
    </div>
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
