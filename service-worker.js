const CACHE = 'bukva-v1';
const ASSETS = [
  '/russisch-app/',
  '/russisch-app/index.html',
  '/russisch-app/manifest.json',
  '/russisch-app/icons/icon-192x192.png',
  '/russisch-app/icons/icon-512x512.png'
];

// Installation: App-Dateien cachen
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivierung: alten Cache löschen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: zuerst Cache, dann Netzwerk
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Nur gültige Antworten cachen
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => caches.match('/russisch-app/'));
    })
  );
});
