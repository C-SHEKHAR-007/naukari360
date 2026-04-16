"use client";

import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter_dismissed");
    const subscribed = localStorage.getItem("newsletter_subscribed");
    if (dismissed || subscribed) return;

    const timer = setTimeout(() => setShow(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  function handleDismiss() {
    setShow(false);
    localStorage.setItem("newsletter_dismissed", Date.now().toString());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed!");
        localStorage.setItem("newsletter_subscribed", "true");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Stay Updated!</h3>
            <p className="text-sm text-muted">नई नौकरी की सूचना पाएं</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <p className="font-medium text-green-700 dark:text-green-400">{message}</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">
              Get instant notifications for latest government jobs, results, and admit cards
              directly in your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {status === "error" && <p className="text-xs text-red-500">{message}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe Free"}
              </button>
            </form>
            <p className="mt-3 text-center text-xs text-muted">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}
