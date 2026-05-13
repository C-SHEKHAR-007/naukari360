"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Check, X, ExternalLink, ToggleLeft, ToggleRight } from "lucide-react";
import { useIsSuperAdmin } from "@/components/admin/AdminRoleProvider";

interface Category {
  id: string;
  name: string;
}

interface AffiliateLink {
  id: string;
  name: string;
  originalUrl: string;
  slug: string;
  clicks: number;
  isActive: boolean;
  displayInPosts: boolean;
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
}

interface Props {
  links: AffiliateLink[];
  categories: Category[];
}

export default function AffiliateLinksManager({ links: initialLinks, categories }: Props) {
  const isSuperAdmin = useIsSuperAdmin();
  const [links, setLinks] = useState(initialLinks);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    originalUrl: "",
    slug: "",
    isActive: true,
    displayInPosts: false,
    categoryId: "",
  });

  function resetForm() {
    setForm({
      name: "",
      originalUrl: "",
      slug: "",
      isActive: true,
      displayInPosts: false,
      categoryId: "",
    });
  }

  function startEdit(link: AffiliateLink) {
    setEditing(link.id);
    setForm({
      name: link.name,
      originalUrl: link.originalUrl,
      slug: link.slug,
      isActive: link.isActive,
      displayInPosts: link.displayInPosts,
      categoryId: link.categoryId || "",
    });
  }

  async function handleAdd() {
    if (!form.name || !form.originalUrl || !form.slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/affiliate-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const link = await res.json();
        setLinks([link, ...links]);
        resetForm();
        setAdding(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/affiliate-links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setLinks(links.map((l) => (l.id === id ? { ...l, ...updated } : l)));
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this affiliate link?")) return;
    const res = await fetch(`/api/admin/affiliate-links/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLinks(links.filter((l) => l.id !== id));
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/admin/affiliate-links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      setLinks(links.map((l) => (l.id === id ? { ...l, isActive: !isActive } : l)));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Affiliate Links</h2>
        <button
          onClick={() => {
            setAdding(true);
            resetForm();
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Link
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Link name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Slug (e.g., best-book)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <input
            type="url"
            placeholder="Original URL (affiliate link)"
            value={form.originalUrl}
            onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.displayInPosts}
                onChange={(e) => setForm({ ...form, displayInPosts: e.target.checked })}
              />
              Display in posts
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => setAdding(false)}
              className="flex items-center gap-1 rounded-lg bg-surface px-3 py-1.5 text-sm text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-center">Clicks</th>
              <th className="px-4 py-3 font-medium text-center">Active</th>
              <th className="px-4 py-3 font-medium text-center">In Posts</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {links.map((link) => (
              <tr key={link.id}>
                {editing === link.id ? (
                  <td colSpan={7} className="p-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <input
                        type="url"
                        value={form.originalUrl}
                        onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                      <div className="flex flex-wrap items-center gap-4">
                        <select
                          value={form.categoryId}
                          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        >
                          <option value="">No category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={form.displayInPosts}
                            onChange={(e) => setForm({ ...form, displayInPosts: e.target.checked })}
                          />
                          Display in posts
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(link.id)}
                          disabled={saving}
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" /> Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="flex items-center gap-1 rounded-lg bg-surface px-3 py-1.5 text-sm text-muted hover:text-foreground"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-foreground">{link.name}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-muted">
                        /go/{link.slug}
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{link.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-center font-mono">{link.clicks}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(link.id, link.isActive)}>
                        {link.isActive ? (
                          <ToggleRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-muted" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">{link.displayInPosts ? "✓" : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(link)}
                          className="rounded p-1 hover:bg-surface"
                        >
                          <Edit className="h-4 w-4 text-muted" />
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No affiliate links yet. Click &ldquo;Add Link&rdquo; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
