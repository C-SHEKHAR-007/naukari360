"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

const STORAGE_KEY = "notificationPrefs";

const CATEGORIES = [
  { id: "ssc", label: "SSC" },
  { id: "railway", label: "Railway" },
  { id: "banking", label: "Banking" },
  { id: "upsc", label: "UPSC" },
  { id: "state", label: "State Jobs" },
  { id: "defence", label: "Defence" },
  { id: "results", label: "Results" },
  { id: "admit-card", label: "Admit Cards" },
];

export interface NotificationPrefs {
  [key: string]: boolean;
}

function getStoredPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  // Default all categories to true
  return CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {});
}

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(getStoredPrefs);

  function toggleCategory(id: string) {
    const updated = { ...prefs, [id]: !prefs[id] };
    setPrefs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        <Bell className="h-4 w-4 text-primary" />
        Notification Preferences
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        Choose which job categories you want notifications for:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map((cat) => (
          <label
            key={cat.id}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1.5 text-xs transition-colors hover:bg-muted"
          >
            <input
              type="checkbox"
              checked={prefs[cat.id] ?? true}
              onChange={() => toggleCategory(cat.id)}
              className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-foreground">{cat.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
