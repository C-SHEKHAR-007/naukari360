"use client";

import { useState } from "react";
import { Send, Trash2, ExternalLink } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  sentAt: string | null;
}

export default function NotificationComposer({
  notifications: initialNotifications,
}: {
  notifications: Notification[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [form, setForm] = useState({ title: "", message: "", link: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.message) return;

    setSending(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const notification = await res.json();
        setNotifications([notification, ...notifications]);
        setForm({ title: "", message: "", link: "" });
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this notification?")) return;
    const res = await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  }

  return (
    <div className="space-y-8">
      {/* Compose form */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Compose Notification</h3>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., SSC CGL 2025 Result Out!"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Brief notification message..."
              required
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm resize-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Link <span className="text-muted">(optional)</span>
            </label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://naukari360.in/post/..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Notification"}
            </button>
            {status === "success" && (
              <span className="text-sm text-green-600">Notification sent!</span>
            )}
            {status === "error" && <span className="text-sm text-red-500">Failed to send</span>}
          </div>
        </form>
      </div>

      {/* History */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Sent Notifications ({notifications.length})
        </h3>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="space-y-1">
                <h4 className="font-medium text-foreground">{n.title}</h4>
                <p className="text-sm text-muted">{n.message}</p>
                <div className="flex items-center gap-3 text-xs text-muted">
                  {n.sentAt && <span>Sent: {new Date(n.sentAt).toLocaleString("en-IN")}</span>}
                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Link
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(n.id)}
                className="rounded p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="py-8 text-center text-muted">No notifications sent yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
