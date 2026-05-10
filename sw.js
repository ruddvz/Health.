const CACHE = "health-v7";
const BASE = "/Health";
const ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/offline.html`,
  `${BASE}/manifest.json`,
  `${BASE}/assets/icon-192.png`,
  `${BASE}/assets/icon-512.png`,
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(ASSETS.map((url) => c.add(url).catch(() => {})))
    )
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() =>
        caches.match(`${BASE}/offline.html`).then((r) => r || caches.match(`${BASE}/index.html`))
      )
    );
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});
