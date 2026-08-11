"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, AlertCircle } from "lucide-react";
import { toggleSyllabusTopic } from "@/app/(public)/post/[slug]/syllabus-actions";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export interface SyllabusSection {
  title: string;
  topics: string[];
}

interface Props {
  postId: string;
  syllabus: SyllabusSection[];
  initialCompletedTopics: string[];
}

export default function InteractiveSyllabus({ postId, syllabus, initialCompletedTopics }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompletedTopics));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([syllabus[0]?.title]));
  const { data: session, status } = useSession();

  // Load from localStorage on mount if not authenticated
  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      try {
        const localData = localStorage.getItem(`syllabus_${postId}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCompleted(new Set(parsed));
          }
        }
      } catch (e) {
        console.error("Failed to parse local syllabus data", e);
      }
    }
  }, [postId, session?.user, status]);

  // Save to localStorage whenever completed changes (if not authenticated)
  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      localStorage.setItem(`syllabus_${postId}`, JSON.stringify(Array.from(completed)));
    }
  }, [completed, postId, session?.user, status]);

  if (!syllabus || syllabus.length === 0) return null;

  const totalTopics = syllabus.reduce((acc, sec) => acc + sec.topics.length, 0);
  const completedCount = completed.size;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  function toggleSection(title: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  async function handleToggleTopic(topic: string) {
    // Optimistic UI update
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });

    if (!session?.user) {
      return; // The useEffect will handle saving to localStorage
    }

    try {
      await toggleSyllabusTopic(postId, topic);
    } catch (error) {
      console.error("Failed to toggle syllabus topic", error);
      // Revert optimistic update
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(topic)) next.delete(topic);
        else next.add(topic);
        return next;
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-primary/5 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Interactive Syllabus Tracker</h2>
          </div>
          <span className="text-sm font-semibold text-primary">{progressPercent}% Completed</span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/50">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {!session?.user && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Login to save your study progress across devices.</span>
          </div>
        )}
      </div>

      <div className="divide-y divide-border">
        {syllabus.map((section) => {
          const isExpanded = expandedSections.has(section.title);
          const sectionCompletedCount = section.topics.filter(t => completed.has(t)).length;
          const sectionTotal = section.topics.length;
          const isSectionFullyCompleted = sectionCompletedCount === sectionTotal && sectionTotal > 0;

          return (
            <div key={section.title} className="group">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isSectionFullyCompleted ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                    {isSectionFullyCompleted ? <CheckCircle2 className="h-4 w-4" /> : sectionTotal}
                  </div>
                  <span className={`font-semibold ${isSectionFullyCompleted ? 'text-foreground' : 'text-foreground'}`}>
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted">
                  <span className="text-xs font-medium">
                    {sectionCompletedCount} / {sectionTotal}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="bg-muted/10 px-5 pb-4 pt-1">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {section.topics.map((topic) => {
                      const isChecked = completed.has(topic);
                      return (
                        <li key={topic}>
                          <button
                            onClick={() => handleToggleTopic(topic)}
                            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                              isChecked 
                                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10' 
                                : 'border-border/60 bg-card hover:border-primary/40 hover:shadow-sm'
                            }`}
                          >
                            <div className={`mt-0.5 shrink-0 transition-colors ${isChecked ? 'text-emerald-500' : 'text-muted/40 group-hover:text-primary/60'}`}>
                              {isChecked ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                            </div>
                            <span className={`text-sm leading-relaxed ${isChecked ? 'text-emerald-700 line-through opacity-80 dark:text-emerald-300' : 'text-foreground'}`}>
                              {topic}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
