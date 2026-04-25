"use client";

import { useEffect } from "react";
import Script from "next/script";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";

export default function OneSignalInit() {
  useEffect(() => {
    if (!ONESIGNAL_APP_ID) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: unknown) {
      const os = OneSignal as { init: (config: Record<string, unknown>) => Promise<void> };
      await os.init({
        appId: ONESIGNAL_APP_ID,
        notifyButton: { enable: true },
        allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
      });
    });
  }, []);

  if (!ONESIGNAL_APP_ID) return null;

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      defer
      strategy="lazyOnload"
    />
  );
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: unknown) => void | Promise<void>>;
  }
}
