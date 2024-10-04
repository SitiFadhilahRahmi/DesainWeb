// Nama cache
const CACHE_NAME = 'static-cache-v1';

// Daftar aset yang ingin di-cache
const urlsToCache = [
  '/index.html',
  '/about.html',
  '/contactus.html',
  '/offline.html',
  '/style.css',           
  '/contact.css',         
  '/pic-removebg-preview.png', 
  '/background web.jpg', 
  '/offline.jpg',
  '/dinobaca.jpg',
  '/picture2.jpeg'        
];

// Install service worker dan cache aset
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opening cache and caching assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Aktivasi service worker dan hapus cache lama jika ada
self.addEventListener('activate', (event) => {
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

// Fetch: Menangani request dan menyediakan fallback untuk offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika request ada di cache, kembalikan dari cache
      if (response) {
        return response;
      }
      // Jika tidak ada di cache, ambil dari jaringan
      return fetch(event.request).catch(() => {
        // Jika offline dan request gagal, tampilkan halaman fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});