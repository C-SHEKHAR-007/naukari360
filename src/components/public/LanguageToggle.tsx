"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted transition-all hover:border-primary/40 hover:text-primary"
      aria-label="Toggle language"
    >
      {lang === "en" ? "हिं" : "EN"}
    </button>
  );
}
