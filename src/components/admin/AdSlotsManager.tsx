"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import { useIsSuperAdmin } from "@/components/admin/AdminRoleProvider";

interface AdSlot {
  id: string;
  name: string;
  slotKey: string;
  adCode: string | null;
  isActive: boolean;
  device: string;
  notes: string | null;
}

export default function AdSlotsManager({ adSlots: initialSlots }: { adSlots: AdSlot[] }) {
  const isSuperAdmin = useIsSuperAdmin();
  const [slots, setSlots] = useState(initialSlots);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slotKey: "", adCode: "", device: "all", notes: "" });
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/admin/ad-slots/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      setSlots(slots.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s)));
    }
  }

  async function handleAdd() {
    if (!form.name || !form.slotKey) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ad-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const slot = await res.json();
        setSlots([...slots, slot]);
        setForm({ name: "", slotKey: "", adCode: "", device: "all", notes: "" });
        setAdding(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/ad-slots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setSlots(slots.map((s) => (s.id === id ? { ...s, ...updated } : s)));
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ad slot?")) return;
    const res = await fetch(`/api/admin/ad-slots/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSlots(slots.filter((s) => s.id !== id));
    }
  }

  function startEdit(slot: AdSlot) {
    setEditing(slot.id);
    setForm({
      name: slot.name,
      slotKey: slot.slotKey,
      adCode: slot.adCode || "",
      device: slot.device,
      notes: slot.notes || "",
    });
    setAdding(false);
  }

  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <div key={slot.id} className="rounded-xl border border-border p-4">
          {editing === slot.id ? (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Slot name"
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  value={form.slotKey}
                  onChange={(e) => setForm({ ...form, slotKey: e.target.value })}
                  placeholder="slot_key"
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <select
                  value={form.device}
                  onChange={(e) => setForm({ ...form, device: e.target.value })}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="all">All Devices</option>
                  <option value="mobile">Mobile Only</option>
                  <option value="desktop">Desktop Only</option>
                </select>
              </div>
              <textarea
                rows={4}
                value={form.adCode}
                onChange={(e) => setForm({ ...form, adCode: e.target.value })}
                placeholder="Paste ad code HTML/JS here..."
                className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs focus:border-primary focus:outline-none"
              />
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Performance notes (e.g., 'Best RPM on mobile header')..."
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(slot.id)}
                  disabled={saving}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
                >
                  <Check className="mr-1 inline h-3 w-3" />
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
                >
                  <X className="mr-1 inline h-3 w-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{slot.name}</h3>
                  <span className="rounded bg-surface px-2 py-0.5 font-mono text-xs text-muted">
                    {slot.slotKey}
                  </span>
                  <span className="rounded bg-surface px-2 py-0.5 text-xs text-muted">
                    {slot.device}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {slot.adCode ? `${slot.adCode.length} chars of ad code` : "No ad code set"}
                </p>
                {slot.notes && (
                  <p className="mt-0.5 text-xs italic text-amber-600 dark:text-amber-400">
                    📝 {slot.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(slot.id, slot.isActive)}
                  className={slot.isActive ? "text-emerald-500" : "text-muted"}
                >
                  {slot.isActive ? (
                    <ToggleRight className="h-6 w-6" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(slot)}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {adding && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Slot name"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              value={form.slotKey}
              onChange={(e) => setForm({ ...form, slotKey: e.target.value })}
              placeholder="slot_key (unique)"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <select
              value={form.device}
              onChange={(e) => setForm({ ...form, device: e.target.value })}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Devices</option>
              <option value="mobile">Mobile Only</option>
              <option value="desktop">Desktop Only</option>
            </select>
          </div>
          <textarea
            rows={4}
            value={form.adCode}
            onChange={(e) => setForm({ ...form, adCode: e.target.value })}
            placeholder="Paste ad code HTML/JS here..."
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs focus:border-primary focus:outline-none"
          />
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Performance notes (e.g., 'Best RPM on mobile header')..."
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs focus:border-primary focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
            >
              <Check className="mr-1 inline h-3 w-3" />
              Create
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setForm({ name: "", slotKey: "", adCode: "", device: "all", notes: "" });
              }}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
            >
              <X className="mr-1 inline h-3 w-3" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {!adding && (
        <button
          onClick={() => {
            setAdding(true);
            setEditing(null);
            setForm({ name: "", slotKey: "", adCode: "", device: "all", notes: "" });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" /> Add Ad Slot
        </button>
      )}
    </div>
  );
}
