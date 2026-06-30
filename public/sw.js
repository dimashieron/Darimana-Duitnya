const CACHE_NAME = 'darimana-duitnya-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json'
];

// Install Event - cache core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell and Static Assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Failed to pre-cache some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate / Cache-First strategy
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Allow caching of local assets AND Google Fonts (fonts.googleapis.com & fonts.gstatic.com)
  const isLocal = url.origin === self.location.origin;
  const isGoogleFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (!isLocal && !isGoogleFont) {
    return;
  }

  // Avoid caching /api/ or dev server hot module replacement
  if (url.pathname.includes('/api/') || url.pathname.includes('/@vite/') || url.pathname.includes('/node_modules/')) {
    return;
  }

  // For navigate requests (HTML pages), use Network-First with a very short timeout, then fallback to Cache
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails (completely offline), match from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Absolute fallback to root
            return caches.match('/');
          });
        })
    );
    return;
  }

  // For static assets (JS, CSS, PNG, JPG, fonts), use Cache-First (with Network fallback and cache fill)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately for instant load
        // But fetch in background to update cache if online (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Ignore background fetch failures when offline */});
        
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache it
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});

// Listen for dynamically collected active page assets from index.html
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_RESOURCES') {
    const urls = event.data.urls;
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Dynamically caching active page assets:', urls);
      return Promise.all(
        urls.map((url) => {
          // Double check if resource is already in cache
          return caches.match(url).then((matched) => {
            if (!matched) {
              return cache.add(url).catch((err) => {
                console.warn('Failed to dynamically cache resource:', url, err);
              });
            }
          });
        })
      );
    });
  }
});
