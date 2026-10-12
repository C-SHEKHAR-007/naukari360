"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  Shield,
  ShieldCheck,
  SquarePen,
} from "lucide-react";
import { Alert, HoverHint } from "@/components/ui";
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

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center", compact ? "gap-3" : "gap-[18px]")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/admin-login-logo.png"
        alt=""
        className={cn("rounded-xl", compact ? "h-11 w-11" : "h-[62px] w-[62px]")}
      />
      <span
        className={cn(
          "font-bold tracking-tight text-ink-foreground",
          compact ? "text-[22px]" : "text-[30px]"
        )}
      >
        Naukari<span className="text-brand">360</span>
      </span>
    </div>
  );
}

// Below lg the artwork panel becomes a hero banner that the login card overlaps
function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-ink bg-[url('/images/admin-login-panel.jpg')] bg-cover bg-[position:78%_center] shrink-0 px-5 pb-14 pt-5 text-ink-foreground sm:px-10 sm:pb-16 sm:pt-6 lg:hidden">
      {/* Keep text readable over the photo while the desk/city stays visible on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 to-transparent"
      />
      <div className="relative mx-auto flex max-w-[546px] items-center justify-between gap-3">
        <Logo compact />
        <p className="hidden h-7 shrink-0 items-center gap-1.5 rounded-full bg-royal/45 px-3 text-xs font-semibold md:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5 fill-ink-foreground text-royal" /> Admin Access Only
        </p>
      </div>
    </section>
  );
}

// Icon-only buttons; text appears on hover/focus. Light on the dark mobile banner,
// card-coloured on the light desktop side.
const cornerButton =
  "flex h-10 w-10 items-center justify-center rounded-full p-0 ring-1 backdrop-blur-sm transition-colors bg-ink-foreground/10 text-ink-foreground ring-ink-foreground/20 hover:bg-ink-foreground/20 hover:text-ink-foreground lg:bg-card lg:text-muted-foreground lg:shadow-sm lg:ring-border lg:hover:bg-accent lg:hover:text-foreground";

function CornerActions() {
  return (
    <div className="absolute right-4 top-[22px] z-20 flex items-center gap-2 sm:right-6 lg:top-6">
      <HoverHint label="View site">
        <Link href="/" aria-label="View site" className={cornerButton}>
          <Globe className="h-[18px] w-[18px]" />
        </Link>
      </HoverHint>
      <ThemeToggle hint className={cornerButton} />
    </div>
  );
}

// Left half: night-office artwork (public/images/admin-login-panel.jpg) with copy on top
function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink bg-[url('/images/admin-login-panel.jpg')] bg-cover bg-center text-ink-foreground lg:flex lg:flex-col lg:justify-between lg:px-[82px] lg:pb-[66px] lg:pt-[80px] lg:short:pb-10 lg:short:pt-12">
      <div className="relative">
        <Logo />

        <div className="mt-[58px] max-w-[470px] short:mt-8">
          <p className="inline-flex h-[34px] items-center gap-2 rounded-full bg-royal/45 px-3.5 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 fill-ink-foreground text-royal" /> Admin Access Only
          </p>
          <h2 className="mt-4 text-[42px] font-bold leading-[49px] tracking-[-0.01em]">
            Manage. Publish.
            <br />
            Build a <span className="text-brand">Better Platform.</span>
          </h2>
          <p className="mt-4 max-w-[412px] text-base leading-7 short:hidden text-ink-foreground/85">
            This is the admin panel for Naukari360. Here you can manage posts, ads, notifications
            and everything that keeps the platform running smoothly.
          </p>

          <ul className="mt-10 space-y-[25px] short:mt-6 short:space-y-4">
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
  "h-[55px] w-full rounded-[10px] border border-border/80 bg-card/60 pl-14 pr-4 text-base lg:text-[15px] text-foreground shadow-[inset_0_1px_2px_rgb(15_23_42/0.04)] backdrop-blur-sm placeholder:text-muted-foreground/70 focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal/10";

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
    <div className="grid min-h-dvh bg-background lg:min-h-screen lg:grid-cols-[846fr_740fr]">
      <BrandPanel />

      <main className="relative flex flex-col overflow-hidden lg:items-center lg:justify-center lg:py-10 lg:short:py-4 lg:pl-10 lg:pr-[84px]">
        <MobileHero />
        <CornerActions />

        {/* Soft decorative circles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute -right-[160px] -top-[200px] h-[370px] w-[370px] rounded-full bg-royal/[0.05]" />
          <div className="absolute -bottom-[115px] -right-[115px] h-[240px] w-[240px] rounded-full bg-royal/[0.05]" />
        </div>

        <div className="relative z-10 mx-auto -mt-10 w-full max-w-[546px] px-4 pb-6 sm:-mt-12 sm:px-6 lg:mt-0 lg:px-0 lg:pb-0">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-16 top-4 h-72 w-72 rounded-full bg-royal/35 blur-3xl dark:bg-royal/35" />
            <div className="absolute -bottom-6 -right-14 h-72 w-72 rounded-full bg-brand/30 blur-3xl dark:bg-brand/25" />
            <div className="absolute -right-10 top-16 h-48 w-48 rounded-full bg-highlight/25 blur-3xl" />
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-card/45 px-5 pb-9 pt-8 shadow-[0_30px_70px_-30px_rgb(30_50_140/0.45),inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-2xl backdrop-saturate-150 sm:px-8 lg:pb-[44px] lg:pt-[38px] lg:short:pb-7 lg:short:pt-7 dark:border-white/10 dark:bg-card/55 dark:shadow-[0_30px_70px_-30px_rgb(0_0_0/0.7),inset_0_1px_0_rgb(255_255_255/0.08)]">
            {/* Gloss: diagonal sheen and a bright top edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/15 to-transparent dark:from-white/10 dark:via-white/[0.02]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/40"
            />
            <div className="relative">
              <div className="text-center">
                <span className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-b from-white to-royal/10 shadow-[0_8px_20px_-8px_rgb(43_70_240/0.45),inset_0_1px_0_rgb(255_255_255)] ring-1 ring-royal/10 lg:short:hidden dark:from-white/10 dark:to-royal/20">
                  <span className="relative flex h-9 w-8 items-center justify-center">
                    <Shield
                      className="absolute inset-0 h-9 w-8 fill-royal text-royal"
                      strokeWidth={1.5}
                    />
                    <Lock className="relative mt-0.5 h-3.5 w-3.5 text-white" strokeWidth={2.75} />
                  </span>
                </span>
                <h1 className="mt-[22px] text-[32px] font-bold leading-tight tracking-tight text-foreground lg:short:mt-0">
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
                  <Mail className="pointer-events-none absolute z-10 left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                  <Lock className="pointer-events-none absolute z-10 left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                  className="group relative mt-[26px] flex h-[57px] w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-gradient-to-b from-royal to-royal-hover text-base font-semibold text-white shadow-[0_12px_28px_-10px_rgb(43_70_240/0.7),inset_0_1px_0_rgb(255_255_255/0.3)] transition-all hover:brightness-110 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]"
                  />
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

              <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground lg:short:mt-6">
                <span className="h-px flex-1 bg-border" />
                Authorized Personnel Only
                <span className="h-px flex-1 bg-border" />
              </div>
              <p className="mt-8 flex items-center justify-center gap-2.5 text-center text-xs text-muted-foreground lg:mt-[42px] lg:short:mt-5">
                <ShieldCheck className="h-5 w-5 shrink-0" /> This area is restricted to authorized
                admins only.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
