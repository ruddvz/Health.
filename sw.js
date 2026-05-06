const CACHE = "nutripal-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/app.html",
  "/manifest.json",
  "/css/tokens.css",
  "/css/components.css",
  "/css/onboarding.css",
  "/css/app.css",
  "/js/store.js",
  "/js/i18n.js",
  "/js/plangen.js",
  "/js/onboarding.js",
  "/js/app.js",
  "/js/pages/home.js",
  "/js/pages/phases.js",
  "/js/pages/meals.js",
  "/js/pages/prep.js",
  "/js/pages/grocery.js",
  "/js/pages/supps.js",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/axo/axo-wave.png",
  "/assets/axo/axo-think.png",
  "/assets/axo/axo-flex.png",
  "/assets/axo/axo-eat.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
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

  if (isHtml) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/index.html")))
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
