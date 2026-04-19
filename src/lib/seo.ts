import type { Post } from "@prisma/client";

const SITE_URL = "https://naukari360.in";
const SITE_NAME = "Naukari360";

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Latest government jobs, exam results, admit cards, answer keys, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    sameAs: [],
  };
}

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
