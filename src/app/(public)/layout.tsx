import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import NewsletterPopup from "@/components/public/NewsletterPopup";
import ScrollToTop from "@/components/public/ScrollToTop";
import OneSignalInit from "@/components/public/OneSignalInit";
import FloatingTelegramCTA from "@/components/public/FloatingTelegramCTA";
import ExitIntentPopup from "@/components/public/ExitIntentPopup";
import GoogleAnalytics from "@/components/public/GoogleAnalytics";
import OfflineIndicator from "@/components/public/OfflineIndicator";
import QuickCompare from "@/components/public/QuickCompare";
import MobileBottomNav from "@/components/public/MobileBottomNav";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="pb-16 lg:pb-0 flex min-h-screen flex-col">
      {settings?.google_analytics_id && <GoogleAnalytics gaId={settings.google_analytics_id} />}
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <NewsletterPopup />
      <ScrollToTop />
      <OneSignalInit />
      <FloatingTelegramCTA telegramUrl={settings?.telegram_url} />
      <ExitIntentPopup />
      <QuickCompare />
      <OfflineIndicator />
      <MobileBottomNav />
    </div>
  );
}
