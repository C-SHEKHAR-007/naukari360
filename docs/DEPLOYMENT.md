# Naukari360 — Deployment Guide

Three-stage deployment plan from zero traffic to millions of visitors.
Each stage is designed to upgrade seamlessly without code changes.

---

## Prerequisites (All Stages)

### Accounts to Create (Free)

1. **GitHub** — [github.com](https://github.com) (repo + CI/CD)
2. **Vercel** — [vercel.com](https://vercel.com) (hosting)
3. **Neon** — [neon.tech](https://neon.tech) (PostgreSQL database)
4. **Cloudinary** — [cloudinary.com](https://cloudinary.com) (image uploads)
5. **Resend** — [resend.com](https://resend.com) (transactional email)
6. **Google Analytics** — [analytics.google.com](https://analytics.google.com) (GA4)
7. **OneSignal** — [onesignal.com](https://onesignal.com) (push notifications)
8. **PropellerAds** — [propellerads.com](https://propellerads.com) (Day 1 monetization)

### Domain

- Register `naukari360.in` at any registrar (GoDaddy, Namecheap, Hostinger)
- Cost: ₹500-800/year for `.in` domain

---

## Stage 1 — Launch (0 to 50K monthly visitors)

### Monthly Cost: ₹0 (completely free)

### Expected Duration: Month 1–6

### Expected Revenue: ₹0–5,000/month (PropellerAds + affiliates)

---

### 1.1 — Set Up Neon Database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project:
   - **Name:** `naukari360`
   - **Region:** `Asia Pacific (Singapore)` — closest to India
   - **PostgreSQL Version:** 17
3. Copy the connection string from the dashboard
4. It will look like:
   ```
   postgresql://neondb_owner:abc123@ep-cool-morning-12345.ap-southeast-1.aws.neon.tech/naukari360?sslmode=require
   ```

**Free tier limits:**

- 0.5 GB storage (enough for ~50,000 posts)
- 190 compute hours/month
- 1 project, 10 branches
- Auto-suspend after 5 minutes of inactivity (cold start ~1-2s)

### 1.2 — Push Schema to Neon

From your local machine, run:

```bash
# Set the Neon connection string temporarily
export DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx.ap-southeast-1.aws.neon.tech/naukari360?sslmode=require"

# Push schema
pnpm exec prisma db push

# Seed initial data (categories, states, sample posts, admin user)
pnpm exec prisma db seed

# Verify with Prisma Studio
pnpm exec prisma studio
```

### 1.3 — Set Up Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. From Dashboard, note:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key**
   - **API Secret**

**Free tier limits:**

- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

### 1.4 — Set Up Resend

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain (`naukari360.in`)
3. Add DNS records (SPF, DKIM) at your domain registrar
4. Get API key from [resend.com/api-keys](https://resend.com/api-keys)

**Free tier limits:**

- 3,000 emails/month
- 100 emails/day

### 1.5 — Set Up Google Analytics 4

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a property → `naukari360.in`
3. Get your Measurement ID (starts with `G-`)
4. Add it in Admin UI → Site Settings → `google_analytics_id`

### 1.6 — Set Up OneSignal

1. Sign up at [onesignal.com](https://onesignal.com)
2. Create App → Web Push
3. Site URL: `https://naukari360.in`
4. Get App ID

**Free tier limits:**

- 10,000 web push subscribers
- Unlimited notifications

### 1.7 — Deploy to Vercel

#### Step A: Push code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/naukari360.git
git push -u origin main
```

#### Step B: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no config needed
4. Click **Deploy**

#### Step C: Set Environment Variables

Go to **Vercel → Project → Settings → Environment Variables** and add:

| Variable                | Value                                                   | Notes                              |
| ----------------------- | ------------------------------------------------------- | ---------------------------------- |
| `DATABASE_URL`          | `postgresql://...@neon.tech/naukari360?sslmode=require` | Neon connection string             |
| `NEXTAUTH_SECRET`       | Run `openssl rand -base64 32` locally                   | Random 32-char secret              |
| `NEXTAUTH_URL`          | `https://naukari360.in`                                 | Your production URL                |
| `RESEND_API_KEY`        | `re_xxxxxxxxxxxx`                                       | From Resend dashboard              |
| `ADMIN_EMAIL`           | `your-email@gmail.com`                                  | Contact form notifications go here |
| `CLOUDINARY_CLOUD_NAME` | `dxyz123abc`                                            | From Cloudinary dashboard          |
| `CLOUDINARY_API_KEY`    | `123456789012345`                                       | From Cloudinary dashboard          |
| `CLOUDINARY_API_SECRET` | `abcdefghijklmnop`                                      | From Cloudinary dashboard          |
| `ONESIGNAL_APP_ID`      | `xxxxxxxx-xxxx-xxxx-xxxx`                               | From OneSignal                     |
| `REVALIDATION_SECRET`   | Run `openssl rand -base64 32` locally                   | For ISR revalidation API           |

#### Step D: Connect Custom Domain

1. In Vercel → **Settings → Domains** → Add `naukari360.in`
2. Vercel will give you DNS records:
   - `A` record → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
3. Add these at your domain registrar
4. SSL is automatic (free via Let's Encrypt)

#### Step E: Trigger Redeploy

After setting env vars, click **Redeploy** in Vercel to pick up the new variables.

### 1.8 — Set Up PropellerAds (Day 1 Revenue)

1. Sign up at [propellerads.com](https://propellerads.com) (publisher)
2. Add your site → Get approved (usually instant)
3. Get ad codes for:
   - Push notification ads
   - Native ads (in-content)
   - Interstitial ads
4. Add codes via Admin UI → Ads → Create ad slots

### 1.9 — Set Up Affiliate Links

In Admin UI → Affiliate Links, add:

| Name         | URL                                  | Category        |
| ------------ | ------------------------------------ | --------------- |
| Testbook     | `https://testbook.com/?ref=YOUR_ID`  | Study material  |
| Adda247      | `https://adda247.com/?ref=YOUR_ID`   | Study material  |
| Unacademy    | `https://unacademy.com/?ref=YOUR_ID` | Online coaching |
| Amazon Books | `https://amazon.in/tag=YOUR_TAG`     | Books           |

### 1.10 — Verify Deployment

- [ ] Homepage loads at `https://naukari360.in`
- [ ] Admin login works at `https://naukari360.in/admin`
- [ ] Can create posts from admin
- [ ] Images upload to Cloudinary
- [ ] Contact form sends email via Resend
- [ ] Push notifications prompt appears
- [ ] Google Analytics shows real-time visitors
- [ ] PropellerAds serving ads
- [ ] Dark mode toggle works
- [ ] Hindi/English language toggle works
- [ ] Search works
- [ ] Mobile layout is responsive

### Stage 1 — Free Tier Limits Summary

| Service    | Limit              | What Happens When Exceeded      |
| ---------- | ------------------ | ------------------------------- |
| Vercel     | 100 GB bandwidth   | Site goes down until next month |
| Neon       | 0.5 GB storage     | Cannot insert new data          |
| Neon       | 190 compute hours  | DB goes to sleep, cold starts   |
| Cloudinary | 25 GB bandwidth    | Images stop loading             |
| Resend     | 3,000 emails/month | Emails fail silently            |
| OneSignal  | 10K subscribers    | Cannot add new subscribers      |

**When any of these become a problem, move to Stage 2.**

---

## Stage 2 — Growth (50K to 500K monthly visitors)

### Monthly Cost: ₹2,000–5,000 ($20–60)

### Expected Duration: Month 6–18

### Expected Revenue: ₹10,000–50,000/month (AdSense + affiliates)

---

### 2.1 — Upgrade Vercel to Pro

**When:** Bandwidth approaching 100 GB/month or need faster builds.

1. Go to Vercel → Settings → Billing → Upgrade to Pro
2. Cost: **$20/month** (₹1,700)

**Pro gives you:**

- 1 TB bandwidth (10x more)
- 60s serverless function timeout (6x more)
- Password protection for preview deployments
- Speed Insights + Web Analytics
- Team features

### 2.2 — Upgrade Neon Database

**When:** Storage exceeding 0.5 GB or cold starts annoying users.

1. Go to Neon Console → Billing → Upgrade to Launch plan
2. Cost: **$19/month** (₹1,600)

**Launch plan gives you:**

- 10 GB storage
- 300 compute hours/month
- Always-on compute (no cold starts)
- Point-in-time restore (7 days)

### 2.3 — Apply for Google AdSense

**When:** You have 30+ quality posts and 3+ months of consistent traffic.

**Requirements:**

- [ ] 30+ original, quality posts (minimum 500 words each)
- [ ] Privacy Policy page exists (`/privacy-policy`)
- [ ] About page exists (`/about`)
- [ ] Contact page exists (`/contact`)
- [ ] Site is 3+ months old
- [ ] No copyrighted content
- [ ] Clean design with good navigation
- [ ] Mobile-friendly (your app already is)

**Steps:**

1. Go to [adsense.google.com](https://adsense.google.com)
2. Add your site URL
3. Add the AdSense verification code in Admin UI → Site Settings
4. Wait for approval (1–14 days)
5. Once approved, create ad units and add codes via Admin UI → Ads

**Expected revenue:** ₹3–8 per 1,000 pageviews (Indian traffic RPM)

### 2.4 — Set Up Database Backups

Now that you have real data, set up backups:

**Neon (Launch plan):**

- Point-in-time restore is automatic (7 days)
- For longer backups, run weekly:

```bash
# Weekly backup script (run via cron or GitHub Actions)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Add to GitHub Actions** (`.github/workflows/backup.yml`):

```yaml
name: Weekly DB Backup
on:
  schedule:
    - cron: "0 2 * * 0" # Every Sunday at 2 AM UTC
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Install PostgreSQL client
        run: sudo apt-get install -y postgresql-client
      - name: Backup database
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: pg_dump $DATABASE_URL > backup.sql
      - name: Upload backup
        uses: actions/upload-artifact@v4
        with:
          name: db-backup-${{ github.run_number }}
          path: backup.sql
          retention-days: 30
```

### 2.5 — Enable Vercel Analytics

1. In Vercel → Project → Analytics → Enable
2. Free with Pro plan
3. Tracks Core Web Vitals, page performance
4. Complements Google Analytics (server-side vs client-side)

### 2.6 — Set Up Monitoring

**Free options:**

| Tool                                   | What it Monitors                 | Cost                   |
| -------------------------------------- | -------------------------------- | ---------------------- |
| [UptimeRobot](https://uptimerobot.com) | Site uptime, 5-min checks        | Free (50 monitors)     |
| [Sentry](https://sentry.io)            | JavaScript errors, server errors | Free (5K events/month) |
| Vercel Logs                            | Function logs, errors            | Included in Pro        |

### 2.7 — Performance Optimizations

At this traffic level, optimize for speed:

1. **Verify ISR is working:**
   - Pages should revalidate every 5 minutes (`revalidate = 300`)
   - Check Vercel → Deployments → Functions tab for cache HIT/MISS ratio

2. **Image optimization:**
   - All images serve via Vercel Image Optimization (automatic)
   - Free tier: 1,000 images/month → Pro: 5,000 images/month

3. **Monitor Core Web Vitals:**
   - LCP < 2.5s ✓ (ISR + CDN ensures this)
   - FID < 100ms ✓ (minimal client-side JS)
   - CLS < 0.1 ✓ (proper image dimensions)

### Stage 2 — Monthly Cost Breakdown

| Service    | Plan                        | Cost                            |
| ---------- | --------------------------- | ------------------------------- |
| Vercel     | Pro                         | $20/mo                          |
| Neon       | Launch                      | $19/mo                          |
| Cloudinary | Free                        | $0                              |
| Resend     | Free (or $20 if >3K emails) | $0–20                           |
| Domain     | —                           | ~$5/mo (annual)                 |
| **Total**  |                             | **$39–64/month (₹3,300–5,400)** |

---

## Stage 3 — Scale (500K to 5M+ monthly visitors)

### Monthly Cost: ₹8,000–25,000 ($100–300)

### Expected Duration: Month 18+

### Expected Revenue: ₹50,000–5,00,000/month

---

### 3.1 — Decision Point: Vercel vs Self-Hosted

At this scale, evaluate two paths:

#### Option A: Stay on Vercel (Recommended)

**Pros:** Zero DevOps, automatic scaling, no server management
**Cons:** Higher cost than self-hosted

| Traffic          | Vercel Plan           | Cost                 |
| ---------------- | --------------------- | -------------------- |
| 500K–1M visitors | Pro                   | $20/mo               |
| 1M–3M visitors   | Pro (extra bandwidth) | $20 + $40/TB overage |
| 3M+ visitors     | Enterprise            | Custom pricing       |

#### Option B: Migrate to AWS (Advanced)

**Pros:** Lower cost at extreme scale
**Cons:** Need DevOps skills, 2–5 days migration effort

**Only consider this if:**

- Monthly Vercel bill exceeds ₹25,000
- You have DevOps experience (or can hire)
- You need custom infrastructure (WebSockets, background jobs, etc.)

**AWS Architecture (if needed):**

```
CloudFront (CDN)
  → EC2 / ECS (Next.js standalone)
    → RDS PostgreSQL (database)
    → S3 (static assets)
    → ElastiCache Redis (session cache)
```

**Migration steps (if choosing AWS later):**

1. Build Next.js in standalone mode: add `output: "standalone"` to `next.config.ts`
2. Create Docker container (Dockerfile already exists in your project)
3. Deploy to ECS Fargate or EC2
4. Point RDS to migrated Neon data
5. Set up CloudFront CDN in front

**This guide assumes Option A (staying on Vercel).**

### 3.2 — Upgrade Neon to Scale Plan

**When:** Storage exceeding 10 GB or need higher throughput.

1. Upgrade to Neon Scale plan: **$69/month**

**Scale plan gives you:**

- 50 GB storage
- 750 compute hours/month
- Autoscaling compute (0.25 to 4 vCPU)
- Point-in-time restore (30 days)
- Read replicas for analytics queries

### 3.3 — Upgrade Cloudinary (If Needed)

**When:** Image bandwidth exceeding 25 GB/month.

1. Upgrade to Plus plan: **$89/month**

**Gives you:**

- 225 GB storage
- 225 GB bandwidth
- Advanced transformations

**Alternative:** Switch to Vercel Blob + Vercel Image Optimization to consolidate billing.

### 3.4 — Upgrade Resend (If Needed)

**When:** Newsletter exceeding 3,000 emails/month.

| Subscribers | Resend Plan | Cost   |
| ----------- | ----------- | ------ |
| 0–3K        | Free        | $0     |
| 3K–50K      | Pro         | $20/mo |
| 50K–100K    | Business    | $80/mo |

### 3.5 — Add Redis Caching (Optional)

**When:** Database queries becoming slow under high traffic.

Use **Upstash Redis** (serverless, free tier available):

1. Sign up at [upstash.com](https://upstash.com)
2. Create Redis database → Region: `ap-south-1`
3. Add `REDIS_URL` to Vercel environment variables

**Free tier:** 10,000 commands/day
**Pro:** $10/month for 10M commands/day

Cache targets:

- Site settings (cache for 5 min)
- Category lists (cache for 10 min)
- Popular posts (cache for 5 min)

### 3.6 — CDN & Edge Optimization

Vercel already serves from the edge, but at scale:

1. **Enable ISR prerendering** for top 100 posts
2. **Use `stale-while-revalidate`** headers for API responses
3. **Consider Edge Runtime** for lightweight API routes (track-view, subscribe)

### 3.7 — Advanced Monitoring

| Tool                  | Purpose                      | Cost            |
| --------------------- | ---------------------------- | --------------- |
| Sentry Pro            | Error tracking + performance | $26/mo          |
| Vercel Speed Insights | Core Web Vitals monitoring   | Included in Pro |
| Neon Dashboard        | DB query performance         | Included        |
| Google Search Console | SEO monitoring               | Free            |

### 3.8 — Revenue Optimization at Scale

At 500K+ monthly visitors, diversify revenue:

| Revenue Stream               | Expected Monthly (₹) | Setup                           |
| ---------------------------- | -------------------- | ------------------------------- |
| Google AdSense               | ₹15,000–60,000       | Already integrated via Admin UI |
| PropellerAds                 | ₹5,000–20,000        | Already integrated              |
| Affiliate links              | ₹10,000–50,000       | Already integrated              |
| Sponsored posts              | ₹10,000–50,000       | Via contact form                |
| Telegram channel ads         | ₹5,000–20,000        | Grow Telegram following         |
| Email newsletter sponsorship | ₹5,000–15,000        | Grow subscriber list            |
| **Total potential**          | **₹50,000–2,15,000** |                                 |

### Stage 3 — Monthly Cost Breakdown

| Service       | Plan             | Cost                               |
| ------------- | ---------------- | ---------------------------------- |
| Vercel        | Pro              | $20/mo                             |
| Neon          | Scale            | $69/mo                             |
| Cloudinary    | Plus (if needed) | $0–89/mo                           |
| Resend        | Pro              | $20/mo                             |
| Upstash Redis | Pro (if needed)  | $0–10/mo                           |
| Sentry        | Pro (optional)   | $0–26/mo                           |
| Domain        | —                | ~$5/mo                             |
| **Total**     |                  | **$114–239/month (₹9,600–20,000)** |

**At this stage, revenue far exceeds costs (10x–25x).**

---

## Quick Reference — Upgrade Checklist

### Move from Stage 1 → Stage 2 when:

- [ ] Vercel bandwidth exceeds 80 GB/month
- [ ] Neon storage exceeds 400 MB
- [ ] You have 30+ posts and ready for AdSense
- [ ] Monthly revenue exceeds ₹0 (ready to invest)

### Move from Stage 2 → Stage 3 when:

- [ ] Neon storage exceeds 8 GB
- [ ] Database cold starts affecting user experience
- [ ] Monthly visitors consistently above 500K
- [ ] Monthly revenue exceeds ₹25,000

---

## Environment Variables — All Stages

```bash
# ─── Required (All Stages) ───
DATABASE_URL=postgresql://...@neon.tech/naukari360?sslmode=require
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://naukari360.in
RESEND_API_KEY=re_xxxxxxxxxxxx
ADMIN_EMAIL=your-email@gmail.com
REVALIDATION_SECRET=<openssl rand -base64 32>

# ─── Image Uploads ───
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop

# ─── Push Notifications ───
ONESIGNAL_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx

# ─── Stage 3 (Optional) ───
REDIS_URL=redis://default:xxx@xxx.upstash.io:6379
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Troubleshooting

### Build fails on Vercel

```
Error: Cannot find module '.prisma/client'
```

**Fix:** `prisma generate` is already in your `build` and `postinstall` scripts. If it still fails, check that `DATABASE_URL` is set in Vercel env vars.

### Database connection errors

```
Error: Connection terminated unexpectedly
```

**Fix:** Neon free tier suspends after 5 min idle. First request after suspension has a 1–2s cold start. This is normal. Upgrade to Launch plan ($19/mo) for always-on compute.

### Image optimization limit reached

```
Error: Image optimization limit exceeded
```

**Fix:** Vercel free tier allows 1,000 optimized images/month. Upgrade to Pro for 5,000/month, or serve images directly from Cloudinary URLs.

### ISR pages not updating

**Fix:** After publishing a post in admin, the site revalidates within 5 minutes (ISR `revalidate = 300`). For instant updates, use the revalidation API:

```bash
curl -X POST https://naukari360.in/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "YOUR_REVALIDATION_SECRET", "path": "/post/your-post-slug"}'
```

### Resend email not delivered

**Fix:** Verify DNS records (SPF + DKIM) are correctly set at your domain registrar. Check [resend.com/emails](https://resend.com/emails) for delivery status.

---

## Deployment Commands Quick Reference

```bash
# ─── Initial Deploy ───
git push origin main                          # Vercel auto-deploys from GitHub

# ─── Database ───
pnpm exec prisma db push                      # Push schema changes to Neon
pnpm exec prisma db seed                      # Seed initial data
pnpm exec prisma studio                       # Visual database browser

# ─── Local Dev ───
pnpm dev                                      # Start dev server (localhost:3000)
pnpm build                                    # Test production build locally
pnpm lint && pnpm exec tsc --noEmit           # Check lint + types
pnpm exec vitest run                          # Run all 362 tests

# ─── After Schema Changes ───
pnpm exec prisma generate                     # Regenerate Prisma client
pnpm exec prisma db push                      # Push to Neon
git add -A && git commit && git push          # Vercel auto-redeploys
```
