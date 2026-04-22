"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";

interface CopyJobDetailsProps {
  title: string;
  organization?: string | null;
  qualification?: string | null;
  lastDate?: string | null;
  salary?: string | null;
  applyLink?: string | null;
  url: string;
}

export default function CopyJobDetails({
  title,
  organization,
  qualification,
  lastDate,
  salary,
  applyLink,
  url,
}: CopyJobDetailsProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const lines = [
      `📋 ${title}`,
      organization ? `🏢 ${organization}` : null,
      qualification ? `🎓 ${qualification}` : null,
      salary ? `💰 ${salary}` : null,
      lastDate ? `📅 Last Date: ${lastDate}` : null,
      applyLink ? `🔗 Apply: ${applyLink}` : null,
      `\n👉 Details: ${url}`,
      `\n— via Naukari360.in`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      aria-label="Copy job details"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardCopy className="h-4 w-4" />
          Copy Info
        </>
      )}
    </button>
  );
}
