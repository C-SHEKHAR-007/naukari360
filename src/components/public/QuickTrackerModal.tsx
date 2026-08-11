"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import InteractiveSyllabus from "@/components/public/InteractiveSyllabus";

interface QuickTrackerModalProps {
  postId: string;
  syllabusId: string;
  syllabus: unknown;
  initialCompletedTopics: string[];
}

export default function QuickTrackerModal({ postId, syllabusId, syllabus, initialCompletedTopics }: QuickTrackerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Syllabus Tracker</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <InteractiveSyllabus 
            postId={postId}
            syllabusId={syllabusId} 
            syllabus={syllabus} 
            initialCompletedTopics={initialCompletedTopics} 
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex justify-center items-center rounded-lg border-2 border-primary/20 bg-background px-4 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:bg-primary/5 hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
      >
        Quick Tracker
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
