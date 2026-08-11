import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TrackerBoard from "@/components/public/TrackerBoard";
import { LayoutDashboard } from "lucide-react";
import SignInButton from "@/components/public/SignInButton";
import Link from "next/link";

export const metadata = {
  title: "Application Tracker | Naukari360",
  description: "Track all your government job applications in one place.",
};

export default async function TrackerPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <LayoutDashboard className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Application Tracker</h1>
        <p className="mt-2 text-muted">
          Sign in to track your job applications (Interested, Applied, Admit Card, Result).
        </p>
        <div className="mt-8 flex justify-center">
          <SignInButton />
        </div>
      </div>
    );
  }

  const trackedJobs = await prisma.applicationTracker.findMany({
    where: { userId: session.user.id },
    include: {
      post: {
        select: {
          titleEn: true,
          titleHi: true,
          slug: true,
          organization: true,
          lastDate: true,
          state: { select: { name: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Application Tracker</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your government job application pipeline seamlessly.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          Browse Jobs to Track
        </Link>
      </div>

      <TrackerBoard initialData={trackedJobs} />
    </div>
  );
}
