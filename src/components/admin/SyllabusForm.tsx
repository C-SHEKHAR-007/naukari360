"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { createSyllabus, updateSyllabus } from "@/app/(admin)/admin/(dashboard)/syllabuses/actions";
import { Plus, Trash2, GripVertical, AlertCircle, Eye, Edit3, ChevronDown, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SyllabusSection {
  title: string;
  topics: string[];
}

interface SyllabusFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  posts: { id: string; titleEn: string }[];
}

export default function SyllabusForm({ initialData, posts }: SyllabusFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [titleEn, setTitleEn] = useState(initialData?.titleEn || "");
  const [titleHi, setTitleHi] = useState(initialData?.titleHi || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [postId, setPostId] = useState(initialData?.postId || "");
  const [markdownContent, setMarkdownContent] = useState(initialData?.markdownContent || "");
  const [sections, setSections] = useState<SyllabusSection[]>(
    Array.isArray(initialData?.content) ? initialData.content : []
  );

  const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleEn(e.target.value);
    if (!initialData) {
      setSlug(slugify(e.target.value));
    }
  };

  const addSection = () => {
    setSections([...sections, { title: "", topics: [] }]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    const newSections = [...sections];
    newSections[index].title = title;
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const addTopic = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].topics.push("");
    setSections(newSections);
  };

  const updateTopic = (sectionIndex: number, topicIndex: number, value: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].topics[topicIndex] = value;
    setSections(newSections);
  };

  const removeTopic = (sectionIndex: number, topicIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].topics.splice(topicIndex, 1);
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      titleEn,
      titleHi,
      slug,
      postId: postId || null,
      markdownContent,
      content: sections as unknown,
    };

    let result;
    if (initialData) {
      result = await updateSyllabus(initialData.id, formData);
    } else {
      result = await createSyllabus(formData);
    }

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/syllabuses");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-10">
      {error && (
        <div className="rounded-xl bg-destructive/10 p-4 flex items-center gap-3 text-destructive border border-destructive/20 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Basic Details Section */}
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Basic Details</h2>
          <p className="text-sm text-muted-foreground mt-1">Provide the primary information for this syllabus.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 p-6 bg-card rounded-2xl border border-border shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title (English) <span className="text-destructive">*</span></label>
            <input
              required
              type="text"
              value={titleEn}
              onChange={handleTitleEnChange}
              className="w-full rounded-xl border border-border/60 bg-muted/10 px-4 py-2.5 text-sm text-foreground transition-all hover:bg-muted/20 focus:bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="e.g. SSC CGL Tier 1 Complete Syllabus"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title (Hindi)</label>
            <input
              type="text"
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-muted/10 px-4 py-2.5 text-sm text-foreground transition-all hover:bg-muted/20 focus:bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="e.g. एसएससी सीजीएल टीयर 1 सिलेबस"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">URL Slug <span className="text-destructive">*</span></label>
            <div className="flex rounded-xl shadow-sm">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-border/60 bg-muted/30 px-3 text-sm text-muted-foreground font-medium">
                /syllabus/
              </span>
              <input
                required
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-xl border border-border/60 bg-muted/10 px-4 py-2.5 text-sm text-foreground transition-all focus:bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Linked Job Post</label>
            <div className="relative">
              <select
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border/60 bg-muted/10 px-4 py-2.5 pr-10 text-sm text-foreground transition-all hover:bg-muted/20 focus:bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="">-- Standalone Syllabus --</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.titleEn}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">If linked, a button to this syllabus will appear on the job page.</p>
          </div>
        </div>
      </div>

      {/* Markdown Content Section */}
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Syllabus Markdown Document</h2>
          <p className="text-sm text-muted-foreground mt-1">This rich-text content is displayed on the left pane of the syllabus page.</p>
        </div>
        
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between bg-muted/10 px-4 py-3 border-b border-border/60">
            <div className="flex bg-muted/30 p-1 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  !isPreviewMode
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Edit3 className="h-4 w-4" /> Edit Mode
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewMode(true)}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  isPreviewMode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Eye className="h-4 w-4" /> Live Preview
              </button>
            </div>
            {!isPreviewMode && <span className="text-xs text-muted-foreground hidden sm:inline-block">Supports GitHub Flavored Markdown</span>}
          </div>

          {!isPreviewMode ? (
            <textarea
              rows={14}
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              className="w-full bg-background p-6 text-foreground font-mono text-sm leading-relaxed focus:outline-none resize-y min-h-[400px]"
              placeholder="## English Comprehension\n\n- Vocabulary\n- Grammar"
            />
          ) : (
            <div className="p-8 bg-background min-h-[400px] overflow-y-auto max-h-[600px]">
              {markdownContent ? (
                <div className="text-foreground max-w-none 
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2:first-child]:mt-0
                  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:my-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:text-muted-foreground
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-4 [&_ol]:space-y-2 [&_ol]:text-muted-foreground
                  [&_li]:marker:text-primary
                  [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
                  [&_strong]:font-bold [&_strong]:text-foreground"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center flex-col text-muted-foreground gap-3 opacity-50 py-20">
                  <BookOpen className="h-10 w-10" />
                  <p className="italic">No content to preview.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tracker Builder Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Interactive Progress Tracker</h2>
            <p className="text-sm text-muted-foreground mt-1">Build the step-by-step checklist pinned to the right side of the syllabus.</p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/60 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="rounded-2xl border border-border bg-card p-6 shadow-sm relative group transition-all hover:border-primary/40">
              <button
                type="button"
                onClick={() => removeSection(sIdx)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Subject"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              
              <div className="space-y-2 mb-6 pr-12">
                <label className="text-xs font-semibold tracking-wider uppercase text-primary">Subject {sIdx + 1}</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                  className="w-full text-lg font-semibold bg-transparent border-b border-border/50 px-0 py-2 text-foreground focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                  placeholder="e.g. Quantitative Aptitude"
                />
              </div>

              <div className="space-y-3 bg-muted/10 rounded-xl p-5 border border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">{section.topics.length}</span> Topics
                  </label>
                  <button
                    type="button"
                    onClick={() => addTopic(sIdx)}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
                  >
                    <Plus className="h-3 w-3" /> Add Topic
                  </button>
                </div>
                
                <div className="space-y-2">
                  {section.topics.map((topic, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-3 bg-background rounded-lg p-2 border border-border/50 shadow-sm transition-all focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab hover:text-foreground shrink-0" />
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => updateTopic(sIdx, tIdx, e.target.value)}
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                        placeholder="e.g. Ratio and Proportion"
                      />
                      <button
                        type="button"
                        onClick={() => removeTopic(sIdx, tIdx)}
                        className="p-1.5 text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {section.topics.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-border/60 rounded-xl bg-background/50">
                      <p className="text-sm text-muted-foreground italic">No topics added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {sections.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-muted/5 transition-all hover:bg-muted/10">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No Tracker Sections</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">Create subjects and nested topics to build a beautiful interactive checklist for your students.</p>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted/60 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Your First Subject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end border-t border-border pt-6 mt-8">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Syllabus" : "Publish Syllabus"}
        </button>
      </div>
    </form>
  );
}
