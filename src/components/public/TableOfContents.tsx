"use client";

import { useState, useEffect, useMemo } from "react";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ contentHtml }: { contentHtml: string }) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    if (typeof window === "undefined") return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentHtml, "text/html");
    const elements = doc.querySelectorAll("h2, h3");
    const items: TOCItem[] = [];

    elements.forEach((el, index) => {
      const id = el.id || `heading-${index}`;
      items.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    return items;
  }, [contentHtml]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="rounded-lg border border-border bg-card p-4" aria-label="Table of contents">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        <List className="h-4 w-4" />
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${heading.id}`}
              className={`block text-sm py-0.5 transition-colors ${
                activeId === heading.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
