import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Alert,
  Badge,
  Button,
  Card,
  IconTile,
  Input,
  Label,
  SectionHeader,
  buttonVariants,
} from "@/components/ui";

describe("ui primitives", () => {
  afterEach(() => cleanup());

  it("Button defaults to a primary button of type=button", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.className).toContain("bg-primary");
    expect(btn.className).toContain("text-primary-foreground");
  });

  it("Button variants and caller classes merge without conflicts", () => {
    render(
      <Button variant="danger" size="sm" type="submit" className="px-8">
        Delete
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toHaveAttribute("type", "submit");
    expect(btn.className).toContain("bg-danger");
    expect(btn.className).toContain("px-8");
    expect(btn.className).not.toContain("px-3"); // overridden by tailwind-merge
  });

  it("buttonVariants can style links", () => {
    expect(buttonVariants({ variant: "outline" })).toContain("border-border");
  });

  it("Badge uses subtle tone classes by default and solid on request", () => {
    render(
      <>
        <Badge tone="danger">Closing soon</Badge>
        <Badge tone="success" variant="solid">
          New
        </Badge>
      </>
    );
    expect(screen.getByText("Closing soon").className).toMatch(
      /bg-danger-subtle.*text-danger-emphasis/
    );
    expect(screen.getByText("New").className).toMatch(/bg-success.*text-white/);
  });

  it("Alert announces errors assertively and other tones politely", () => {
    render(
      <>
        <Alert tone="danger">Failed</Alert>
        <Alert tone="success">Saved</Alert>
      </>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("Card, IconTile and SectionHeader render token classes", () => {
    render(
      <Card data-testid="card">
        <SectionHeader
          tone="warning"
          icon={<span>!</span>}
          title={<h2>Closing Soon</h2>}
          action={<button type="button">View all</button>}
        />
        <IconTile tone="info" data-testid="tile" />
      </Card>
    );
    expect(screen.getByTestId("card").className).toContain("bg-card");
    expect(screen.getByRole("heading", { name: "Closing Soon" })).toBeInTheDocument();
    expect(screen.getByText("!").parentElement?.className).toContain("bg-warning-subtle");
    expect(screen.getByTestId("tile").className).toContain("text-info-emphasis");
  });

  it("Label and Input associate and keep native attributes", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </>
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toBeRequired();
    expect(input.className).toContain("border-input");
  });
});
