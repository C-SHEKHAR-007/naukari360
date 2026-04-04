"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

interface BilingualTextProps {
  en: string;
  hi?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function BilingualText({ en, hi, className, as: Tag = "span" }: BilingualTextProps) {
  const { t } = useLanguage();
  return <Tag className={className}>{t(en, hi)}</Tag>;
}
