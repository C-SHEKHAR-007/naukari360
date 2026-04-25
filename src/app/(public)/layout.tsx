import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import NewsletterPopup from "@/components/public/NewsletterPopup";
import ScrollToTop from "@/components/public/ScrollToTop";
import OneSignalInit from "@/components/public/OneSignalInit";
import FloatingTelegramCTA from "@/components/public/FloatingTelegramCTA";
import ExitIntentPopup from "@/components/public/ExitIntentPopup";
import { getSiteSettings } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <NewsletterPopup />
      <ScrollToTop />
      <OneSignalInit />
      <FloatingTelegramCTA telegramUrl={settings?.telegramUrl} />
      <ExitIntentPopup />
    </>
  );
}
