import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockFetch = vi.fn();
global.fetch = mockFetch;

import InterstitialManager from "@/components/admin/InterstitialManager";

const mockConfigs = [
  {
    id: "int-1",
    title: "Download Page",
    adSlotKey: "interstitial_download",
    delaySeconds: 5,
    isActive: true,
  },
  {
    id: "int-2",
    title: "Apply Page",
    adSlotKey: "interstitial_apply",
    delaySeconds: 8,
    isActive: false,
  },
];

describe("InterstitialManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all interstitial configs", () => {
    render(<InterstitialManager configs={mockConfigs} />);
    expect(screen.getByText("Download Page")).toBeInTheDocument();
    expect(screen.getByText("Apply Page")).toBeInTheDocument();
  });

  it("shows slot key and delay", () => {
    const { container } = render(<InterstitialManager configs={mockConfigs} />);
    expect(container.textContent).toContain("interstitial_download");
    expect(container.textContent).toContain("5s");
    expect(container.textContent).toContain("8s");
  });

  it("shows add form when Add Config button is clicked", () => {
    render(<InterstitialManager configs={mockConfigs} />);
    fireEvent.click(screen.getAllByText("Add Config")[0]);
    expect(screen.getByPlaceholderText("Title (e.g., Download Page)")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ad Slot Key (e.g., interstitial_main)")
    ).toBeInTheDocument();
  });

  it("creates new config on form submit", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "int-3",
        title: "Result Page",
        adSlotKey: "interstitial_result",
        delaySeconds: 10,
        isActive: true,
      }),
    });

    render(<InterstitialManager configs={mockConfigs} />);
    fireEvent.click(screen.getAllByText("Add Config")[0]);

    fireEvent.change(screen.getByPlaceholderText("Title (e.g., Download Page)"), {
      target: { value: "Result Page" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ad Slot Key (e.g., interstitial_main)"), {
      target: { value: "interstitial_result" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/admin/interstitial",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("toggles active state", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "int-1", isActive: false }),
    });

    const { container } = render(<InterstitialManager configs={mockConfigs} />);
    // Find the toggle button for the first config (first button in each config card)
    const configCards = container.querySelectorAll("div[class*='rounded-lg border']");
    // Skip the header area, get first config card's first button
    const firstCardButtons = configCards[0]?.querySelectorAll("button");
    if (firstCardButtons && firstCardButtons.length > 0) {
      fireEvent.click(firstCardButtons[0]);
    }

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/admin/interstitial/int-1",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  it("deletes config on confirm", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const { container } = render(<InterstitialManager configs={mockConfigs} />);
    const configCards = container.querySelectorAll("div[class*='rounded-lg border']");
    const firstCardButtons = configCards[0]?.querySelectorAll("button");
    // Last button should be delete
    if (firstCardButtons && firstCardButtons.length >= 3) {
      fireEvent.click(firstCardButtons[firstCardButtons.length - 1]);
    }

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/interstitial/int-1", { method: "DELETE" });
    });
  });

  it("shows empty state when no configs", () => {
    render(<InterstitialManager configs={[]} />);
    expect(screen.getByText(/No interstitial configs yet/)).toBeInTheDocument();
  });
});
