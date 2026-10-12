"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return !navigator.onLine;
}

function getServerSnapshot() {
  return false;
}

export default function OfflineIndicator() {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-warning-emphasis/25 bg-warning-subtle px-4 py-2 shadow-md">
      <WifiOff className="h-4 w-4 text-warning-emphasis" />
      <span className="text-sm font-medium text-warning-emphasis">
        You&apos;re offline — cached content available
      </span>
    </div>
  );
}
