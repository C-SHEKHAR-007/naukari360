"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

interface PostTitleProps {
  titleEn: string;
  titleHi?: string | null;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export default function PostTitle({ titleEn, titleHi, as: Tag = "h1", className }: PostTitleProps) {
  const { t } = useLanguage();
  return <Tag className={className}>{t(titleEn, titleHi)}</Tag>;
}
