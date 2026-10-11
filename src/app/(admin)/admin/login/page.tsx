"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  Shield,
  ShieldCheck,
  SquarePen,
} from "lucide-react";
import { Alert } from "@/components/ui";
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

function Logo() {
  return (
    <div className="flex items-center gap-[18px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/admin-login-logo.png" alt="" className="h-[62px] w-[62px] rounded-xl" />
      <span className="text-[30px] font-bold tracking-tight text-ink-foreground">
        Naukari<span className="text-brand">360</span>
      </span>
    </div>
  );
}

// Left half: night-office artwork (public/images/admin-login-panel.jpg) with copy on top
function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink bg-[url('/images/admin-login-panel.jpg')] bg-cover bg-center text-ink-foreground lg:flex lg:flex-col lg:justify-between lg:px-[82px] lg:pb-[66px] lg:pt-[80px]">
      <div className="relative">
        <Logo />

        <div className="mt-[58px] max-w-[470px]">
          <p className="inline-flex h-[34px] items-center gap-2 rounded-full bg-royal/45 px-3.5 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 fill-ink-foreground text-royal" /> Admin Access Only
          </p>
          <h2 className="mt-4 text-[42px] font-bold leading-[49px] tracking-[-0.01em]">
            Manage. Publish.
            <br />
            Build a <span className="text-brand">Better Platform.</span>
          </h2>
          <p className="mt-4 max-w-[412px] text-base leading-7 text-ink-foreground/85">
            This is the admin panel for Naukari360. Here you can manage posts, ads, notifications
            and everything that keeps the platform running smoothly.
          </p>

          <ul className="mt-10 space-y-[25px]">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-[17px]">
                <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-royal/20 ring-1 ring-ink-foreground/10 backdrop-blur-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-5">{title}</span>
                  <span className="block text-xs leading-5 text-ink-foreground/80">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative">
        <div className="mb-[22px] h-px w-[212px] bg-ink-foreground/15" />
        <p className="text-xs text-ink-foreground/75">Naukari360 &nbsp;•&nbsp; Admin Panel</p>
      </div>
    </aside>
  );
}

const inputClass =
  "h-[55px] w-full rounded-[10px] border border-border bg-surface/50 pl-14 pr-4 text-[15px] text-foreground shadow-none placeholder:text-muted-foreground/70 focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal/10";

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
    <div className="grid min-h-screen bg-background lg:grid-cols-[846fr_740fr]">
      <BrandPanel />

      <main className="relative flex items-center justify-center overflow-hidden px-5 py-10 sm:px-10 lg:pr-[84px]">
        {/* Soft decorative circles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[160px] -top-[200px] h-[370px] w-[370px] rounded-full bg-royal/[0.05]" />
          <div className="absolute -bottom-[115px] -right-[115px] h-[240px] w-[240px] rounded-full bg-royal/[0.05]" />
        </div>

        <div className="relative w-full max-w-[546px]">
          {/* Mobile brand (the artwork panel is hidden below lg) */}
          <div className="mb-6 flex justify-center rounded-2xl bg-ink px-6 py-5 lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl bg-card px-6 pb-[44px] pt-[38px] shadow-[0_18px_50px_-20px_rgb(30_50_120/0.18)] ring-1 ring-border/40 sm:px-8">
            <div className="text-center">
              <span className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-royal/[0.07]">
                <span className="relative flex h-9 w-8 items-center justify-center">
                  <Shield
                    className="absolute inset-0 h-9 w-8 fill-royal text-royal"
                    strokeWidth={1.5}
                  />
                  <Lock className="relative mt-0.5 h-3.5 w-3.5 text-white" strokeWidth={2.75} />
                </span>
              </span>
              <h1 className="mt-[22px] text-[32px] font-bold leading-tight tracking-tight text-foreground">
                Admin Login
              </h1>
              <p className="mx-auto mt-3 max-w-[300px] text-[15px] leading-[25px] text-muted-foreground">
                Sign in to access your admin dashboard to manage the platform.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7">
              {error && (
                <Alert tone="danger" className="mb-5">
                  {error}
                </Alert>
              )}

              <label htmlFor="email" className="mb-3 block text-sm font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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

              <label
                htmlFor="password"
                className="mb-3 mt-[26px] block text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {capsLock && (
                <p
                  id="caps-lock-warning"
                  className="mt-2 text-xs font-medium text-warning-emphasis"
                >
                  Caps Lock is on
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group mt-[26px] flex h-[57px] w-full items-center justify-center gap-2 rounded-[10px] bg-royal text-base font-semibold text-white shadow-[0_10px_24px_-10px] shadow-royal/60 transition-all hover:bg-royal-hover active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              Authorized Personnel Only
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="mt-[42px] flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-5 w-5" /> This area is restricted to authorized admins only.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
