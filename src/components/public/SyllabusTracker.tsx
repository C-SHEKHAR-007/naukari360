"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import InteractiveSyllabus, { SyllabusSection } from "@/components/public/InteractiveSyllabus";

// Loads the signed-in user's saved progress client-side, so pages that show a
// syllabus tracker can stay cached. Returns null until progress is known.
export function useSyllabusProgress(postId: string, syllabusId: string, enabled = true) {
  const { status } = useSession();
  const [completedTopics, setCompletedTopics] = useState<string[] | null>(null);

  useEffect(() => {
    if (!enabled || completedTopics !== null || status === "loading") return;
    if (status !== "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompletedTopics([]);
      return;
    }
    fetch(`/api/post-user-state?postId=${postId}&syllabusId=${syllabusId}`)
      .then((res) => (res.ok ? res.json() : { completedTopics: [] }))
      .then((data) => setCompletedTopics(data.completedTopics ?? []))
      .catch(() => setCompletedTopics([]));
  }, [enabled, completedTopics, status, postId, syllabusId]);

  return completedTopics;
}

interface Props {
  postId: string;
  syllabusId: string;
  syllabus: SyllabusSection[];
}

export default function SyllabusTracker({ postId, syllabusId, syllabus }: Props) {
  const completedTopics = useSyllabusProgress(postId, syllabusId);

  if (completedTopics === null) {
    return <div className="skeleton h-64 rounded-xl" aria-label="Loading your progress" />;
  }
  return (
    <InteractiveSyllabus
      postId={postId}
      syllabusId={syllabusId}
      syllabus={syllabus}
      initialCompletedTopics={completedTopics}
    />
  );
}
