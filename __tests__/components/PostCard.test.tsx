import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mock language provider
vi.mock("@/components/providers/LanguageProvider", () => ({
  useLanguage: () => ({
    t: (en: string) => en,
    language: "en",
    setLanguage: vi.fn(),
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

import PostCard from "@/components/public/PostCard";

const mockPost = {
  id: "post-1",
  titleEn: "SSC CGL 2025 Notification",
  titleHi: "SSC CGL 2025 अधिसूचना",
  slug: "ssc-cgl-2025",
  excerptEn: "Apply for 17727 posts in SSC CGL exam.",
  excerptHi: null,
  status: "published" as const,
  badge: "HOT" as const,
  totalPosts: "17727",
  organization: "Staff Selection Commission",
  qualification: "Graduate",
  qualificationLevel: "graduate" as const,
  salary: "₹25,500 - ₹1,51,100/month",
  lastDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  examDate: null,
  resultDate: null,
  applyLink: "https://ssc.nic.in",
  isTrending: false,
  isHot: true,
  isNew: false,
  readingTime: 3,
  views: 1500,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {
    id: "cat-1",
    name: "Latest Jobs",
    nameHi: "नवीनतम नौकरी",
    slug: "latest-jobs",
    color: "#FF6B00",
  },
  state: { id: "state-1", name: "All India", nameHi: "अखिल भारतीय", slug: "all-india" },
};

describe("PostCard", () => {
  it("renders post title", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toContain("SSC CGL 2025 Notification");
  });

  it("renders badge", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toContain("HOT");
  });

  it("renders organization", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toContain("Staff Selection Commission");
  });

  it("renders total posts with vacancies", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toContain("17727 vacancies");
  });

  it("renders countdown for future last date", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toMatch(/\d+d left/);
  });

  it("renders category name", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toContain("Latest Jobs");
  });

  it("links to post detail page", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    const link = container.querySelector('a[href="/post/ssc-cgl-2025"]');
    expect(link).toBeInTheDocument();
  });

  it("shows bookmark button", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    const btn = container.querySelector('[aria-label="Bookmark"]');
    expect(btn).toBeInTheDocument();
  });

  it("renders qualification", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toContain("Graduate");
  });

  it("renders state name", () => {
    const { container } = render(<PostCard post={mockPost as any} />);
    expect(container.textContent).toContain("All India");
  });
});
