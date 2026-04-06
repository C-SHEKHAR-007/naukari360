import type { Metadata } from "next";
import QualificationPageTemplate from "@/components/public/QualificationPageTemplate";

export const metadata: Metadata = {
  title: "10th Pass Government Jobs",
  description:
    "Government jobs for 10th pass candidates. Sarkari naukri for class 10 qualification.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function TenthPassPage({ searchParams }: Props) {
  return (
    <QualificationPageTemplate
      level="tenth"
      title="10th Pass Government Jobs"
      titleHi="10वीं पास सरकारी नौकरी"
      description="All government jobs requiring 10th pass (Matric) qualification."
      baseUrl="/10th-pass"
      searchParams={searchParams}
    />
  );
}
