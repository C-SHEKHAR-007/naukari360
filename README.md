# Naukari360 — Developer Setup & Architecture Guide

Welcome to the **Naukari360** repository! This is a modern, high-performance web application built for government job seekers in India. It is highly optimized for SEO, mobile usage (PWA), and aggressive monetization.

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **Database**: PostgreSQL 17 (Neon.tech recommended for production)
- **ORM**: Prisma 6
- **Authentication**: NextAuth.js v5 (Credentials provider)
- **Containerization**: Docker & Docker Compose

### System Design
Naukari360 uses a **Server-Side Rendered (SSR) / Incremental Static Regeneration (ISR)** architecture to ensure maximum performance and SEO visibility:
1.  **Public Routes** (`src/app/(public)`): Heavily cached using Next.js caching mechanisms. Fast load times for job posts, categories, and exam dates.
2.  **Admin Routes** (`src/app/(admin)`): Protected by NextAuth middleware. Server components interact directly with Prisma for CRUD operations.
3.  **API Routes** (`src/app/api`): Minimal REST endpoints strictly for client-side interactions (e.g., View tracking, Contact forms, Newsletter subscriptions).

---

## ⚙️ Environment Variables

Copy the `.env.example` file to `.env` and fill in the required variables.

| Variable | Description | Where to get it |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Neon.tech or Local Docker |
| `NEXTAUTH_SECRET` | Used to encrypt JWT cookies | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of the app | `http://localhost:3000` |
| `ADMIN_EMAIL` | Super admin login email | Your choice |
| `ADMIN_PASSWORD` | Super admin login password | Your choice |
| `NEXT_PUBLIC_ONESIGNAL_APP_ID`| Push notification App ID | OneSignal Dashboard |
| `RESEND_API_KEY` | For sending transactional emails | Resend Dashboard |

---

## 🚀 Developer Setup Guide (Local Development)

### Prerequisites
- Node.js (v20+ recommended)
- `pnpm` (Package manager)
- Docker Desktop (for local database)

### Step-by-Step Installation

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd sarkari-duniya
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```

3.  **Start Local Database (PostgreSQL)**
    ```bash
    # Starts PostgreSQL on port 5434
    docker compose up -d db
    ```

4.  **Configure Environment Variables**
    ```bash
    cp .env.example .env
    # Update DATABASE_URL in .env to: postgresql://postgres:postgres@localhost:5434/naukari360?schema=public
    ```

5.  **Run Database Migrations & Seed Data**
    ```bash
    pnpm prisma db push
    pnpm prisma db seed
    ```

6.  **Start the Development Server**
    ```bash
    pnpm dev
    ```
    Your app should now be running on [http://localhost:3000](http://localhost:3000). You can log into the admin panel at `/admin` using the credentials specified in your `.env` file.

---

## 📁 Folder Structure

\`\`\`text
src/
├── app/
│   ├── (admin)/        # Protected admin dashboard pages & layouts
│   ├── (public)/       # Public-facing pages (Home, Jobs, Search)
│   ├── api/            # REST API Routes (contact, track-view, auth)
│   └── layout.tsx      # Global Root Layout
├── components/
│   ├── admin/          # Admin UI components (Forms, Tables, Charts)
│   ├── providers/      # React Context Providers (Theme, Auth, Language)
│   ├── public/         # Public UI components (Cards, Headers, Ads)
│   └── ui/             # Reusable Shadcn UI components
├── lib/
│   ├── db.ts           # Prisma client instantiation and helper queries
│   ├── seo.ts          # JSON-LD Schema generation for Google Rich Results
│   └── utils.ts        # Helper functions (date formatting, class merging)
└── styles/             # Global CSS and Tailwind directives
\`\`\`

---

## 🚀 Deployment

The recommended deployment platform is **Vercel**.
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add all Environment Variables from your `.env` to the Vercel dashboard.
4. Deploy!

For detailed deployment strategies (including CI/CD via GitHub Actions), see the `docs/DEPLOYMENT.md` file.
