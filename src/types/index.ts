import type {
  AdminRole,
  PostStatus,
  PostBadge,
  QualificationLevel,
  ContactType,
} from "@prisma/client";

export type { AdminRole, PostStatus, PostBadge, QualificationLevel, ContactType };

export type Language = "en" | "hi";

export interface NavMenuItem {
  id: string;
  label: string;
  labelHi?: string | null;
  url: string;
  children?: NavMenuItem[];
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  footer_text: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  google_analytics_id: string;
  adsense_publisher_id: string;
  facebook_url: string;
  telegram_url: string;
  whatsapp_url: string;
  twitter_url: string;
  youtube_url: string;
  instagram_url: string;
  announcement_text: string;
  announcement_active: string;
  robots_txt: string;
}
