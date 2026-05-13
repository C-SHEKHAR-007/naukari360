"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useIsSuperAdmin } from "@/components/admin/AdminRoleProvider";

interface Announcement {
  id: string;
  text: string;
  link: string | null;
  isActive: boolean;
  displayOrder: number;
}

export default function AnnouncementsManager({
  initialAnnouncements,
}: {
  initialAnnouncements: Announcement[];
}) {
  const isSuperAdmin = useIsSuperAdmin();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setText("");
    setLink("");
    setIsActive(true);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(item: Announcement) {
    setText(item.text);
    setLink(item.link || "");
    setIsActive(item.isActive);
    setEditing(item);
    setShowForm(true);
  }

  async function handleSave() {
    if (!text.trim()) return;
    setSaving(true);

    const body = {
      text: text.trim(),
      link: link.trim() || null,
      isActive,
      displayOrder: editing ? editing.displayOrder : announcements.length,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/admin/announcements/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const updated = await res.json();
          setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        }
      } else {
        const res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const created = await res.json();
          setAnnouncements((prev) => [...prev, created]);
        }
      }
      resetForm();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (res.ok) setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  async function toggleActive(item: Announcement) {
    const res = await fetch(`/api/admin/announcements/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, isActive: !item.isActive }),
    });
    if (res.ok) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, isActive: !a.isActive } : a))
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Announcement
        </button>
      </div>

      {/* List */}
      <div className="rounded-lg border border-border bg-card">
        {announcements.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted">No announcements yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {announcements.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface/50">
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${item.isActive ? "text-foreground" : "text-muted line-through"}`}
                  >
                    {item.text}
                  </p>
                  {item.link && <p className="text-xs text-muted truncate">{item.link}</p>}
                </div>
                <button
                  onClick={() => toggleActive(item)}
                  className="rounded p-1.5 text-muted hover:bg-surface"
                >
                  {item.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {editing ? "Edit Announcement" : "Add Announcement"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Text *</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                placeholder="e.g. SSC CGL 2025 Application closes on 30th June!"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Link URL (optional)
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-muted">Active</span>
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !text.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : editing ? "Update" : "Add"}
            </button>
            <button
              onClick={resetForm}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
