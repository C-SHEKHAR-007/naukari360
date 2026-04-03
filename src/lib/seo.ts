import type { Post } from "@prisma/client";

interface JobPostingSchemaParams {
  post: Post;
  url: string;
}

export function generateJobPostingSchema({ post, url }: JobPostingSchemaParams) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: post.titleEn,
    description: post.excerptEn || post.titleEn,
    identifier: { "@type": "PropertyValue", name: post.organization, value: post.slug },
    datePosted: post.createdAt.toISOString(),
    validThrough: post.lastDate?.toISOString(),
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: post.organization || "Government of India",
    },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "IN" } },
    url,
  };
}

export function generateFAQSchema(faqs: { questionEn: string; answerEn: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.questionEn,
      acceptedAnswer: { "@type": "Answer", text: faq.answerEn },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
