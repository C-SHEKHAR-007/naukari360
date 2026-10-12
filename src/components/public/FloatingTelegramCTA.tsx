"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingTelegramCTA({ telegramUrl }: { telegramUrl?: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (!telegramUrl || dismissed) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30 sm:right-6 lg:bottom-6 flex items-center gap-2 print:hidden">
      {/* The whole bubble is the link (48px), not just the icon */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-telegram text-white shadow-lg"
        aria-label="Join our Telegram channel"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <button
        onClick={() => setDismissed(true)}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground"
        aria-label="Dismiss Telegram button"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
