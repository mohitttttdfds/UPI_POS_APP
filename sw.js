const CACHE_NAME = 'shailey-pos-v1';
const urlsToCache = [
  // --- CORE FILES: MUST be prefixed with the repository name ---
  '/UPI_POS_APP/',
  '/UPI_POS_APP/index.html',
  '/UPI_POS_APP/manifest.json',
  
  // --- ICON FILES: MUST be prefixed with the repository name ---
  '/UPI_POS_APP/icons/icon-72x72.png',
  '/UPI_POS_APP/icons/icon-128x128.png',
  '/UPI_POS_APP/icons/icon-192x192.png',
  '/UPI_POS_APP/icons/icon-512x512.png',
];

// 1. Install Event: Caches all static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Service Worker failed to cache some assets:', error);
        });
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
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the Service Worker takes control immediately
  return self.clients.claim();
});
