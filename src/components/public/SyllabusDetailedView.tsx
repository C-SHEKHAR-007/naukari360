"use client";

import { CheckCircle2, ChevronRight, Target, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface SyllabusSection {
  title: string;
  topics?: string[];
  modules?: string[];
}

export default function SyllabusDetailedView({ 
  syllabus, 
  markdownContent 
}: { 
  syllabus?: SyllabusSection[];
  markdownContent?: string | null;
}) {
  if (!markdownContent && (!syllabus || syllabus.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-xl border border-border">
        <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No Syllabus Details Available</h3>
        <p className="text-muted-foreground mt-2">Check back later for detailed subjects and topics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {markdownContent && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
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
        </div>
      )}

      {syllabus && syllabus.length > 0 && !markdownContent && (
        <div className="space-y-6">
          {syllabus.map((section, index) => {
            const items = section.topics || section.modules || [];
            return (
              <div key={index} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-primary/5 px-5 py-4 dark:bg-primary/10 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                </div>
                
                <div className="p-5">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border transition-colors">
                        <ChevronRight className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <span className="text-sm font-medium text-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
