import { CheckCircle2, Circle, ExternalLink, AlertTriangle } from "lucide-react";

const propellerSteps = [
  {
    title: "Create PropellerAds Account",
    description: "Sign up at propellerads.com — no minimum traffic requirement, instant approval.",
    link: "https://propellerads.com",
  },
  {
    title: "Add Your Website",
    description: 'Go to Sites → Add New Site → Enter naukari360.in → Select "Direct Link" option.',
  },
  {
    title: "Get Push Notification Code",
    description:
      "Navigate to Push Notifications section → Copy the SW integration code → Paste in site settings.",
  },
  {
    title: "Enable Native Ads",
    description:
      'Go to Ad Zones → Create Zone → Choose "Native Banner" → Copy code → Add to ad slots in admin.',
  },
  {
    title: "Enable Interstitial / Popunder",
    description:
      "Create an interstitial ad zone → Copy code → Add as an ad slot with popup_delay setting.",
  },
  {
    title: "Set Up Anti-AdBlock",
    description: "Enable PropellerAds Anti-AdBlock in dashboard to recover blocked impressions.",
  },
  {
    title: "Monitor Performance",
    description:
      "Check PropellerAds dashboard daily. Note best-performing zones in Admin → Ad Slots → notes field.",
  },
];

const adsenseChecklist = [
  { text: "Site has 30+ unique, quality content pages", critical: true },
  { text: "Site is at least 3 months old (domain age)", critical: false },
  { text: "Privacy Policy page exists and is linked in footer", critical: true },
  { text: "Disclaimer page exists", critical: true },
  { text: "About page with real contact info", critical: true },
  { text: "Contact page with working form", critical: true },
  { text: "No copyright violations — all content is original", critical: true },
  { text: "Clean navigation — easy to find content", critical: false },
  { text: "Mobile responsive design", critical: true },
  { text: "Fast page load (< 3 seconds)", critical: false },
  { text: "Custom domain (not free subdomain)", critical: true },
  { text: "SSL certificate (HTTPS)", critical: true },
  { text: "No excessive ads from other networks during application", critical: false },
  { text: "Google Search Console verified and sitemap submitted", critical: true },
  { text: "No adult, violent, or prohibited content", critical: true },
  { text: "Site gets organic traffic (even small amounts)", critical: false },
];

export default function MonetizationPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Monetization Guide</h1>
        <p className="mt-1 text-sm text-muted">
          Step-by-step guides for PropellerAds and Google AdSense
        </p>
      </div>

      {/* PropellerAds Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-1 text-lg font-bold text-foreground">
          PropellerAds Integration (Day 1 Revenue)
        </h2>
        <p className="mb-4 text-sm text-muted">
          No approval needed. Start earning immediately with push notifications + native ads.
        </p>
        <ol className="space-y-4">
          {propellerSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-foreground">{step.title}</p>
                <p className="mt-0.5 text-sm text-muted">{step.description}</p>
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Visit Site
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* AdSense Section */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-1 text-lg font-bold text-foreground">
          Google AdSense Readiness Checklist
        </h2>
        <p className="mb-4 text-sm text-muted">
          Complete all critical items before applying. AdSense typically takes 2-14 days to review.
        </p>
        <div className="space-y-3">
          {adsenseChecklist.map((item, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-surface"
            >
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <span className="text-sm text-foreground">
                {item.text}
                {item.critical && (
                  <span className="ml-2 inline-flex items-center gap-0.5 text-xs text-red-500">
                    <AlertTriangle className="h-3 w-3" /> Required
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-medium">After AdSense Approval:</p>
              <ul className="mt-1 list-disc pl-4 text-xs">
                <li>Add Publisher ID to Site Settings → SEO → AdSense Publisher ID</li>
                <li>Create ad units in AdSense dashboard</li>
                <li>Paste ad code into Admin → Ad Slots for each placement</li>
                <li>Start with 3-4 slots: header, in-content, sidebar, footer</li>
                <li>Monitor RPM and adjust placements based on performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
