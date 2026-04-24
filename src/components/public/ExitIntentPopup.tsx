"use client";

import { useState, useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";

interface ExitIntentPopupProps {
  affiliateUrl?: string;
  affiliateName?: string;
  message?: string;
}

export default function ExitIntentPopup({
  affiliateUrl = "https://testbook.com/?ref=naukari360",
  affiliateName = "Testbook",
  message = "Wait! Get 50% OFF on exam preparation courses",
}: ExitIntentPopupProps) {
  const [show, setShow] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("exitIntentShown")) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !triggered.current) {
        triggered.current = true;
        sessionStorage.setItem("exitIntentShown", "true");
        setShow(true);
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-card p-6 shadow-2xl">
        <button
          onClick={() => setShow(false)}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-3xl mb-2">🎓</p>
          <h3 className="text-lg font-bold text-foreground">{message}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Prepare for government exams with {affiliateName}
          </p>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4" />
            Grab the Offer
          </a>
          <button
            onClick={() => setShow(false)}
            className="mt-3 block w-full text-xs text-muted-foreground hover:underline"
          >
            No thanks, I&apos;ll skip
          </button>
        </div>
      </div>
    </div>
  );
}
