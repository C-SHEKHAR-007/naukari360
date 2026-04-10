"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function BannersManager({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle("");
    setImageUrl("");
    setLink("");
    setIsActive(true);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(banner: Banner) {
    setTitle(banner.title);
    setImageUrl(banner.imageUrl);
    setLink(banner.link || "");
    setIsActive(banner.isActive);
    setEditing(banner);
    setShowForm(true);
  }

  async function handleSave() {
    if (!title.trim() || !imageUrl.trim()) return;
    setSaving(true);

    const body = {
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      link: link.trim() || null,
      isActive,
      displayOrder: editing ? editing.displayOrder : banners.length,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/admin/banners/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const updated = await res.json();
          setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        }
      } else {
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const created = await res.json();
          setBanners((prev) => [...prev, created]);
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
    if (!confirm("Delete this banner?")) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (res.ok) setBanners((prev) => prev.filter((b) => b.id !== id));
  }

  async function toggleActive(banner: Banner) {
    const res = await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    });
    if (res.ok) {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b))
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
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      {/* Banner Grid */}
      {banners.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-3 text-sm text-muted">No banners yet. Add your first banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <div className="aspect-[3/1] bg-surface relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {!banner.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                      HIDDEN
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{banner.title}</p>
                  {banner.link && <p className="text-xs text-muted truncate">{banner.link}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(banner)}
                    className="rounded p-1.5 text-muted hover:bg-surface"
                  >
                    {banner.isActive ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(banner)}
                    className="rounded p-1.5 text-muted hover:bg-surface hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {editing ? "Edit Banner" : "Add Banner"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SSC CGL 2025 Recruitment"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Image URL *</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
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
          </div>
          <div className="mt-4 flex items-center gap-4">
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
              disabled={saving || !title.trim() || !imageUrl.trim()}
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
