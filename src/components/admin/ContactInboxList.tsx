"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useIsSuperAdmin } from "@/components/admin/AdminRoleProvider";

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date | string;
}

export default function ContactInboxList({ submissions: initial }: { submissions: Submission[] }) {
  const isSuperAdmin = useIsSuperAdmin();
  const [submissions, setSubmissions] = useState(initial);
  const [selected, setSelected] = useState<string | null>(null);

  async function markRead(id: string) {
    await fetch(`/api/admin/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    });
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, isRead: true } : s)));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/admin/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSubmissions(submissions.filter((s) => s.id !== id));
      if (selected === id) setSelected(null);
    }
  }

  const selectedMsg = submissions.find((s) => s.id === selected);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
      {/* List */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="divide-y divide-border">
          {submissions.map((msg) => (
            <button
              key={msg.id}
              onClick={() => {
                setSelected(msg.id);
                if (!msg.isRead) markRead(msg.id);
              }}
              className={`w-full px-4 py-3 text-left transition-colors hover:bg-surface/50 ${selected === msg.id ? "bg-primary/5" : ""}`}
            >
              <div className="flex items-center gap-2">
                {msg.isRead ? (
                  <MailOpen className="h-4 w-4 text-muted" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
                <span
                  className={`text-sm ${msg.isRead ? "text-foreground" : "font-semibold text-foreground"}`}
                >
                  {msg.name}
                </span>
                <span className="ml-auto text-xs text-muted">
                  {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <p className="mt-0.5 truncate pl-6 text-xs text-muted">{msg.subject}</p>
            </button>
          ))}
          {submissions.length === 0 && (
            <div className="px-4 py-12 text-center text-muted">No messages yet</div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="rounded-xl border border-border p-6">
        {selectedMsg ? (
          <>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedMsg.subject}</h3>
                <p className="mt-1 text-sm text-muted">
                  From: <span className="text-foreground">{selectedMsg.name}</span> &lt;
                  {selectedMsg.email}&gt;
                </p>
                <div className="mt-1 flex gap-2">
                  <span className="rounded bg-surface px-2 py-0.5 text-xs text-muted">
                    {selectedMsg.type}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(selectedMsg.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {isSuperAdmin && (
                <button
                  onClick={() => handleDelete(selectedMsg.id)}
                  className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {selectedMsg.message}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            Select a message to view
          </div>
        )}
      </div>
    </div>
  );
}
