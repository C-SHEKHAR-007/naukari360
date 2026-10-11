"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { Alert, Button, Label, fieldClass } from "@/components/ui";
import ThemeToggle from "@/components/public/ThemeToggle";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  {
    icon: Briefcase,
    title: "Publish in minutes",
    text: "Jobs, results, admit cards and syllabuses.",
  },
  { icon: BarChart3, title: "See what works", text: "Views, trends and engagement at a glance." },
  { icon: Megaphone, title: "Grow and monetise", text: "Ads, banners, alerts and newsletters." },
];

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink text-ink-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Drifting brand glows + texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand/35 blur-3xl" />
        <div className="animate-float-slow absolute -bottom-32 -right-16 h-[30rem] w-[30rem] rounded-full bg-info/30 blur-3xl" />
        <div className="animate-float absolute bottom-1/3 left-1/3 h-64 w-64 rounded-full bg-highlight/25 blur-3xl" />
        <div className="bg-dots absolute inset-0 text-ink-foreground opacity-40 [mask-image:linear-gradient(180deg,black,transparent_80%)]" />
      </div>

      <div className="relative flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.svg" alt="" className="h-10 w-10" />
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-brand">Naukari</span>
          <span>360</span>
        </span>
      </div>

      <div className="relative max-w-md">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-ink-foreground/10 px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-ink-foreground/15">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin Control Panel
        </p>
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Everything behind India&apos;s
          <span className="block bg-gradient-to-r from-brand to-ink-foreground bg-clip-text text-transparent">
            job updates.
          </span>
        </h2>
        <ul className="mt-10 space-y-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-foreground/10 ring-1 ring-ink-foreground/15">
                <Icon className="h-5 w-5 text-brand" />
              </span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="block text-sm text-ink-foreground/70">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-ink-foreground/60">
        © {new Date().getFullYear()} Naukari360 · Authorized personnel only
      </p>
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

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_1fr]">
      <BrandPanel />

      <main className="relative flex flex-col px-6 py-6 sm:px-10">
        {/* Mobile brand strip (the panel is hidden below lg) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/12 to-transparent lg:hidden"
        />

        <div className="relative flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <ThemeToggle />
        </div>

        <div className="relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <div className="mb-8 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="" className="mb-4 h-12 w-12" />
            <p className="text-2xl font-extrabold tracking-tight">
              <span className="text-primary">Naukari</span>
              <span className="text-secondary">360</span>
            </p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your admin account to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <Alert tone="danger">{error}</Alert>}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className={cn(fieldClass, "h-11 pl-10")}
                  placeholder="you@naukari360.in"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  className={cn(fieldClass, "h-11 pl-10 pr-11")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

            <Button type="submit" size="lg" disabled={loading} className="group w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Authorized personnel only
          </p>
        </div>
      </main>
    </div>
  );
}
