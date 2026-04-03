import Link from "next/link";
import { Send, Heart } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

const footerLinks = {
  categories: [
    { href: "/latest-jobs", label: "Latest Jobs" },
    { href: "/results", label: "Results" },
    { href: "/admit-card", label: "Admit Card" },
    { href: "/answer-key", label: "Answer Key" },
    { href: "/admission", label: "Admission" },
    { href: "/syllabus", label: "Syllabus" },
  ],
  qualification: [
    { href: "/10th-pass", label: "10th Pass Jobs" },
    { href: "/12th-pass", label: "12th Pass Jobs" },
    { href: "/graduate", label: "Graduate Jobs" },
    { href: "/post-graduate", label: "Post Graduate Jobs" },
  ],
  pages: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export default function Footer({ settings }: { settings: SiteSettings }) {
  const siteName = settings.site_name || "Naukari360";
  const tagline = settings.tagline || "सरकारी नौकरी अपडेट 360° — Your 360° Government Jobs Portal";
  const telegramUrl = settings.telegram_url || "";
  const footerText =
    settings.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-baseline">
              <span className="text-xl font-extrabold tracking-tight text-primary">
                {siteName.replace(/360$/i, "") || "Naukari"}
              </span>
              <span className="text-xl font-extrabold tracking-tight text-secondary dark:text-blue-400">
                {siteName.match(/360$/i) ? "360" : ""}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">{tagline}</p>
            <p className="mt-2 text-sm text-muted">
              Stay updated with latest government jobs, results, admit cards, and exam
              notifications.
            </p>
            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0088cc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#006fa8] hover:shadow-md active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                Join Telegram Channel
              </a>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/70">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Qualification */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/70">
              By Qualification
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.qualification.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/70">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">{footerText}</p>
          <p className="flex items-center gap-1 text-xs text-muted">
            Made with <Heart className="h-3 w-3 text-red-500" /> for Job Seekers
          </p>
        </div>
      </div>
    </footer>
  );
}
