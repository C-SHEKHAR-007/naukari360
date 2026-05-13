const CACHE_NAME = "naukari360-v1";
const STATIC_ASSETS = ["/", "/manifest.json"];
const MAX_CACHED_POSTS = 20;

// Install: cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-first for pages, Cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and admin/api requests
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return;
  if (url.pathname.startsWith("/_next/")) return;

  // Static assets (JS, CSS, images) — Cache-first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/) ||
    url.pathname.startsWith("/_next/static")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML pages (posts) — Network-first, cache for offline
  if (url.pathname.startsWith("/post/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(async (cache) => {
              // Limit cached posts
              const keys = await cache.keys();
              const postKeys = keys.filter((k) => new URL(k.url).pathname.startsWith("/post/"));
              if (postKeys.length >= MAX_CACHED_POSTS) {
                await cache.delete(postKeys[0]);
              }
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || offlinePage()))
    );
    return;
  }

  // Other pages — Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || offlinePage()))
  );
});

function offlinePage() {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Offline — Naukari360</title><style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;color:#1a237e;text-align:center;padding:1rem}h1{font-size:1.5rem}p{color:#666}</style></head><body><div><h1>📶 You're Offline</h1><p>Please check your internet connection and try again.</p><p>कृपया अपना इंटरनेट कनेक्शन जांचें।</p></div></body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
