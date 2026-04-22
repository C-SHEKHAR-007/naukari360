"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted print:hidden"
      aria-label="Print this page"
    >
      <Printer className="h-4 w-4" />
      Print
    </button>
  );
}
