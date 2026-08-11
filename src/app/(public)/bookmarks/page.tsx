import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/public/PostCard";
import { Bookmark, LogIn } from "lucide-react";
import Link from "next/link";
import { signIn } from "@/lib/auth"; // We can't directly use this in a server component for a form action unless we wrap it in a server action or use client component.
import SignInButton from "@/components/public/SignInButton"; // We will create this client component

export const metadata = {
  title: "My Saved Jobs | Naukari360",
};

export default async function BookmarksPage() {
  const session = await auth();

  // If user is not logged in, show a prompt to login
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="flex flex-col items-center justify-center py-20 text-center">
        <Bookmark className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Save your favorite jobs</h1>
        <p className="mt-2 text-muted">
          Sign in to save job postings and access them from any device, anytime.
        </p>
        <div className="mt-8 flex justify-center">
          <SignInButton />
        </div>
        </div>
      </div>
    );
  }

  // Fetch bookmarks from database
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: {
      post: {
        include: {
          category: true,
          state: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">My Saved Jobs</h1>
          <p className="mt-1 text-sm text-muted">
            You have {bookmarks.length} saved job{bookmarks.length !== 1 && "s"}.
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-24 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted/50" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">No saved jobs</h3>
          <p className="mt-1 text-sm text-muted">
            When you bookmark a job, it will appear here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookmarks.map((bookmark) => (
            <PostCard key={bookmark.id} post={bookmark.post} />
          ))}
        </div>
      )}
    </div>
  );
}
