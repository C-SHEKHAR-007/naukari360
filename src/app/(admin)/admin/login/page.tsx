"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Globe,
  Loader2,
  Megaphone,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Alert, HoverHint, Label, fieldClass } from "@/components/ui";
import ThemeToggle from "@/components/public/ThemeToggle";
import { AdminBrand } from "@/components/admin/AdminBrand";
import { cn } from "@/lib/utils";

const POINTS = [
  {
    icon: FileText,
    title: "Publish jobs, results and admit cards",
    text: "Drafts, scheduling and syllabuses in one place.",
  },
  {
    icon: Send,
    title: "Reach every aspirant",
    text: "Push notifications, newsletters and site announcements.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based and secure",
    text: "Access limited to authorized admins only.",
  },
];

// Satellites around the hub, clockwise from the top (x/y in % of the square)
const SATELLITES = [
  { icon: FileText, label: "Posts", x: 50, y: 12 },
  { icon: Bell, label: "Alerts", x: 82.9, y: 31 },
  { icon: Megaphone, label: "Ads", x: 82.9, y: 69 },
  { icon: Users, label: "Subscribers", x: 50, y: 88 },
  { icon: BarChart3, label: "Analytics", x: 17.1, y: 69 },
  { icon: FolderOpen, label: "Categories", x: 17.1, y: 31 },
];

// Everything the admin panel runs, wired into one core. Decorative.
function ControlHub() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square h-full">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          className="stroke-border"
          strokeWidth="0.3"
          strokeDasharray="1 2"
        />
        <circle cx="50" cy="50" r="22" fill="none" className="stroke-border" strokeWidth="0.3" />
        {SATELLITES.map((s, i) => (
          <line
            key={s.label}
            x1="50"
            y1="50"
            x2={s.x}
            y2={s.y}
            className="hub-flow stroke-brand/60"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            style={{ animationDelay: `${i * -0.2}s` }}
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="hub-pulse absolute inset-0 rounded-2xl bg-brand/30" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/30 bg-card shadow-xl shadow-brand/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" className="h-10 w-10 rounded-lg" />
        </span>
      </div>

      {SATELLITES.map(({ icon: Icon, label, x, y }) => (
        <div
          key={label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/80 text-primary shadow-sm backdrop-blur">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

// Left half on large screens: the brand, the hub, a headline and three points
function StoryPanel() {
  return (
    <aside className="relative z-10 hidden flex-col overflow-hidden border-r border-border/50 p-10 lg:flex xl:p-12">
      <AdminBrand />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-8">
        <div className="relative h-[34vh] max-h-[340px] min-h-[220px] short:h-[26vh] short:min-h-[180px]">
          <ControlHub />
        </div>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Admin Access Only
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
          Run the whole platform from one place.
        </h2>
        <ul className="mt-6 space-y-4 short:mt-4 short:space-y-3">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">{title}</span>
                <span className="block text-xs text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-muted-foreground">Naukari360 · Admin Panel</p>
    </aside>
  );
}

const cornerButton =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card/70 p-0 text-muted-foreground backdrop-blur hover:bg-accent hover:text-foreground";

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

  return (
    <div className="relative grid min-h-dvh lg:grid-cols-2">
      <div className="admin-backdrop" aria-hidden="true">
        <div className="grid-layer" />
      </div>

      <StoryPanel />

      <main className="relative z-10 flex min-h-dvh flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-center justify-between gap-3">
          {/* The story panel shows the brand on large screens */}
          <AdminBrand className="lg:invisible" />
          <div className="flex items-center gap-2">
            <HoverHint label="View site">
              <Link href="/" aria-label="View site" className={cornerButton}>
                <Globe className="h-[18px] w-[18px]" />
              </Link>
            </HoverHint>
            <ThemeToggle hint className={cornerButton} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">
            <div className="glow-border rounded-2xl bg-gradient-to-b from-card to-card/60 p-6 shadow-[0_24px_60px_-30px_rgb(15_23_42/0.35)] backdrop-blur-sm sm:p-8 dark:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.7)]">
              <div className="mb-6 text-center">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Admin Login
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Sign in to your Naukari360 admin dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert tone="danger">{error}</Alert>}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className={fieldClass}
                    placeholder="admin@naukari360.in"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
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
                      className={cn(fieldClass, "pr-11")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>
            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              This area is restricted to authorized admins only.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
