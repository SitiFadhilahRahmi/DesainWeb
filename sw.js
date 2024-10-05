const CACHE_NAME = "v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/offline.html",
  "/offline.jpg",
  "/about.html"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
    );
  });

  self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
    );
  });
// Mengelola fetch
self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          return caches.match("/offline.html");
        });
      })
    );
  });
