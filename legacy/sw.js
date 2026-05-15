const CACHE = 'health-v11';
const BASE = '/Health';

const ASSETS = [
	`${BASE}/`,
	`${BASE}/index.html`,
	`${BASE}/offline.html`,
	`${BASE}/manifest.json`,
	`${BASE}/assets/icon-192.png`,
	`${BASE}/assets/icon-512.png`
];

self.addEventListener('install', (e) => {
	self.skipWaiting();
	e.waitUntil(
		caches
			.open(CACHE)
			.then((c) => Promise.allSettled(ASSETS.map((url) => c.add(url).catch(() => {}))))
	);
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (e) => {
	const req = e.request;
	if (req.mode === 'navigate') {
		e.respondWith(
			fetch(req)
				.then((res) => {
					try {
						const copy = res.clone();
						caches.open(CACHE).then((c) => c.put(`${BASE}/index.html`, copy));
					} catch {
						/* ignore cache write errors */
					}
					return res;
				})
				.catch(() =>
					caches.match(`${BASE}/offline.html`).then((r) => r || caches.match(`${BASE}/index.html`))
				)
		);
		return;
	}
	e.respondWith(
		caches.match(req).then((cached) => {
			if (cached) return cached;
			return fetch(req).catch(() => caches.match(`${BASE}/offline.html`));
		})
	);
});
