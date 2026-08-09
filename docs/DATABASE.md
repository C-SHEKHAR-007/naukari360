# Naukari360 Database Schema & Documentation

This document explains the database architecture of Naukari360, which relies on a relational PostgreSQL database managed by Prisma ORM.

## Entity Relationship Overview

The core of the system revolves around the **Post** model, which represents a job notification, exam result, admit card, or syllabus. Posts are categorized, tagged, and optionally linked to a specific state.

### Core Tables

#### 1. `Post`
The primary table for all content.
*   **`id`** (UUID): Primary key.
*   **`titleEn` / `titleHi`** (String): Bilingual titles.
*   **`contentEn` / `contentHi`** (String): Rich HTML content.
*   **`categoryId`** (UUID): Foreign key mapping to `Category`.
*   **`stateId`** (UUID, Optional): Foreign key mapping to `State`.
*   **`status`** (Enum): `DRAFT`, `PUBLISHED`, `ARCHIVED`.
*   **`lastDate`, `examDate`, `resultDate`** (DateTime): Crucial for sorting, countdowns, and exam calendars.
*   **`applyLink`, `notificationLink`, `officialLink`** (String): Actionable URLs.
*   **`views`** (Int): Counter for popularity and analytics.

#### 2. `Category`
Categories organize posts (e.g., "Latest Jobs", "Results", "Admit Cards").
*   **`slug`** (String): Used in URLs (e.g., `/latest-jobs`).
*   **`icon`** (String): Lucide icon name for UI rendering.
*   **`displayOrder`** (Int): Controls the ordering of sections on the homepage.

#### 3. `State`
Used to filter jobs by region.
*   **`name`** (String): E.g., "Uttar Pradesh".
*   **`slug`** (String): URL friendly name.

#### 4. `ImportantDate` & `Faq` (One-to-Many with Post)
*   **`ImportantDate`**: Key-value pairs for structured date tables (e.g., "Application Begin: 12/10/2026").
*   **`Faq`**: Frequently asked questions associated with a post. Very important for SEO schema generation (`FAQPage`).

---

## Analytics & Tracking Tables

#### 1. `PageView`
*   Used for generating the daily traffic charts in the admin dashboard.
*   **`date`** (DateTime): Aggregated view date.
*   **`views`** (Int): Total views on that date.

#### 2. `EmailSubscriber`
*   Stores leads collected via Newsletter popups.
*   **`email`** (String): Unique subscriber email.
*   **`isActive`** (Boolean): Indicates if they have unsubscribed.

#### 3. `AffiliateLink`
*   Tracks outbound clicks to affiliate programs (e.g., Testbook, Amazon).
*   **`originalUrl`** (String): The actual affiliate destination.
*   **`clicks`** (Int): Tracks how many times users clicked the link.

---

## Site Configuration Tables

#### 1. `SiteSettings`
*   A key-value store for global configurations that admins can change without touching code.
*   **Keys include**: `site_name`, `logo_url`, `google_analytics_id`, `announcement_text`.

#### 2. `AdSlot`
*   Manages dynamic ad placements.
*   **`slotKey`** (String): A unique identifier (e.g., `header_banner`, `in_article_1`).
*   **`adCode`** (String): Raw HTML/JS provided by Google AdSense or PropellerAds.
*   **`isActive`** (Boolean): Allows admins to toggle ads on/off instantly.
