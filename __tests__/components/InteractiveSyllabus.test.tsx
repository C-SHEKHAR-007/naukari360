import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import InteractiveSyllabus from "@/components/public/InteractiveSyllabus";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toggleSyllabusTopic } from "@/app/(public)/post/[slug]/syllabus-actions";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/app/(public)/post/[slug]/syllabus-actions", () => ({
  toggleSyllabusTopic: vi.fn(),
}));

describe("InteractiveSyllabus", () => {
  const mockSyllabus = [
    {
      title: "Mathematics",
      topics: ["Algebra", "Geometry"],
    },
    {
      title: "General Knowledge",
      topics: ["History", "Geography"],
    },
  ];

  const mockRouter = { push: vi.fn() };

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter as never);
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: "user-1", role: "user" } },
      status: "authenticated",
    } as never);
  });

  it("renders the syllabus component with progress bar", () => {
    render(
      <InteractiveSyllabus
        postId="post-1"
        syllabus={mockSyllabus}
        initialCompletedTopics={[]}
      />
    );
    expect(screen.getByText("Interactive Syllabus Tracker")).toBeInTheDocument();
    expect(screen.getByText("0% Completed")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("General Knowledge")).toBeInTheDocument();
  });

  it("renders correctly with initially completed topics", () => {
    render(
      <InteractiveSyllabus
        postId="post-1"
        syllabus={mockSyllabus}
        initialCompletedTopics={["Algebra"]}
      />
    );
    // 1 out of 4 topics = 25%
    expect(screen.getByText("25% Completed")).toBeInTheDocument();
  });

  it("calls toggleSyllabusTopic when a topic is clicked", async () => {
    vi.mocked(toggleSyllabusTopic).mockResolvedValue(undefined);
    
    render(
      <InteractiveSyllabus
        postId="post-1"
        syllabus={mockSyllabus}
        initialCompletedTopics={[]}
      />
    );
    
    // "Mathematics" section is expanded by default (the first one)
    const algebraBtn = screen.getByRole("button", { name: /Algebra/i });
    fireEvent.click(algebraBtn);
    
    expect(toggleSyllabusTopic).toHaveBeenCalledWith("post-1", "Algebra");
    
    // Check optimistic update
    await waitFor(() => {
      expect(screen.getByText("25% Completed")).toBeInTheDocument();
    });
  });

  it("prompts Google login if not authenticated", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as never);
    
    render(
      <InteractiveSyllabus
        postId="post-1"
        syllabus={mockSyllabus}
        initialCompletedTopics={[]}
      />
    );
    
    const algebraBtn = screen.getByRole("button", { name: /Algebra/i });
    fireEvent.click(algebraBtn);
    
    expect(signIn).toHaveBeenCalledWith("google");
    expect(toggleSyllabusTopic).not.toHaveBeenCalled();
  });
});
