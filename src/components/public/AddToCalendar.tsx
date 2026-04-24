"use client";

import { CalendarPlus } from "lucide-react";

interface AddToCalendarProps {
  title: string;
  date: Date;
  description?: string;
  url?: string;
}

export default function AddToCalendar({ title, date, description, url }: AddToCalendarProps) {
  function getGoogleCalendarUrl() {
    const startDate = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    // Set end time to 1 hour after start
    const end = new Date(date.getTime() + 60 * 60 * 1000);
    const endDate = end.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${startDate}/${endDate}`,
      details: description || `Reminder: ${title}`,
      location: url || "https://naukari360.in",
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  }

  return (
    <a
      href={getGoogleCalendarUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      aria-label={`Add ${title} to Google Calendar`}
    >
      <CalendarPlus className="h-3.5 w-3.5" />
      Add to Calendar
    </a>
  );
}
