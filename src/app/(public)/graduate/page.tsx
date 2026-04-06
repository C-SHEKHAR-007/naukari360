import type { Metadata } from "next";
import QualificationPageTemplate from "@/components/public/QualificationPageTemplate";

export const metadata: Metadata = {
  title: "Graduate Government Jobs",
  description: "Government jobs for graduates. Sarkari naukri for bachelor's degree holders.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function GraduatePage({ searchParams }: Props) {
  return (
    <QualificationPageTemplate
      level="graduate"
      title="Government Jobs for Graduates"
      titleHi="ग्रेजुएट सरकारी नौकरी"
      description="All government jobs requiring graduation (Bachelor's degree) qualification."
      baseUrl="/graduate"
      searchParams={searchParams}
    />
  );
}
