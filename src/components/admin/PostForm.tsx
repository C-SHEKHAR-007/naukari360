"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface State {
  id: string;
  name: string;
  slug: string;
}

interface ImportantDate {
  id?: string;
  labelEn: string;
  date: string;
}

interface Faq {
  id?: string;
  questionEn: string;
  answerEn: string;
}

interface PostData {
  id: string;
  titleEn: string;
  titleHi: string | null;
  slug: string;
  contentEn: string | null;
  contentHi: string | null;
  excerptEn: string | null;
  excerptHi: string | null;
  categoryId: string | null;
  stateId: string | null;
  status: string;
  badge: string | null;
  totalPosts: string | null;
  organization: string | null;
  qualification: string | null;
  qualificationLevel: string | null;
  ageLimit: string | null;
  salary: string | null;
  feeGeneral: string | null;
  feeObc: string | null;
  feeScSt: string | null;
  feeWomen: string | null;
  lastDate: Date | string | null;
  examDate: Date | string | null;
  resultDate: Date | string | null;
  applyLink: string | null;
  officialLink: string | null;
  notificationLink: string | null;
  admitCardLink: string | null;
  answerKeyLink: string | null;
  syllabusLink: string | null;
  isTrending: boolean;
  isHot: boolean;
  isNew: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  metaKeywords: string | null;
  importantDates: ImportantDate[];
  faqs: Faq[];
  postTags: { tag: { name: string } }[];
}

interface PostFormProps {
  post: PostData | null;
  categories: Category[];
  states: State[];
}

