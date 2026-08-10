"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User, Bookmark, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UserNav() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>;
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("google")}
        title="Sign In / Register"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white"
      >
        <User className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-muted transition-all hover:border-primary focus:outline-none shadow-sm"
      >
        {session.user.image ? (
          <Image 
            src={session.user.image} 
            alt={session.user.name || "User"} 
            width={32}
            height={32}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            unoptimized
          />
        ) : (
          <User className="h-4 w-4 text-primary" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-card shadow-xl focus:outline-none">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">{session.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              My Profile / Feed
            </Link>
            <Link
              href="/bookmarks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
            >
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              Saved Jobs
            </Link>
            <Link
              href="/tracker"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              Application Tracker
            </Link>
          </div>
          <div className="border-t border-border py-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
