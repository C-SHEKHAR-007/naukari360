import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/db";
import ContactForm from "@/components/public/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const page = await getPageBySlug("contact");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
      <p className="mt-1 font-hindi text-lg text-muted">संपर्क करें</p>

      {page?.contentEn && (
        <div
          className="prose prose-sm max-w-none dark:prose-invert mt-4"
          dangerouslySetInnerHTML={{ __html: page.contentEn }}
        />
      )}

      <ContactForm />
    </div>
  );
}