function toDateInputValue(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export default function PostForm({ post, categories, states }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titleEn: post?.titleEn || "",
    titleHi: post?.titleHi || "",
    slug: post?.slug || "",
    contentEn: post?.contentEn || "",
    contentHi: post?.contentHi || "",
    excerptEn: post?.excerptEn || "",
    excerptHi: post?.excerptHi || "",
    categoryId: post?.categoryId || "",
    stateId: post?.stateId || "",
    status: post?.status || "draft",
    badge: post?.badge || "",
    totalPosts: post?.totalPosts || "",
    organization: post?.organization || "",
    qualification: post?.qualification || "",
    qualificationLevel: post?.qualificationLevel || "",
    ageLimit: post?.ageLimit || "",
    salary: post?.salary || "",
    feeGeneral: post?.feeGeneral || "",
    feeObc: post?.feeObc || "",
    feeScSt: post?.feeScSt || "",
    feeWomen: post?.feeWomen || "",
    lastDate: toDateInputValue(post?.lastDate ?? null),
    examDate: toDateInputValue(post?.examDate ?? null),
    resultDate: toDateInputValue(post?.resultDate ?? null),
    applyLink: post?.applyLink || "",
    officialLink: post?.officialLink || "",
    notificationLink: post?.notificationLink || "",
    admitCardLink: post?.admitCardLink || "",
    answerKeyLink: post?.answerKeyLink || "",
    syllabusLink: post?.syllabusLink || "",
    isTrending: post?.isTrending || false,
    isHot: post?.isHot || false,
    isNew: post?.isNew ?? true,
    metaTitle: post?.metaTitle || "",
    metaDesc: post?.metaDesc || "",
    metaKeywords: post?.metaKeywords || "",
    tags: post?.postTags?.map((pt) => pt.tag.name).join(", ") || "",
  });

  const [importantDates, setImportantDates] = useState<ImportantDate[]>(
    post?.importantDates?.map((d) => ({ id: d.id, labelEn: d.labelEn, date: d.date })) || []
  );

  const [faqs, setFaqs] = useState<Faq[]>(
    post?.faqs?.map((f) => ({ id: f.id, questionEn: f.questionEn, answerEn: f.answerEn })) || []
  );

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
  }

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "titleEn" && !post) {
      setForm((prev) => ({ ...prev, slug: generateSlug(value as string) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body = {
        ...form,
        importantDates: importantDates.map((d) => ({ label: d.labelEn, date: d.date })),
        faqs: faqs.map((f) => ({ question: f.questionEn, answer: f.answerEn })),
      };
      const url = post ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
      const method = post ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const data = await res.json();
      router.push("/admin/posts");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (English) *" full>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => updateField("titleEn", e.target.value)}
              required
            />
          </Field>
          <Field label="Title (Hindi)">
            <input
              type="text"
              value={form.titleHi}
              onChange={(e) => updateField("titleHi", e.target.value)}
            />
          </Field>
          <Field label="Slug *">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              required
            />
          </Field>
          <Field label="Organization">
            <input
              type="text"
              value={form.organization}
              onChange={(e) => updateField("organization", e.target.value)}
            />
          </Field>
          <Field label="Category">
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="State">
            <select value={form.stateId} onChange={(e) => updateField("stateId", e.target.value)}>
              <option value="">All India</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Badge">
            <select value={form.badge} onChange={(e) => updateField("badge", e.target.value)}>
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="HOT">HOT</option>
              <option value="TRENDING">TRENDING</option>
              <option value="IMPORTANT">IMPORTANT</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Content */}
      <Section title="Content">
        <Field label="Excerpt (English)">
          <textarea
            rows={2}
            value={form.excerptEn}
            onChange={(e) => updateField("excerptEn", e.target.value)}
          />
        </Field>
        <Field label="Excerpt (Hindi)">
          <textarea
            rows={2}
            value={form.excerptHi}
            onChange={(e) => updateField("excerptHi", e.target.value)}
          />
        </Field>
        <Field label="Content (English) — HTML">
          <textarea
            rows={8}
            value={form.contentEn}
            onChange={(e) => updateField("contentEn", e.target.value)}
            className="font-mono text-xs"
          />
        </Field>
        <Field label="Content (Hindi) — HTML">
          <textarea
            rows={8}
            value={form.contentHi}
            onChange={(e) => updateField("contentHi", e.target.value)}
            className="font-mono text-xs"
          />
        </Field>
      </Section>

      {/* Eligibility & Vacancy */}
      <Section title="Eligibility & Vacancy">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Total Posts">
            <input
              type="text"
              value={form.totalPosts}
              onChange={(e) => updateField("totalPosts", e.target.value)}
              placeholder="e.g. 500+ Posts"
            />
          </Field>
          <Field label="Qualification">
            <input
              type="text"
              value={form.qualification}
              onChange={(e) => updateField("qualification", e.target.value)}
              placeholder="e.g. Graduate"
            />
          </Field>
          <Field label="Qualification Level">
            <select
              value={form.qualificationLevel}
              onChange={(e) => updateField("qualificationLevel", e.target.value)}
            >
              <option value="">Select</option>
              <option value="tenth">10th</option>
              <option value="twelfth">12th</option>
              <option value="graduate">Graduate</option>
              <option value="post_graduate">Post Graduate</option>
              <option value="any">Any</option>
            </select>
          </Field>
          <Field label="Age Limit">
            <input
              type="text"
              value={form.ageLimit}
              onChange={(e) => updateField("ageLimit", e.target.value)}
              placeholder="e.g. 18-27 Years"
            />
          </Field>
          <Field label="Salary">
            <input
              type="text"
              value={form.salary}
              onChange={(e) => updateField("salary", e.target.value)}
              placeholder="e.g. ₹25,000 - ₹75,000"
            />
          </Field>
        </div>
      </Section>

      {/* Fees */}
      <Section title="Application Fee">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="General / OBC">
            <input
              type="text"
              value={form.feeGeneral}
              onChange={(e) => updateField("feeGeneral", e.target.value)}
              placeholder="₹1000"
            />
          </Field>
          <Field label="OBC">
            <input
              type="text"
              value={form.feeObc}
              onChange={(e) => updateField("feeObc", e.target.value)}
              placeholder="₹500"
            />
          </Field>
          <Field label="SC / ST">
            <input
              type="text"
              value={form.feeScSt}
              onChange={(e) => updateField("feeScSt", e.target.value)}
              placeholder="₹250"
            />
          </Field>
          <Field label="Women">
            <input
              type="text"
              value={form.feeWomen}
              onChange={(e) => updateField("feeWomen", e.target.value)}
              placeholder="₹250"
            />
          </Field>
        </div>
      </Section>

      {/* Dates */}
      <Section title="Important Dates">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Last Date">
            <input
              type="date"
              value={form.lastDate}
              onChange={(e) => updateField("lastDate", e.target.value)}
            />
          </Field>
          <Field label="Exam Date">
            <input
              type="date"
              value={form.examDate}
              onChange={(e) => updateField("examDate", e.target.value)}
            />
          </Field>
          <Field label="Result Date">
            <input
              type="date"
              value={form.resultDate}
              onChange={(e) => updateField("resultDate", e.target.value)}
            />
          </Field>
        </div>

        {/* Custom Important Dates */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Custom Dates</label>
            <button
              type="button"
              onClick={() => setImportantDates([...importantDates, { labelEn: "", date: "" }])}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3 w-3" /> Add Date
            </button>
          </div>
          {importantDates.map((d, i) => (
            <div key={i} className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Label"
                value={d.labelEn}
                onChange={(e) => {
                  const updated = [...importantDates];
                  updated[i].labelEn = e.target.value;
                  setImportantDates(updated);
                }}
                className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="date"
                value={d.date}
                onChange={(e) => {
                  const updated = [...importantDates];
                  updated[i].date = e.target.value;
                  setImportantDates(updated);
                }}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setImportantDates(importantDates.filter((_, idx) => idx !== i))}
                className="rounded-md p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Links */}
      <Section title="Important Links">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Apply Link">
            <input
              type="url"
              value={form.applyLink}
              onChange={(e) => updateField("applyLink", e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Official Website">
            <input
              type="url"
              value={form.officialLink}
              onChange={(e) => updateField("officialLink", e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Notification PDF">
            <input
              type="url"
              value={form.notificationLink}
              onChange={(e) => updateField("notificationLink", e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Admit Card">
            <input
              type="url"
              value={form.admitCardLink}
              onChange={(e) => updateField("admitCardLink", e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Answer Key">
            <input
              type="url"
              value={form.answerKeyLink}
              onChange={(e) => updateField("answerKeyLink", e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Syllabus">
            <input
              type="url"
              value={form.syllabusLink}
              onChange={(e) => updateField("syllabusLink", e.target.value)}
              placeholder="https://..."
            />
          </Field>
        </div>
      </Section>

      {/* FAQs */}
      <Section title="FAQs">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted">{faqs.length} FAQ(s)</p>
          <button
            type="button"
            onClick={() => setFaqs([...faqs, { questionEn: "", answerEn: "" }])}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add FAQ
          </button>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="mt-3 rounded-lg border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.questionEn}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[i].questionEn = e.target.value;
                    setFaqs(updated);
                  }}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
                <textarea
                  placeholder="Answer"
                  rows={2}
                  value={faq.answerEn}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[i].answerEn = e.target.value;
                    setFaqs(updated);
                  }}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </Section>

      {/* Flags & SEO */}
      <Section title="Flags & SEO">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => updateField("isNew", e.target.checked)}
              className="rounded"
            />
            New
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isHot}
              onChange={(e) => updateField("isHot", e.target.checked)}
              className="rounded"
            />
            Hot
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isTrending}
              onChange={(e) => updateField("isTrending", e.target.checked)}
              className="rounded"
            />
            Trending
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Meta Title">
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => updateField("metaTitle", e.target.value)}
            />
          </Field>
          <Field label="Tags (comma separated)">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="SSC, UPSC, Railway"
            />
          </Field>
          <Field label="Meta Description" full>
            <textarea
              rows={2}
              value={form.metaDesc}
              onChange={(e) => updateField("metaDesc", e.target.value)}
            />
          </Field>
          <Field label="Meta Keywords" full>
            <input
              type="text"
              value={form.metaKeywords}
              onChange={(e) => updateField("metaKeywords", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Posts
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : post ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div className="[&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-border [&>input]:bg-card [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-foreground [&>input]:placeholder:text-muted [&>input]:focus:border-primary [&>input]:focus:outline-none [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-border [&>select]:bg-card [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-foreground [&>select]:focus:border-primary [&>select]:focus:outline-none [&>textarea]:w-full [&>textarea]:rounded-lg [&>textarea]:border [&>textarea]:border-border [&>textarea]:bg-card [&>textarea]:px-3 [&>textarea]:py-2.5 [&>textarea]:text-sm [&>textarea]:text-foreground [&>textarea]:placeholder:text-muted [&>textarea]:focus:border-primary [&>textarea]:focus:outline-none">
        {children}
      </div>
    </div>
  );
}
