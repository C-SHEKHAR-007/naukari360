import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug("privacy-policy");
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">{page.titleEn}</h1>
      {page.titleHi && <p className="mt-1 font-hindi text-lg text-muted">{page.titleHi}</p>}
      {page.contentEn && (
        <div
          className="prose prose-sm max-w-none dark:prose-invert mt-6"
          dangerouslySetInnerHTML={{ __html: page.contentEn }}
        />
      )}
    </div>
  );
}
