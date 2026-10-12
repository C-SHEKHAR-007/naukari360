import { cn } from "@/lib/utils";

// Text label that appears under an icon-only control on hover or keyboard focus.
// The control itself must still have an aria-label; the hint is visual only.
export function HoverHint({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group/hint relative inline-flex", className)}>
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-full z-50 mt-2 translate-y-1 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-all duration-150 group-focus-within/hint:translate-y-0 group-focus-within/hint:opacity-100 group-hover/hint:translate-y-0 group-hover/hint:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
