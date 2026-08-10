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

describe("TrackApplicationButton", () => {
  const mockRouter = { push: vi.fn() };

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it("renders 'Track Progress' when initialTracked is false", () => {
    (useSession as any).mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    render(<TrackApplicationButton postId="post-1" initialTracked={false} />);
    expect(screen.getByText("Track Progress")).toBeInTheDocument();
  });

  it("renders 'View in Tracker' when initialTracked is true", () => {
    (useSession as any).mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    render(<TrackApplicationButton postId="post-1" initialTracked={true} />);
    expect(screen.getByText("View in Tracker")).toBeInTheDocument();
  });

  it("redirects to login if user is not authenticated", () => {
    (useSession as any).mockReturnValue({ data: null, status: "unauthenticated" });
    render(<TrackApplicationButton postId="post-1" initialTracked={false} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/admin/login?callbackUrl=/tracker");
    expect(addJobToTracker).not.toHaveBeenCalled();
  });

  it("redirects to /tracker if already tracked", () => {
    (useSession as any).mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    render(<TrackApplicationButton postId="post-1" initialTracked={true} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/tracker");
    expect(addJobToTracker).not.toHaveBeenCalled();
  });

  it("calls addJobToTracker and updates UI when clicked and not tracked", async () => {
    (useSession as any).mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    (addJobToTracker as any).mockResolvedValue(undefined);
    
    render(<TrackApplicationButton postId="post-1" initialTracked={false} />);
    
    fireEvent.click(screen.getByRole("button"));
    
    expect(addJobToTracker).toHaveBeenCalledWith("post-1");
    
    await waitFor(() => {
      expect(screen.getByText("View in Tracker")).toBeInTheDocument();
    });
  });
});
