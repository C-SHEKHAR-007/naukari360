"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useIsSuperAdmin } from "@/components/admin/AdminRoleProvider";

interface PageItem {
  id: string;
  titleEn: string;
  titleHi: string | null;
  slug: string;
  contentEn: string | null;
  contentHi: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
}

export default function PagesManager({ initialPages }: { initialPages: PageItem[] }) {
  const isSuperAdmin = useIsSuperAdmin();
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [editing, setEditing] = useState<PageItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [slug, setSlug] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentHi, setContentHi] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitleEn("");
    setTitleHi("");
    setSlug("");
    setContentEn("");
    setContentHi("");
    setMetaTitle("");
    setMetaDesc("");
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(page: PageItem) {
    setTitleEn(page.titleEn);
    setTitleHi(page.titleHi || "");
    setSlug(page.slug);
    setContentEn(page.contentEn || "");
    setContentHi(page.contentHi || "");
    setMetaTitle(page.metaTitle || "");
    setMetaDesc(page.metaDesc || "");
    setEditing(page);
    setShowForm(true);
  }

  async function handleSave() {
    if (!titleEn.trim() || !slug.trim()) return;
    setSaving(true);

    const body = {
      titleEn: titleEn.trim(),
      titleHi: titleHi.trim() || null,
      slug: slug.trim(),
      contentEn: contentEn.trim() || null,
      contentHi: contentHi.trim() || null,
      metaTitle: metaTitle.trim() || null,
      metaDesc: metaDesc.trim() || null,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/admin/pages/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const updated = await res.json();
          setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }
      } else {
        const res = await fetch("/api/admin/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const created = await res.json();
          setPages((prev) => [...prev, created]);
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
    if (!confirm("Delete this page?")) return;
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
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
          <Plus className="h-4 w-4" /> Add Page
        </button>
      </div>

      {/* Pages List */}
      {pages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-3 text-sm text-muted">No static pages yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase text-muted">Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-muted">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-muted text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{page.titleEn}</p>
                    {page.titleHi && <p className="text-xs text-muted">{page.titleHi}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-muted bg-surface px-1.5 py-0.5 rounded">
                      /{page.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(page)}
                      className="rounded p-1.5 text-muted hover:bg-surface hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 ml-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {editing ? "Edit Page" : "Add Page"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Title (English) *</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. About Us"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Title (Hindi)</label>
              <input
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                placeholder="e.g. हमारे बारे में"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. about"
                disabled={!!editing}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Meta Description</label>
              <input
                type="text"
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="SEO description"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">
                Content (English) — HTML
              </label>
              <textarea
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                rows={8}
                placeholder="<h2>About Naukari360</h2><p>...</p>"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">
                Content (Hindi) — HTML
              </label>
              <textarea
                value={contentHi}
                onChange={(e) => setContentHi(e.target.value)}
                rows={8}
                placeholder="<h2>सरकारीपल्स के बारे में</h2><p>...</p>"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !titleEn.trim() || !slug.trim()}
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
