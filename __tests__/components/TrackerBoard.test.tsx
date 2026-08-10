import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TrackerBoard from "@/components/public/TrackerBoard";
import { updateTrackerStatus, removeTrackerItem } from "@/app/(public)/tracker/actions";

// Mock server actions
vi.mock("@/app/(public)/tracker/actions", () => ({
  updateTrackerStatus: vi.fn(),
  removeTrackerItem: vi.fn(),
}));

describe("TrackerBoard", () => {
  const mockData = [
    {
      id: "track-1",
      status: "interested",
      createdAt: new Date("2024-01-01"),
      post: {
        titleEn: "UP Police Constable",
        titleHi: "यूपी पुलिस कांस्टेबल",
        slug: "up-police-constable",
        organization: "UPPRPB",
        state: { name: "Uttar Pradesh" },
        lastDate: new Date("2024-02-01"),
      }
    },
    {
      id: "track-2",
      status: "applied",
      createdAt: new Date("2024-01-05"),
      post: {
        titleEn: "SSC CGL",
        titleHi: "एसएससी सीजीएल",
        slug: "ssc-cgl",
        organization: "SSC",
        state: { name: "Delhi" },
        lastDate: new Date("2024-03-01"),
      }
    }
  ];

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn().mockReturnValue(true); // Mock window.confirm for delete action
  });

  it("renders all columns", () => {
    render(<TrackerBoard initialData={[]} />);
    expect(screen.getByText("Interested")).toBeInTheDocument();
    expect(screen.getByText("Applied")).toBeInTheDocument();
    expect(screen.getByText("Admit Card Out")).toBeInTheDocument();
    expect(screen.getByText("Result Declared")).toBeInTheDocument();
  });

  it("renders job cards in correct columns", () => {
    render(<TrackerBoard initialData={mockData} />);
    
    // Check titles exist
    expect(screen.getByText("UP Police Constable")).toBeInTheDocument();
    expect(screen.getByText("SSC CGL")).toBeInTheDocument();
    
    // Check column counts
    // 'Interested' should have 1 item, 'Applied' should have 1 item
    // Getting the counts is tricky as they might just be text nodes, but we know the layout.
    // Instead, we can verify that selects have the correct initial value.
    const selects = screen.getAllByRole("combobox") as HTMLSelectElement[];
    expect(selects[0].value).toBe("interested");
    expect(selects[1].value).toBe("applied");
  });

  it("calls updateTrackerStatus when dropdown changes", async () => {
    (updateTrackerStatus as any).mockResolvedValue(undefined);
    render(<TrackerBoard initialData={mockData} />);
    
    const selects = screen.getAllByRole("combobox") as HTMLSelectElement[];
    const firstSelect = selects[0]; // corresponds to "interested" job
    
    fireEvent.change(firstSelect, { target: { value: "admit_card" } });
    
    expect(updateTrackerStatus).toHaveBeenCalledWith("track-1", "admit_card");
    
    await waitFor(() => {
      // Optimitic update should change the select value
      expect(firstSelect.value).toBe("admit_card");
    });
  });

  it("calls removeTrackerItem when delete button is clicked", async () => {
    (removeTrackerItem as any).mockResolvedValue(undefined);
    render(<TrackerBoard initialData={mockData} />);
    
    // Get all delete buttons (identified by their title attribute)
    const deleteButtons = screen.getAllByTitle("Remove from tracker");
    
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(removeTrackerItem).toHaveBeenCalledWith("track-1");
    
    await waitFor(() => {
      expect(screen.queryByText("UP Police Constable")).not.toBeInTheDocument();
    });
  });
});
