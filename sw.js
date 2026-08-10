/* Gulf Coast Bite service worker — offline-friendly for boats with thin signal.
   Strategy:
   - App shell (HTML/CSS/JS/fonts/icons): stale-while-revalidate, so the last
     good version loads instantly offline and updates in the background.
   - Live data APIs (NOAA / NWS / functions): network-first with a short cache
     fallback, so a dead zone still shows the most recent conditions.
   Version bump the CACHE name to force a refresh of the shell. */
const CACHE = "gcb-shell-v2";
const SHELL = [
  "/",
  "/styles.css?v=20260810-3",
  "/app.js?v=20260810-3",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/fonts/libre-caslon-text-latin-400-normal.woff2",
  "/fonts/libre-caslon-text-latin-400-italic.woff2",
  "/fonts/libre-caslon-text-latin-700-normal.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

function isLiveData(url) {
  return /api\.weather\.gov|tidesandcurrents\.noaa\.gov|ndbc\.noaa\.gov|\/\.netlify\/functions\/|\/api\//.test(url);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = req.url;

  // Live data: network-first, fall back to the last cached response.
  if (isLiveData(url)) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE + "-data").then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || Response.error()))
    );
    return;
  }

  // Same-origin shell: stale-while-revalidate.
  if (new URL(url).origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
