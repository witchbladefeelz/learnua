const CACHE_NAME = 'ukrainian-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async function(cache) {
        console.log('Opened cache');
        try {
          await cache.addAll(urlsToCache);
        } catch (error) {
          console.warn('Cache addAll failed:', error);
        }
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  if (!event.request || event.request.method !== 'GET') {
    return;
  }

  const requestUrl = event.request.url;
  if (!requestUrl.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          const cacheRequestUrl = event.request.url;
          if (cacheRequestUrl.startsWith(self.location.origin)) {
            cache.put(event.request, responseToCache).catch(function(error) {
              console.warn('Cache put failed:', error);
            });
          }
        });

        return networkResponse;
      });
    }).catch(function(error) {
      console.warn('Fetch handler failed:', error);
      return fetch(event.request);
    })
  );
});

// Update service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
