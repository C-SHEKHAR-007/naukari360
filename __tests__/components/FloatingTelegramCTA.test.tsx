import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import FloatingTelegramCTA from "@/components/public/FloatingTelegramCTA";

describe("FloatingTelegramCTA", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing when no telegramUrl provided", () => {
    const { container } = render(<FloatingTelegramCTA />);
    expect(container.innerHTML).toBe("");
  });

  it("renders telegram link with correct url", () => {
    render(<FloatingTelegramCTA telegramUrl="https://t.me/testchannel" />);
    const link = screen.getByLabelText("Join our Telegram channel");
    expect(link).toHaveAttribute("href", "https://t.me/testchannel");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("dismisses when close button is clicked", () => {
    render(<FloatingTelegramCTA telegramUrl="https://t.me/testchannel" />);
    expect(screen.getByLabelText("Join our Telegram channel")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Dismiss Telegram button"));
    expect(screen.queryByLabelText("Join our Telegram channel")).not.toBeInTheDocument();
  });
});
