import type { Metadata } from "next";
import QualificationPageTemplate from "@/components/public/QualificationPageTemplate";

export const metadata: Metadata = {
  title: "Post Graduate Government Jobs",
  description: "Government jobs for post graduates. Sarkari naukri for master's degree holders.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function PostGraduatePage({ searchParams }: Props) {
  return (
    <QualificationPageTemplate
      level="post_graduate"
      title="Government Jobs for Post Graduates"
      titleHi="पोस्ट ग्रेजुएट सरकारी नौकरी"
      description="All government jobs requiring post graduation (Master's degree) qualification."
      baseUrl="/post-graduate"
      searchParams={searchParams}
    />
  );
}
