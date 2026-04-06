import type { Metadata } from "next";
import QualificationPageTemplate from "@/components/public/QualificationPageTemplate";

export const metadata: Metadata = {
  title: "12th Pass Government Jobs",
  description:
    "Government jobs for 12th pass candidates. Sarkari naukri for class 12 / Intermediate qualification.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function TwelfthPassPage({ searchParams }: Props) {
  return (
    <QualificationPageTemplate
      level="twelfth"
      title="12th Pass Government Jobs"
      titleHi="12वीं पास सरकारी नौकरी"
      description="All government jobs requiring 12th pass (Intermediate) qualification."
      baseUrl="/12th-pass"
      searchParams={searchParams}
    />
  );
}
