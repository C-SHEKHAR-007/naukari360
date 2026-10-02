import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TrackApplicationButton from "@/components/public/TrackApplicationButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addJobToTracker } from "@/app/(public)/tracker/actions";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock server actions
vi.mock("@/app/(public)/tracker/actions", () => ({
  addJobToTracker: vi.fn(),
}));

function mockTrackedFetch(isTracked: boolean) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ isTracked, completedTopics: [] }),
  }) as unknown as typeof fetch;
}

describe("TrackApplicationButton", () => {
  const mockRouter = { push: vi.fn() };

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    mockTrackedFetch(false);
  });

  it("renders 'Track Progress' when the post is not tracked", () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    });
    render(<TrackApplicationButton postId="post-1" />);
    expect(screen.getByText("Track Progress")).toBeInTheDocument();
  });

  it("loads tracked state and renders 'View in Tracker'", async () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    });
    mockTrackedFetch(true);
    render(<TrackApplicationButton postId="post-1" />);
    expect(await screen.findByText("View in Tracker")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/post-user-state?postId=post-1");
  });

  it("redirects to login if user is not authenticated", () => {
    (useSession as any).mockReturnValue({ data: null, status: "unauthenticated" });
    render(<TrackApplicationButton postId="post-1" />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/admin/login?callbackUrl=/tracker");
    expect(addJobToTracker).not.toHaveBeenCalled();
  });

  it("redirects to /tracker if already tracked", async () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    });
    mockTrackedFetch(true);
    render(<TrackApplicationButton postId="post-1" />);
    await screen.findByText("View in Tracker");

    fireEvent.click(screen.getByRole("button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/tracker");
    expect(addJobToTracker).not.toHaveBeenCalled();
  });

  it("calls addJobToTracker and updates UI when clicked and not tracked", async () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    });
    (addJobToTracker as any).mockResolvedValue(undefined);

    render(<TrackApplicationButton postId="post-1" />);

    fireEvent.click(screen.getByRole("button"));

    expect(addJobToTracker).toHaveBeenCalledWith("post-1");

    await waitFor(() => {
      expect(screen.getByText("View in Tracker")).toBeInTheDocument();
    });
  });
});
