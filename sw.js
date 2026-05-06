const CACHE = "nutripal-v11";
/** Paths relative to the service worker scope (works on GitHub Pages `/repo/`). */
const ASSET_PATHS = [
  "./",
  "index.html",
  "app.html",
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
  "js/pages/home.js",
  "js/pages/phases.js",
  "js/pages/meals.js",
  "js/pages/prep.js",
  "js/pages/grocery.js",
  "js/pages/supps.js",
  "js/pages/progress.js",
  "js/pages/tools.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
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
    self.registration.showNotification(data.title || "NutriPal", {
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
  const indexUrl = new URL("index.html", self.registration?.scope || url.origin + "/").href;

  if (isHtml) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(indexUrl)))
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
