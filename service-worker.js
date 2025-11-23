// Chirui Reader - Service Worker
const CACHE_NAME = 'chirui-reader-v1';

// Critical resources that must be cached
const criticalResources = [
  '/',
  '/index.html',
  '/src/app.js',
  '/src/styles.css',
  '/manifest.json'
];

// Optional resources that can fail gracefully
const optionalResources = [
  '/icons/chirui-reader-logo.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching critical files');
        // Cache critical resources first
        return cache.addAll(criticalResources)
          .then(() => {
            // Then try to cache optional resources
            console.log('Service Worker: Caching optional files');
            return Promise.allSettled(
              optionalResources.map(url => 
                cache.add(url).catch(err => {
                  console.log(`Service Worker: Failed to cache ${url}`, err);
                })
              )
            );
          });
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Cache successful GET requests
          if (event.request.method === 'GET' && fetchResponse.ok) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});
