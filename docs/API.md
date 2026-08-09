# Naukari360 — API Documentation

Naukari360 primarily uses Server Components and Prisma direct queries for data fetching. However, a few REST API endpoints are exposed for client-side interactions and webhooks.

---

## 1. Track Post Views
Records a page view for a specific post. Debounced by the client using `sessionStorage`.

**Endpoint:** `POST /api/track-view`

**Request Body:**
```json
{
  "postId": "uuid-of-the-post"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## 2. Newsletter Subscription
Adds a user's email to the subscriber database.

**Endpoint:** `POST /api/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```
**Error (400 Bad Request):**
```json
{
  "error": "Invalid email address"
}
```

---

## 3. Contact Form Submission
Receives contact form submissions and triggers an email to the admin via Resend.

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Advertisement Inquiry",
  "type": "advertisement",
  "message": "I would like to place an ad."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

---

## 4. On-Demand Revalidation (ISR)
Triggers Next.js Incremental Static Regeneration to rebuild a cached page without redeploying the whole site. Usually called automatically by the Admin panel when a post is updated.

**Endpoint:** `POST /api/revalidate`

**Headers:**
*   `Authorization`: Bearer `<SECRET_TOKEN>`

**Request Body:**
```json
{
  "path": "/post/ssc-cgl-2026"
}
```

**Response (200 OK):**
```json
{
  "revalidated": true,
  "now": 17182938291
}
```
