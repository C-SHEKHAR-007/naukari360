"use client";

import { useState } from "react";
import { Plus, GripVertical, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useIsSuperAdmin } from "@/components/admin/AdminRoleProvider";

interface NavMenuItem {
  id: string;
  label: string;
  labelHi: string | null;
  url: string;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  children?: NavMenuItem[];
}

export default function MenuManager({ initialMenus }: { initialMenus: NavMenuItem[] }) {
  const isSuperAdmin = useIsSuperAdmin();
  const [menus, setMenus] = useState<NavMenuItem[]>(initialMenus);
  const [editing, setEditing] = useState<NavMenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Form state
  const [label, setLabel] = useState("");
  const [labelHi, setLabelHi] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setLabel("");
    setLabelHi("");
    setUrl("");
    setParentId("");
    setIsActive(true);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(item: NavMenuItem) {
    setLabel(item.label);
    setLabelHi(item.labelHi || "");
    setUrl(item.url);
    setParentId(item.parentId || "");
    setIsActive(item.isActive);
    setEditing(item);
    setShowForm(true);
  }

  async function handleSave() {
    if (!label.trim() || !url.trim()) return;
    setSaving(true);

    const body = {
      label: label.trim(),
      labelHi: labelHi.trim() || null,
      url: url.trim(),
      parentId: parentId || null,
      isActive,
      displayOrder: editing ? editing.displayOrder : menus.length,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/admin/menus/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const updated = await res.json();
          setMenus((prev) =>
            prev.map((m) => {
              if (m.id === updated.id) return { ...m, ...updated };
              return {
                ...m,
                children: m.children?.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
              };
            })
          );
        }
      } else {
        const res = await fetch("/api/admin/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const created = await res.json();
          if (created.parentId) {
            setMenus((prev) =>
              prev.map((m) =>
                m.id === created.parentId ? { ...m, children: [...(m.children || []), created] } : m
              )
            );
          } else {
            setMenus((prev) => [...prev, { ...created, children: [] }]);
          }
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
    if (!confirm("Delete this menu item and its children?")) return;

    const res = await fetch(`/api/admin/menus/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMenus((prev) =>
        prev
          .filter((m) => m.id !== id)
          .map((m) => ({
            ...m,
            children: m.children?.filter((c) => c.id !== id),
          }))
      );
    }
  }

  function toggleExpand(id: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Menu items list */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Menu Items</span>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> Add Item
          </button>
        </div>

        {menus.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted">
            No menu items yet. Add your first navigation link.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {menus.map((item) => (
              <li key={item.id}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface/50">
                  <GripVertical className="h-4 w-4 text-muted cursor-grab" />
                  {item.children && item.children.length > 0 && (
                    <button onClick={() => toggleExpand(item.id)} className="text-muted">
                      {expandedItems.has(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      {item.labelHi && <span className="text-xs text-muted">({item.labelHi})</span>}
                      {!item.isActive && (
                        <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Hidden
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted">{item.url}</span>
                  </div>
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded p-1.5 text-muted hover:bg-surface hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Children */}
                {expandedItems.has(item.id) && item.children && item.children.length > 0 && (
                  <ul className="border-t border-border/50 bg-surface/30">
                    {item.children.map((child) => (
                      <li
                        key={child.id}
                        className="flex items-center gap-3 pl-12 pr-4 py-2.5 hover:bg-surface/50"
                      >
                        <GripVertical className="h-3.5 w-3.5 text-muted cursor-grab" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground">{child.label}</span>
                          <span className="ml-2 text-xs text-muted">{child.url}</span>
                        </div>
                        <button
                          onClick={() => startEdit(child)}
                          className="rounded p-1 text-muted hover:text-primary"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="rounded p-1 text-muted hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {editing ? "Edit Menu Item" : "Add Menu Item"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Label (English) *</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Latest Jobs"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Label (Hindi)</label>
              <input
                type="text"
                value={labelHi}
                onChange={(e) => setLabelHi(e.target.value)}
                placeholder="e.g. नवीनतम नौकरी"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">URL *</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. /latest-jobs"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Parent Item</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">None (Top Level)</option>
                {menus
                  .filter((m) => m.id !== editing?.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
              </select>
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
              disabled={saving || !label.trim() || !url.trim()}
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
