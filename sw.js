const CACHE = "health-pwa-v3";
/** Paths relative to the service worker scope (works on GitHub Pages `/repo/`). */
const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@400;500;600;700;800;900&display=swap";

const ASSET_PATHS = [
  "./",
  "index.html",
  "app.html",
  "offline.html",
  "manifest.json",
  "css/tokens.css",
  "css/components.css",
  "css/onboarding.css",
  "css/app.css",
  "js/store.js",
  "js/foodLog.js",
  "js/mealSwap.js",
  "js/weightStore.js",
  "js/notifications.js",
  "js/i18n.js",
  "js/plangen.js",
  "js/onboarding.js",
  "js/app.js",
  "js/data/foods.js",
  "js/data/mealOptions.js",
  "js/data/supplements.js",
  "js/data/groceryRef.js",
  "js/pages/home.js",
  "js/pages/phases.js",
  "js/pages/meals.js",
  "js/healthStore.js",
  "js/themeApply.js",
  "js/dashboardHabits.js",
  "js/mealToGrocery.js",
  "js/data/exercises.js",
  "js/data/mealPlansLibrary.js",
  "js/data/groceryDatabase.js",
  "js/data/supplementCatalog.js",
  "js/pages/workout.js",
  "js/pages/grocery.js",
  "js/pages/supps.js",
  "js/pages/progress.js",
  "js/pages/tools.js",
  "icons/icon-72.png",
  "icons/icon-96.png",
  "icons/icon-128.png",
  "icons/icon-144.png",
  "icons/icon-152.png",
  "icons/icon-192.png",
  "icons/icon-384.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "screenshots/mobile-home.png",
  "screenshots/desktop-home.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  FONT_CSS,
];

function scopeUrls() {
  const base = self.registration?.scope || self.location.href.replace(/\/[^/]+$/, "/");
  return ASSET_PATHS.map((p) => new URL(p, base).href);
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    try {
      data = { body: event.data?.text() || "" };
    } catch {
      data = {};
    }
  }
  const scopeBase = self.registration?.scope || self.location.href.replace(/\/[^/]+$/, "/");
  const iconUrl = new URL("assets/icons/icon-192.png", scopeBase).href;
  event.waitUntil(
    self.registration.showNotification(data.title || "Health", {
      body: data.body || "",
      icon: iconUrl,
      badge: iconUrl,
      tag: data.tag || "nutripal",
      data: { url: data.url || "app.html" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "app.html";
  const scopeBase = self.registration.scope || "";
  const abs = new URL(url, scopeBase).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const c of clientsArr) {
        if (c.url.startsWith(new URL("./", scopeBase).href) && "focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(abs);
    })
  );
});

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(
        scopeUrls().map((url) =>
          c.add(url).catch(() => {
            /* skip missing */
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  const path = url.pathname;
  const isHtml = req.mode === "navigate" || path.endsWith(".html") || path === "/" || path === "";
  const scopeBase = self.registration?.scope || new URL("./", url).href;
  const indexUrl = new URL("index.html", scopeBase).href;
  const offlineUrl = new URL("offline.html", scopeBase).href;

  if (isHtml) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match(offlineUrl).then((o) => o || caches.match(indexUrl)))
        )
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        if (req.method === "GET" && res.ok) {
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
