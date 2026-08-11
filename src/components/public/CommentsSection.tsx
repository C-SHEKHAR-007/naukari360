"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { MessageSquare, Send, User, Loader2 } from "lucide-react";
import Image from "next/image";

function getShortTimeLabel(dateString: string) {
  const diffInSeconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

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
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (data.comments && Array.isArray(data.comments)) {
          setComments(data.comments);
          setNextCursor(data.nextCursor || null);
        } else if (Array.isArray(data)) {
          // Fallback for older API responses if cached
          setComments(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch comments", err);
        setLoading(false);
      });
  }, [postId]);

  const loadMore = async () => {
    if (!nextCursor || fetchingMore) return;
    setFetchingMore(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}&limit=10&cursor=${nextCursor}`);
      const data = await res.json();
      if (data.comments && Array.isArray(data.comments)) {
        setComments((prev) => [...prev, ...data.comments]);
        setNextCursor(data.nextCursor || null);
      }
    } catch (error) {
      console.error("Failed to fetch more comments", error);
    } finally {
      setFetchingMore(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      loadMore();
    }
  };

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
        {status === "loading" ? (
          <div className="mb-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border/40 bg-muted/20 p-6 text-center animate-pulse">
            <div className="mb-2 h-8 w-8 rounded-md bg-muted/50"></div>
            <div className="mb-2 h-5 w-48 rounded-md bg-muted/50"></div>
            <div className="mb-4 h-4 w-64 rounded-md bg-muted/50"></div>
            <div className="h-9 w-36 rounded-full bg-muted/50"></div>
          </div>
        ) : !session ? (
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
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <div className="relative flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts or ask a question..."
                  className="w-full resize-none rounded-lg border border-input bg-background p-3 pb-12 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary custom-scrollbar"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  title="Post Comment"
                  className="absolute bottom-4.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </form>
        )}

        <div 
          className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar pb-4" 
          onScroll={handleScroll}
        >
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
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
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
                      {getShortTimeLabel(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))
          )}
          
          {fetchingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
