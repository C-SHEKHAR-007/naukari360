import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { signIn } from "next-auth/react";
import AdminLoginPage from "@/app/(admin)/admin/login/page";

function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
}

describe("Admin login page", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => cleanup());

  it("signs in with credentials and goes to the dashboard", async () => {
    (signIn as any).mockResolvedValue({ error: null });
    render(<AdminLoginPage />);
    fill("admin@naukari360.in", "admin123");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/admin"));
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "admin@naukari360.in",
      password: "admin123",
      redirect: false,
    });
  });

  it("shows an error alert on invalid credentials", async () => {
    (signIn as any).mockResolvedValue({ error: "CredentialsSignin" });
    render(<AdminLoginPage />);
    fill("x@y.z", "nope");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password");
    expect(router.push).not.toHaveBeenCalled();
  });

  it("toggles password visibility", () => {
    render(<AdminLoginPage />);
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
  });

  it("warns when Caps Lock is on", () => {
    render(<AdminLoginPage />);
    const password = screen.getByLabelText("Password");
    fireEvent.keyUp(password, { key: "A", modifierCapsLock: true });
    expect(screen.getByText("Caps Lock is on")).toBeInTheDocument();
    expect(password).toHaveAttribute("aria-describedby", "caps-lock-warning");
    fireEvent.keyUp(password, { key: "a", modifierCapsLock: false });
    expect(screen.queryByText("Caps Lock is on")).not.toBeInTheDocument();
  });

  it("shows the brand panel copy and the restricted-area notice", () => {
    render(<AdminLoginPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Admin Login" })).toBeInTheDocument();
    // Shown in the desktop brand panel and in the mobile hero (CSS picks one)
    expect(screen.getAllByText("Admin Access Only")).toHaveLength(2);
    expect(screen.getByText("Create & Manage Content")).toBeInTheDocument();
    expect(
      screen.getByText("This area is restricted to authorized admins only.")
    ).toBeInTheDocument();
  });
});
