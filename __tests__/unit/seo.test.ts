import { describe, it, expect } from "vitest";
import {
  generateJobPostingSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
} from "@/lib/seo";

describe("generateJobPostingSchema", () => {
  const mockPost = {
    id: "test-id",
    titleEn: "SSC CGL 2025 Notification",
    titleHi: "SSC CGL 2025 अधिसूचना",
    slug: "ssc-cgl-2025-notification",
    excerptEn: "Apply for 17727 posts",
    excerptHi: null,
    contentEn: null,
    contentHi: null,
    organization: "Staff Selection Commission",
    status: "published" as const,
    badge: "HOT" as const,
    totalPosts: "17727",
    qualification: "Graduate",
    qualificationLevel: "graduate" as const,
    minAge: 18,
    maxAge: 32,
    ageLimit: "18-32",
    salary: "25000-80000",
    feeGeneral: "100",
    feeObc: "100",
    feeScSt: "0",
    feeWomen: "0",
    lastDate: new Date("2025-06-30"),
    examDate: null,
    resultDate: null,
    applyLink: "https://ssc.nic.in",
    officialLink: "https://ssc.nic.in",
    notificationLink: null,
    admitCardLink: null,
    answerKeyLink: null,
    syllabusLink: null,
    isTrending: false,
    isHot: true,
    isNew: false,
    metaTitle: null,
    metaDesc: null,
    metaKeywords: null,
    ogImage: null,
    readingTime: 3,
    views: 100,
    categoryId: "cat-id",
    stateId: null,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  };

  it("generates valid JobPosting schema", () => {
    const schema = generateJobPostingSchema({
      post: mockPost as any,
      url: "https://naukari360.in/post/ssc-cgl-2025-notification",
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("JobPosting");
    expect(schema.title).toBe("SSC CGL 2025 Notification");
    expect(schema.hiringOrganization.name).toBe("Staff Selection Commission");
    expect(schema.url).toBe("https://naukari360.in/post/ssc-cgl-2025-notification");
  });

  it("uses titleEn as fallback description when excerptEn is empty", () => {
    const postNoExcerpt = { ...mockPost, excerptEn: null };
    const schema = generateJobPostingSchema({
      post: postNoExcerpt as any,
      url: "https://naukari360.in/post/test",
    });

    expect(schema.description).toBe("SSC CGL 2025 Notification");
  });

  it("includes validThrough when lastDate is set", () => {
    const schema = generateJobPostingSchema({
      post: mockPost as any,
      url: "https://naukari360.in/post/test",
    });

    expect(schema.validThrough).toBeDefined();
    expect(schema.validThrough).toContain("2025-06-30");
  });

  it("sets default organization when none provided", () => {
    const postNoOrg = { ...mockPost, organization: null };
    const schema = generateJobPostingSchema({
      post: postNoOrg as any,
      url: "https://naukari360.in/post/test",
    });

    expect(schema.hiringOrganization.name).toBe("Government of India");
  });
});

describe("generateFAQSchema", () => {
  it("generates valid FAQPage schema", () => {
    const faqs = [
      { questionEn: "What is SSC CGL?", answerEn: "A national level exam." },
      { questionEn: "Who is eligible?", answerEn: "Graduates aged 18-32." },
    ];

    const schema = generateFAQSchema(faqs);

    expect(schema).not.toBeNull();
    expect(schema!["@type"]).toBe("FAQPage");
    expect(schema!.mainEntity).toHaveLength(2);
    expect(schema!.mainEntity[0]["@type"]).toBe("Question");
    expect(schema!.mainEntity[0].name).toBe("What is SSC CGL?");
    expect(schema!.mainEntity[0].acceptedAnswer.text).toBe("A national level exam.");
  });

  it("returns null for empty FAQs", () => {
    expect(generateFAQSchema([])).toBeNull();
  });
});

describe("generateBreadcrumbSchema", () => {
  it("generates valid BreadcrumbList schema", () => {
    const items = [
      { name: "Home", url: "https://naukari360.in" },
      { name: "Latest Jobs", url: "https://naukari360.in/latest-jobs" },
      { name: "SSC CGL 2025", url: "https://naukari360.in/post/ssc-cgl-2025" },
    ];

    const schema = generateBreadcrumbSchema(items);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[2].position).toBe(3);
    expect(schema.itemListElement[1].name).toBe("Latest Jobs");
  });

  it("handles single item", () => {
    const schema = generateBreadcrumbSchema([{ name: "Home", url: "/" }]);
    expect(schema.itemListElement).toHaveLength(1);
  });
});

describe("generateWebSiteSchema", () => {
  it("generates valid WebSite schema", () => {
    const schema = generateWebSiteSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe("Naukari360");
    expect(schema.url).toBe("https://naukari360.in");
  });

  it("includes SearchAction", () => {
    const schema = generateWebSiteSchema();
    expect(schema.potentialAction["@type"]).toBe("SearchAction");
    expect(schema.potentialAction.target.urlTemplate).toContain("/search?q=");
  });
});

describe("generateOrganizationSchema", () => {
  it("generates valid Organization schema", () => {
    const schema = generateOrganizationSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Naukari360");
    expect(schema.logo).toContain("icon-512x512");
  });
});
