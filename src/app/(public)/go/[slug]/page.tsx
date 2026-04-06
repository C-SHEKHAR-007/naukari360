import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/db";
import AdSlot from "@/components/public/AdSlot";
import InterstitialCountdown from "@/components/public/InterstitialCountdown";

export const metadata: Metadata = {
  title: "Redirecting...",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function InterstitialPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { type } = await searchParams;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Determine destination URL
  let destinationUrl: string | null = null;
  if (type === "apply" && post.applyLink) {
    destinationUrl = post.applyLink;
  } else if (post.officialLink) {
    destinationUrl = post.officialLink;
  } else if (post.applyLink) {
    destinationUrl = post.applyLink;
  }

  if (!destinationUrl) {
    redirect(`/post/${slug}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="text-xl font-bold text-foreground">You are being redirected...</h1>
      <p className="mt-2 text-sm text-muted">
        Please wait while we redirect you to the official page for:
      </p>
      <p className="mt-2 font-medium text-primary">{post.titleEn}</p>

      <AdSlot slotKey="interstitial_full" className="my-8" />

      <InterstitialCountdown url={destinationUrl} />

      <p className="mt-8 text-xs text-muted">
        If you are not redirected automatically,{" "}
        <a href={destinationUrl} rel="noopener noreferrer" className="text-primary hover:underline">
          click here
        </a>
      </p>
    </div>
  );
}
