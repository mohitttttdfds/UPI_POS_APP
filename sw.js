const CACHE_NAME = 'shailey-pos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // You must include the paths to your icons here
  '/UPI_POS_APP/icons/icon-72x72.png',
  '/UPI_POS_APP/icons/icon-128x128.png',
  '/UPI_POS_APP/icons/icon-192x192.png',
  '/UPI_POS_APP/icons/icon-512x512.png',
  // Note: External QR API (api.qrserver.com) will not be cached, which is fine.
];

// 1. Install Event: Caches all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch Event: Intercepts network requests and serves from cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache match - perform a network request
        return fetch(event.request);
      })
  );
});

// 3. Activate Event: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
