# Naukari360 — Admin User Guide

Welcome to the Admin Dashboard! This guide will help you manage the Naukari360 platform, add new jobs, configure advertisements, and track your revenue.

## 1. Accessing the Admin Panel
Go to `https://your-domain.com/admin` and log in using the credentials defined in your environment variables (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).

## 2. Creating a New Job Post
The Post Editor is designed to be highly structured to maximize SEO via Google Rich Snippets.

1.  Navigate to **Posts** → **Create New**.
2.  **Basic Details**: Fill in English and Hindi titles. The system supports bilingual data!
3.  **Quick Info**: Fill in Salary, Age Limit, and Total Vacancies. These fields power the comparison features.
4.  **Dates**: Set the "Last Date" accurately. This automatically drives the **Countdown Timer** on the homepage and lists the job in the **Closing Soon** section.
5.  **Important Dates & FAQs**: Add tabular dates and FAQs. These automatically generate JSON-LD structured data for Google.
6.  **Important Links**: Always provide an `applyLink`. Users who click this will be routed through the Interstitial Ad Page to maximize your revenue.
7.  Click **Publish**.

## 3. Managing Advertisements (Ad Slots)
The site has multiple predefined zones for ads. You do not need to touch the code to update ads!

1.  Go to **Monetization** → **Ad Slots**.
2.  You will see slots like `header_banner`, `sidebar_top`, `in_article_1`, etc.
3.  Edit a slot and paste the raw HTML/JS code provided by Google AdSense or PropellerAds.
4.  Toggle **Active** to turn the ad on immediately.

## 4. Understanding Interstitial Ads
When a user clicks "Apply Now" or "Download Result", they aren't taken immediately to the external site. 
Instead, they are taken to a `/go/[slug]` page that forces a 5-second countdown while displaying a premium ad. This is a massive revenue driver. 
You can configure the countdown length in **Monetization** → **Interstitial Settings**.

## 5. Analytics & Tracking
*   **Daily Views**: Check the dashboard graph to see your daily traffic trends.
*   **Top Posts**: Identify which jobs are currently going viral and write more content related to them.
*   **Affiliate Clicks**: Monitor which coaching links or book links are getting the most clicks to optimize your passive income.

## 6. Site Settings & Announcements
*   Go to **Settings** → **Site Settings** to update the logo, site title, and social media links.
*   Use the **Announcements** tab to add scrolling text to the top of the homepage (great for breaking news like "SSC CGL Result Declared!").
