"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { MessageSquare, Send, User, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

export default function CommentsSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch comments", err);
        setLoading(false);
      });
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setContent("");
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card shadow-[var(--shadow-card)]">
      <div className="border-b border-border/60 bg-primary/8 px-5 py-4 dark:bg-primary/15">
        <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
          <MessageSquare className="h-5 w-5" />
          Discussion Forum ({comments.length})
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Ask questions, share doubts, or discuss this post.</p>
      </div>

      <div className="p-5">
        {!session ? (
          <div className="mb-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/30 p-6 text-center">
            <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <h3 className="mb-1 font-medium text-foreground">Join the conversation</h3>
            <p className="mb-4 text-sm text-muted-foreground">You must be signed in to leave a comment.</p>
            <button
              onClick={() => signIn("google")}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Sign In to Comment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <div className="hidden shrink-0 sm:block">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    width={40}
                    height={40}
                    unoptimized
                    className="rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts or ask a question..."
                  className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No comments yet. Be the first to start the discussion!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="shrink-0">
                  {comment.user.image ? (
                    <Image
                      src={comment.user.image}
                      alt={comment.user.name || "Avatar"}
                      width={40}
                      height={40}
                      unoptimized
                      className="rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{comment.user.name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
