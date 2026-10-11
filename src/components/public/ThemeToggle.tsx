"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "@/components/providers/ThemeProvider";
import { HoverHint } from "@/components/ui/HoverHint";
import { cn } from "@/lib/utils";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABELS: Record<ThemePreference, string> = {
  system: "Device theme",
  light: "Light theme",
  dark: "Dark theme",
};
const ICONS = { system: Monitor, light: Sun, dark: Moon };

// Cycles device → light → dark. The icon shows the current choice.
// `hint` shows a styled text label on hover instead of the native title tooltip.
export default function ThemeToggle({
  className = "",
  hint = false,
}: {
  className?: string;
  hint?: boolean;
}) {
  const { preference, setTheme, mounted } = useTheme();
  const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
  const Icon = ICONS[preference];

  // The server can't know the stored choice, and React doesn't patch attribute
  // mismatches on hydration, so use a neutral label until mounted.
  const label = mounted
    ? `${LABELS[preference]}. Switch to ${LABELS[next].toLowerCase()}`
    : "Change theme";

  const button = (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={cn(
        "rounded-lg p-2.5 text-muted transition-all hover:bg-surface hover:text-primary",
        className
      )}
      aria-label={label}
      title={hint ? undefined : label}
    >
      {mounted ? (
        <Icon className="h-[18px] w-[18px]" />
      ) : (
        <span className="inline-block h-[18px] w-[18px]" />
      )}
    </button>
  );

  return hint ? (
    <HoverHint label={mounted ? LABELS[preference] : "Theme"}>{button}</HoverHint>
  ) : (
    button
  );
}
