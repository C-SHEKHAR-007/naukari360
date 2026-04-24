"use client";

import { MessageCircle } from "lucide-react";

interface AskOnWhatsAppProps {
  jobTitle: string;
  phoneNumber?: string;
}

export default function AskOnWhatsApp({
  jobTitle,
  phoneNumber = "917042825899",
}: AskOnWhatsAppProps) {
  const message = encodeURIComponent(
    `Hi, I have a question about the job posting: "${jobTitle}" on Naukari360.in. Can you help?`
  );

  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
      aria-label="Ask on WhatsApp"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      Ask on WhatsApp
    </a>
  );
}
