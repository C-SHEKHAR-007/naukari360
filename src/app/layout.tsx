import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ServiceWorkerRegistrar } from "@/components/providers/ServiceWorkerRegistrar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-hindi",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Naukari360 — सरकारी नौकरी अपडेट 360° | Government Jobs Portal",
    template: "%s | Naukari360",
  },
  description:
    "Latest government jobs, exam results, admit cards, answer keys, and more. सरकारी नौकरी की पूरी जानकारी।",
  metadataBase: new URL("https://naukari360.in"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icons/icon-192x192.svg",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/",
    },
  },
  openGraph: {
    siteName: "Naukari360",
    locale: "en_IN",
    type: "website",
    title: "Naukari360 — सरकारी नौकरी अपडेट 360°",
    description:
      "Latest government jobs, exam results, admit cards, answer keys. सरकारी नौकरी की पूरी जानकारी।",
    url: "https://naukari360.in",
    images: [
      {
        url: "/banner-social-og.svg",
        width: 1200,
        height: 630,
        alt: "Naukari360 — Government Jobs Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naukari360 — सरकारी नौकरी अपडेट 360°",
    description: "Latest government jobs, exam results, admit cards, answer keys.",
    images: ["/banner-social-og.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  other: {
    "theme-color": "#FF6B00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansDevanagari.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
