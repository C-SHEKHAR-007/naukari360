"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";

interface State {
  id: string;
  name: string;
  nameHi: string | null;
  slug: string;
  isActive: boolean;
  _count: { posts: number };
}

export default function StatesManager({ states: initialStates }: { states: State[] }) {
  const [states, setStates] = useState(initialStates);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", nameHi: "", slug: "" });
  const [saving, setSaving] = useState(false);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  async function handleAdd() {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const state = await res.json();
        setStates([...states, { ...state, _count: { posts: 0 } }]);
        setForm({ name: "", nameHi: "", slug: "" });
        setAdding(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/states/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setStates(states.map((s) => (s.id === id ? { ...s, ...updated } : s)));
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this state?")) return;
    const res = await fetch(`/api/admin/states/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStates(states.filter((s) => s.id !== id));
    }
  }

  function startEdit(state: State) {
    setEditing(state.id);
    setForm({ name: state.name, nameHi: state.nameHi || "", slug: state.slug });
    setAdding(false);
  }

  return (
    <div className="rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted sm:table-cell">
              Hindi
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
              Slug
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted">Posts</th>
            <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {states.map((state) => (
            <tr key={state.id} className="hover:bg-surface/50">
              {editing === state.id ? (
                <>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </td>
                  <td className="hidden px-4 py-2 sm:table-cell">
                    <input
                      type="text"
                      value={form.nameHi}
                      onChange={(e) => setForm({ ...form, nameHi: e.target.value })}
                      className="w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </td>
                  <td className="hidden px-4 py-2 md:table-cell">
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 text-muted">{state._count.posts}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleUpdate(state.id)}
                      disabled={saving}
                      className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="rounded p-1 text-muted hover:bg-surface"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 font-medium text-foreground">{state.name}</td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {state.nameHi || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">{state.slug}</td>
                  <td className="px-4 py-3 text-muted">{state._count.posts}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(state)}
                      className="rounded p-1 text-muted hover:bg-surface hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(state.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}

          {adding && (
            <tr className="bg-primary/5">
              <td className="px-4 py-2">
                <input
                  type="text"
                  placeholder="State name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                />
              </td>
              <td className="hidden px-4 py-2 sm:table-cell">
                <input
                  type="text"
                  placeholder="Hindi name"
                  value={form.nameHi}
                  onChange={(e) => setForm({ ...form, nameHi: e.target.value })}
                  className="w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                />
              </td>
              <td className="hidden px-4 py-2 md:table-cell">
                <input
                  type="text"
                  placeholder="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">—</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setAdding(false);
                    setForm({ name: "", nameHi: "", slug: "" });
                  }}
                  className="rounded p-1 text-muted hover:bg-surface"
                >
                  <X className="h-4 w-4" />
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!adding && (
        <div className="border-t border-border p-3">
          <button
            onClick={() => {
              setAdding(true);
              setEditing(null);
              setForm({ name: "", nameHi: "", slug: "" });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" /> Add State
          </button>
        </div>
      )}
    </div>
  );
}
