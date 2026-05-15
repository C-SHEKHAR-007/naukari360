"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import LanguageToggle from "./LanguageToggle";
import type { SiteSettings } from "@/lib/settings";

const navLinks = [
  { href: "/latest-jobs", label: "Latest Jobs", labelHi: "नवीनतम नौकरी" },
  { href: "/results", label: "Results", labelHi: "रिजल्ट" },
  { href: "/admit-card", label: "Admit Card", labelHi: "एडमिट कार्ड" },
  { href: "/answer-key", label: "Answer Key", labelHi: "आंसर की" },
  { href: "/admission", label: "Admission", labelHi: "एडमिशन" },
  { href: "/syllabus", label: "Syllabus", labelHi: "सिलेबस" },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, mounted } = useTheme();

  const siteName = settings.site_name || "Naukari360";
  const announcementActive = settings.announcement_active === "true";
  const announcementText = settings.announcement_text || "";

  return (
    <header className="glass-header sticky top-0 z-50 shadow-sm">
      {/* Announcement Bar */}
      {announcementActive && announcementText && (
        <div className="bg-primary text-white text-center text-xs sm:text-sm py-1.5 px-4 font-medium">
          {announcementText}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="flex items-baseline">
              <span className="text-2xl font-extrabold tracking-tight text-primary group-hover:text-primary-dark">
                {siteName.replace(/360$/i, "") || "Naukari"}
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-secondary dark:text-blue-400">
                {siteName.match(/360$/i) ? "360" : ""}
              </span>
            </div>
            <span className="ml-1.5 hidden rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary sm:inline-block">
              Beta
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="rounded-lg p-2.5 text-muted transition-all hover:bg-surface hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>

            <LanguageToggle />

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2.5 text-muted transition-all hover:bg-surface hover:text-primary"
              aria-label="Toggle dark mode"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )
              ) : (
                <span className="inline-block h-[18px] w-[18px]" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2.5 text-muted lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="border-t border-border/50 pb-4 pt-2 lg:hidden">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-all hover:bg-primary/8 hover:text-primary"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
