"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const settingGroups = [
  {
    title: "General",
    fields: [
      { key: "site_name", label: "Site Name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "contact_email", label: "Contact Email", type: "text" },
      { key: "contact_phone", label: "Phone", type: "text" },
      { key: "address", label: "Address", type: "text" },
    ],
  },
  {
    title: "Social Links",
    fields: [
      { key: "telegram_url", label: "Telegram URL", type: "text" },
      { key: "whatsapp_url", label: "WhatsApp URL", type: "text" },
      { key: "facebook_url", label: "Facebook URL", type: "text" },
      { key: "twitter_url", label: "Twitter / X URL", type: "text" },
      { key: "youtube_url", label: "YouTube URL", type: "text" },
      { key: "instagram_url", label: "Instagram URL", type: "text" },
    ],
  },
  {
    title: "SEO & Analytics",
    fields: [
      { key: "google_analytics_id", label: "Google Analytics ID", type: "text" },
      { key: "adsense_publisher_id", label: "AdSense Publisher ID", type: "text" },
      { key: "meta_title", label: "Default Meta Title", type: "text" },
      { key: "meta_description", label: "Default Meta Description", type: "text" },
    ],
  },
  {
    title: "Content",
    fields: [
      { key: "footer_text", label: "Footer Text", type: "textarea" },
      { key: "announcement_text", label: "Announcement Text", type: "text" },
      { key: "announcement_active", label: "Announcement Active (true/false)", type: "text" },
    ],
  },
];

export default function SiteSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {settingGroups.map((group) => (
        <div key={group.title} className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">{group.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && <span className="text-sm text-emerald-600">Settings saved!</span>}
      </div>
    </form>
  );
}
