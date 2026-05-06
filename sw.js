const CACHE_NAME = 'best-aesthetics-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/case-studies.html',
  '/gallery.html',
  '/services.html',
  '/prices.html',
  '/approach.html',
  '/faq.html',
  '/instagram.html',
  '/contact.html',
  '/styles.css?v=20260506-3',
  '/script.js?v=20260506-3',
  '/manifest.webmanifest',
  '/images/app-icon-192.png',
  '/images/app-icon-512.png',
  '/images/LOGO%20with%20clear%20background.png',
  '/images/logo-header.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    }))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
