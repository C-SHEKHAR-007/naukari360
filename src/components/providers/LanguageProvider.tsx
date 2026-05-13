"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, hi?: string | null) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
});

function getInitialLang(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "hi" || stored === "en") return stored;
  } catch {
    // localStorage unavailable
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  function setLang(newLang: Language) {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.setAttribute("data-lang", newLang);
  }

  function t(en: string, hi?: string | null): string {
    if (lang === "hi" && hi) return hi;
    return en;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
