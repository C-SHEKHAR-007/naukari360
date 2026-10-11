"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  ShieldCheck,
  SquarePen,
} from "lucide-react";
import { Alert, Label, fieldClass } from "@/components/ui";
import ThemeToggle from "@/components/public/ThemeToggle";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: SquarePen, title: "Create & Manage Content", text: "Publish posts, jobs, and updates." },
  { icon: Megaphone, title: "Handle Ads & Campaigns", text: "Run and manage advertisements." },
  { icon: Bell, title: "Send Notifications", text: "Keep users informed and engaged." },
  {
    icon: ShieldCheck,
    title: "Secure & Controlled",
    text: "Access limited to authorized admins only.",
  },
];

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink text-ink-foreground lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-16">
      {/* Dusk scene in CSS: sunset window glow on the right, brand arcs, depth.
          To use a photo instead, add an <Image fill> here masked like the glow below. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="absolute inset-y-0 right-0 w-[55%] bg-gradient-to-b from-info/40 via-highlight/50 to-brand/70 [mask-image:linear-gradient(90deg,transparent,black_40%)]" />
        <div className="absolute bottom-[18%] right-[8%] h-64 w-80 rounded-full bg-brand/55 blur-3xl" />
        <div className="absolute right-[18%] top-[22%] h-40 w-40 rounded-full bg-highlight/40 blur-3xl" />

        {/* Orange corner arc (top left) and blue swooping arcs */}
        <div className="absolute -left-36 -top-44 h-64 w-64 rounded-full bg-brand shadow-[0_0_80px_20px] shadow-brand/30" />
        <div className="absolute -left-[22rem] top-[12%] h-[60rem] w-[60rem] rounded-full border border-info/40" />
        <div className="absolute -bottom-[34rem] -left-24 h-[48rem] w-[48rem] rounded-full border-[5rem] border-info/25" />
        <div className="absolute -right-64 -top-40 h-[40rem] w-[40rem] rounded-full border-[4rem] border-info/20" />

        <div className="bg-dots absolute inset-0 text-ink-foreground opacity-20 [mask-image:linear-gradient(180deg,black,transparent_70%)]" />
      </div>

      <div className="relative flex items-center gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.svg" alt="" className="h-14 w-14 rounded-xl shadow-lg" />
        <span className="text-[1.65rem] font-bold tracking-tight">
          Naukari<span className="text-brand">360</span>
        </span>
      </div>

      <div className="relative max-w-lg">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-info/30 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-info/40">
          <ShieldCheck className="h-4 w-4" /> Admin Access Only
        </p>
        <h2 className="text-[2.6rem] font-extrabold leading-[1.15] tracking-tight">
          Manage. Publish.
          <br />
          Build a <span className="text-brand">Better Platform.</span>
        </h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-foreground/80">
          This is the admin panel for Naukari360. Here you can manage posts, ads, notifications and
          everything that keeps the platform running smoothly.
        </p>

        <ul className="mt-9 space-y-5">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-info/20 ring-1 ring-ink-foreground/10">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-xs text-ink-foreground/70">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="mb-5 h-px w-52 bg-ink-foreground/15" />
        <p className="text-xs text-ink-foreground/70">Naukari360 &nbsp;•&nbsp; Admin Panel</p>
      </div>
    </aside>
  );
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("Invalid email or password");
    } else {
      // Keep the button in its loading state while the dashboard loads
      router.push("/admin");
      router.refresh();
    }
  }

  const trackCapsLock = (e: React.KeyboardEvent) => setCapsLock(e.getModifierState("CapsLock"));
  const inputClass = cn(
    fieldClass,
    "h-[3.25rem] rounded-xl border-input/70 bg-surface/70 pl-12 text-[0.95rem]"
  );

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.07fr_1fr]">
      <BrandPanel />

      <main className="relative flex flex-col overflow-hidden px-5 py-6 sm:px-10">
        {/* Soft decorative circles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-info/8" />
          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-info/8" />
        </div>

        <div className="relative flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <ThemeToggle />
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[34rem] rounded-3xl border border-border/70 bg-card px-6 py-10 shadow-[0_24px_60px_-28px_rgb(15_23_42/0.25)] sm:px-8">
            <div className="text-center">
              <span className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-info-subtle">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info text-white shadow-md shadow-info/30">
                  <Lock className="h-5 w-5" />
                </span>
              </span>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground">
                Admin Login
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-[0.95rem] leading-relaxed text-muted-foreground">
                Sign in to access your admin dashboard to manage the platform.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && <Alert tone="danger">{error}</Alert>}

              <div>
                <Label htmlFor="email" className="mb-2 font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className={inputClass}
                    placeholder="admin@naukari360.in"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={trackCapsLock}
                    onKeyUp={trackCapsLock}
                    required
                    aria-describedby={capsLock ? "caps-lock-warning" : undefined}
                    className={cn(inputClass, "pr-12")}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <Eye className="h-[18px] w-[18px]" />
                    ) : (
                      <EyeOff className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
                {capsLock && (
                  <p
                    id="caps-lock-warning"
                    className="mt-1.5 text-xs font-medium text-warning-emphasis"
                  >
                    Caps Lock is on
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-info text-[0.95rem] font-semibold text-white shadow-md shadow-info/25 transition-all hover:bg-info/90 hover:shadow-lg active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              Authorized Personnel Only
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" /> This area is restricted to authorized admins only.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
