"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/post/${slug}` : `/post/${slug}`;
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-8 flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-surface/50 px-5 py-4 dark:bg-card">
      <Share2 className="h-4 w-4 text-muted/70" />
      <span className="text-sm font-semibold text-foreground/70">Share:</span>
      <a
        href={`https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-green-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md active:scale-[0.97]"
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#0088cc] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#006fa8] hover:shadow-md active:scale-[0.97]"
      >
        Telegram
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-black hover:shadow-md dark:bg-gray-700 dark:hover:bg-gray-600 active:scale-[0.97]"
      >
        X
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary active:scale-[0.97]"
      >
        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
