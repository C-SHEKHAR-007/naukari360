# Role-Based Access Control (RBAC) — Features & Responsibilities

## Roles

| Role          | Description                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `super_admin` | Full platform access. Can manage all content, settings, monetization, and destructive operations.                                                                                     |
| `editor`      | Content management access. Can create/edit posts, categories, states, pages, banners, announcements, menus, and notifications. Cannot delete records or manage monetization/settings. |

---

## Test Accounts

| Role        | Email                  | Password    |
| ----------- | ---------------------- | ----------- |
| Super Admin | `admin@naukari360.in`  | `admin123`  |
| Editor      | `editor@naukari360.in` | `editor123` |

---

## Permission Matrix

### Content Management

| Feature                        | Editor | Super Admin |
| ------------------------------ | ------ | ----------- |
| View Dashboard                 | ✅     | ✅          |
| View Analytics                 | ✅     | ✅          |
| **Posts** — List & View        | ✅     | ✅          |
| **Posts** — Create & Edit      | ✅     | ✅          |
| **Posts** — Delete             | ❌     | ✅          |
| **Categories** — List & View   | ✅     | ✅          |
| **Categories** — Create & Edit | ✅     | ✅          |
| **Categories** — Delete        | ❌     | ✅          |
| **States** — List & View       | ✅     | ✅          |
| **States** — Create & Edit     | ✅     | ✅          |
| **States** — Delete            | ❌     | ✅          |
| **Pages** — List & View        | ✅     | ✅          |
| **Pages** — Create & Edit      | ✅     | ✅          |
| **Pages** — Delete             | ❌     | ✅          |

### UI & Navigation

| Feature                           | Editor | Super Admin |
| --------------------------------- | ------ | ----------- |
| **Nav Menus** — List & View       | ✅     | ✅          |
| **Nav Menus** — Create & Edit     | ✅     | ✅          |
| **Nav Menus** — Delete            | ❌     | ✅          |
| **Banners** — List & View         | ✅     | ✅          |
| **Banners** — Create & Edit       | ✅     | ✅          |
| **Banners** — Delete              | ❌     | ✅          |
| **Announcements** — List & View   | ✅     | ✅          |
| **Announcements** — Create & Edit | ✅     | ✅          |
| **Announcements** — Delete        | ❌     | ✅          |

### Notifications

| Feature                           | Editor | Super Admin |
| --------------------------------- | ------ | ----------- |
| **Notifications** — List          | ✅     | ✅          |
| **Notifications** — Create (Send) | ✅     | ✅          |
| **Notifications** — Delete        | ❌     | ✅          |

### Monetization & Ads (Super Admin Only)

| Feature                         | Editor | Super Admin |
| ------------------------------- | ------ | ----------- |
| **Ad Slots** — Manage           | ❌     | ✅          |
| **Affiliate Links** — Manage    | ❌     | ✅          |
| **Interstitial Pages** — Manage | ❌     | ✅          |

### Platform Settings (Super Admin Only)

| Feature                           | Editor | Super Admin |
| --------------------------------- | ------ | ----------- |
| **Site Settings** — View & Update | ❌     | ✅          |
| **Subscribers** — Export          | ❌     | ✅          |
| **Contact Inbox** — View          | ✅     | ✅          |
| **Contact Inbox** — Delete        | ❌     | ✅          |

---

## How It Works

- **`requireAdmin()`** — Allows both `editor` and `super_admin` roles. Used for read/create/update operations on content.
- **`requireSuperAdmin()`** — Only allows `super_admin`. Used for delete operations, monetization, settings, and subscriber data export.

Both guards are defined in `src/lib/auth-utils.ts` and return either `{ authorized: true, session }` or `{ authorized: false, response: 401|403 }`.

---

## Summary

- **Editor**: Day-to-day content operations — writing posts, managing categories/states, sending notifications, updating banners. Cannot delete anything or touch monetization/settings.
- **Super Admin**: Everything an editor can do, plus destructive operations (delete), platform configuration (site settings, ad slots, affiliate links, interstitial pages), and data export (subscribers CSV).
