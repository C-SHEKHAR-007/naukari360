"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, FileText, Bookmark, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

const navItems = [
  { href: "/", icon: Home, labelEn: "Home", labelHi: "होम" },
  { href: "/latest-jobs", icon: Briefcase, labelEn: "Jobs", labelHi: "नौकरी" },
  { href: "/search", icon: Search, labelEn: "Search", labelHi: "खोजें" },
  { href: "/results", icon: FileText, labelEn: "Results", labelHi: "रिजल्ट" },
  { href: "/bookmarks", icon: Bookmark, labelEn: "Saved", labelHi: "सेव" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block lg:hidden pb-safe bg-background/80 backdrop-blur-md border-t border-border/40 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-[10px] font-medium tracking-wide">
                {t(item.labelEn, item.labelHi)}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
