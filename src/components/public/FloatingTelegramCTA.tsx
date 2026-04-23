"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingTelegramCTA({ telegramUrl }: { telegramUrl?: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (!telegramUrl || dismissed) return null;

  return (
    <div className="fixed bottom-20 right-6 z-30 flex items-center gap-2 print:hidden">
      <div className="animate-bounce rounded-full bg-[#0088cc] p-3 shadow-lg">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white"
          aria-label="Join our Telegram channel"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="rounded-full bg-background p-1 shadow-sm border border-border text-muted-foreground hover:text-foreground"
        aria-label="Dismiss Telegram button"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
