"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Check, X, ToggleLeft, ToggleRight } from "lucide-react";

interface InterstitialConfig {
  id: string;
  title: string;
  adSlotKey: string;
  delaySeconds: number;
  isActive: boolean;
}

export default function InterstitialManager({
  configs: initialConfigs,
}: {
  configs: InterstitialConfig[];
}) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    adSlotKey: "",
    delaySeconds: 5,
    isActive: true,
  });

  function resetForm() {
    setForm({ title: "", adSlotKey: "", delaySeconds: 5, isActive: true });
  }

  function startEdit(config: InterstitialConfig) {
    setEditing(config.id);
    setForm({
      title: config.title,
      adSlotKey: config.adSlotKey,
      delaySeconds: config.delaySeconds,
      isActive: config.isActive,
    });
  }

  async function handleAdd() {
    if (!form.title || !form.adSlotKey) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/interstitial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const config = await res.json();
        setConfigs([...configs, config]);
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
      const res = await fetch(`/api/admin/interstitial/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setConfigs(configs.map((c) => (c.id === id ? { ...c, ...updated } : c)));
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this interstitial config?")) return;
    const res = await fetch(`/api/admin/interstitial/${id}`, { method: "DELETE" });
    if (res.ok) {
      setConfigs(configs.filter((c) => c.id !== id));
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/admin/interstitial/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      setConfigs(configs.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Interstitial Pages</h2>
        <button
          onClick={() => {
            setAdding(true);
            resetForm();
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Config
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Title (e.g., Download Page)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Ad Slot Key (e.g., interstitial_main)"
              value={form.adSlotKey}
              onChange={(e) => setForm({ ...form, adSlotKey: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Delay (seconds)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={form.delaySeconds}
                onChange={(e) => setForm({ ...form, delaySeconds: parseInt(e.target.value) || 5 })}
                className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
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

      {/* Configs list */}
      <div className="space-y-3">
        {configs.map((config) => (
          <div key={config.id} className="rounded-lg border border-border bg-card p-4">
            {editing === config.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={form.adSlotKey}
                    onChange={(e) => setForm({ ...form, adSlotKey: e.target.value })}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">
                      Delay (seconds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={form.delaySeconds}
                      onChange={(e) =>
                        setForm({ ...form, delaySeconds: parseInt(e.target.value) || 5 })
                      }
                      className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(config.id)}
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
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{config.title}</h4>
                  <p className="text-sm text-muted">
                    Slot: <code className="rounded bg-surface px-1">{config.adSlotKey}</code> •
                    Delay: {config.delaySeconds}s
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(config.id, config.isActive)}>
                    {config.isActive ? (
                      <ToggleRight className="h-5 w-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(config)}
                    className="rounded p-1 hover:bg-surface"
                  >
                    <Edit className="h-4 w-4 text-muted" />
                  </button>
                  <button
                    onClick={() => handleDelete(config.id)}
                    className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {configs.length === 0 && (
          <p className="py-8 text-center text-muted">
            No interstitial configs yet. Click &ldquo;Add Config&rdquo; to create one.
          </p>
        )}
      </div>
    </div>
  );
}
