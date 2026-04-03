import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
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
  openGraph: {
    siteName: "Naukari360",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('lang');if(l==='hi'||l==='en')document.documentElement.setAttribute('data-lang',l);else document.documentElement.setAttribute('data-lang','en')}catch(e){document.documentElement.setAttribute('data-lang','en')}`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
