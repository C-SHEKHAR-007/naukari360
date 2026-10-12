"use client";

import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { findNavItem } from "./nav";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons/links shown on the right (stacked below on small screens) */
  actions?: React.ReactNode;
  /** Defaults to the icon of the matching sidebar entry */
  icon?: LucideIcon;
  className?: string;
}

// Consistent title block for every admin page
export default function PageHeader({
  title,
  description,
  actions,
  icon,
  className,
}: PageHeaderProps) {
  const pathname = usePathname();
  const Icon = icon ?? findNavItem(pathname)?.item.icon;

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-primary text-primary-foreground shadow-md shadow-primary/20">
            <Icon className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
            {title}
          </h1>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
