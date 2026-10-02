import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { useSession } from "next-auth/react";

vi.mock("next-auth/react", () => ({ useSession: vi.fn() }));
vi.mock("@/components/public/InteractiveSyllabus", () => ({
  default: ({ initialCompletedTopics }: { initialCompletedTopics: string[] }) => (
    <div data-testid="interactive-syllabus">{initialCompletedTopics.join(",") || "none"}</div>
  ),
}));

import SyllabusTracker from "@/components/public/SyllabusTracker";
import QuickTrackerModal from "@/components/public/QuickTrackerModal";

const syllabus = [{ title: "Maths", topics: ["Algebra", "Geometry"] }];

function mockFetch(completedTopics: string[]) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ isTracked: false, completedTopics }),
  }) as unknown as typeof fetch;
}

describe("SyllabusTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch([]);
  });
  afterEach(() => cleanup());

  it("shows a placeholder while the session is loading", () => {
    (useSession as any).mockReturnValue({ data: null, status: "loading" });
    render(<SyllabusTracker postId="p1" syllabusId="s1" syllabus={syllabus} />);
    expect(screen.getByLabelText("Loading your progress")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders with no saved progress for anonymous users, without fetching", async () => {
    (useSession as any).mockReturnValue({ data: null, status: "unauthenticated" });
    render(<SyllabusTracker postId="p1" syllabusId="s1" syllabus={syllabus} />);
    expect(await screen.findByTestId("interactive-syllabus")).toHaveTextContent("none");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("loads saved progress for signed-in users", async () => {
    (useSession as any).mockReturnValue({ data: { user: { id: "u1" } }, status: "authenticated" });
    mockFetch(["Algebra"]);
    render(<SyllabusTracker postId="p1" syllabusId="s1" syllabus={syllabus} />);
    expect(await screen.findByTestId("interactive-syllabus")).toHaveTextContent("Algebra");
    expect(global.fetch).toHaveBeenCalledWith("/api/post-user-state?postId=p1&syllabusId=s1");
  });

  it("falls back to empty progress if the request fails", async () => {
    (useSession as any).mockReturnValue({ data: { user: { id: "u1" } }, status: "authenticated" });
    global.fetch = vi.fn().mockRejectedValue(new Error("offline")) as unknown as typeof fetch;
    render(<SyllabusTracker postId="p1" syllabusId="s1" syllabus={syllabus} />);
    expect(await screen.findByTestId("interactive-syllabus")).toHaveTextContent("none");
  });
});

describe("QuickTrackerModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(["Geometry"]);
    (useSession as any).mockReturnValue({ data: { user: { id: "u1" } }, status: "authenticated" });
  });
  afterEach(() => cleanup());

  it("does not fetch progress until the modal is opened", () => {
    render(<QuickTrackerModal postId="p1" syllabusId="s1" syllabus={syllabus} />);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("loads saved progress when opened", async () => {
    render(<QuickTrackerModal postId="p1" syllabusId="s1" syllabus={syllabus} />);
    fireEvent.click(screen.getByText("Quick Tracker"));
    expect(await screen.findByTestId("interactive-syllabus")).toHaveTextContent("Geometry");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
