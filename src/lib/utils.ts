import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(date: Date | string, locale: "en" | "hi" = "en"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function daysUntil(date: Date | string): number {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isClosingSoon(lastDate: Date | string | null): boolean {
  if (!lastDate) return false;
  const days = daysUntil(lastDate);
  return days >= 0 && days <= 3;
}

export function getBadgeFromDates(
  lastDate: Date | string | null,
  createdAt: Date | string
): "NEW" | "EXPIRED" | null {
  if (lastDate) {
    const days = daysUntil(lastDate);
    if (days < 0) return "EXPIRED";
  }
  const created = new Date(createdAt);
  const now = new Date();
  const daysSinceCreation = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceCreation <= 3) return "NEW";
  return null;
}
