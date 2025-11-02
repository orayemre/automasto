const CACHE_NAME = 'cevher-shell-v1';
const urlsToCache = [
  'https://orayemre.github.io/automasto/manifest.json',
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Ana uygulama iskeleti önbelleğe alınıyor.');
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (
    url.pathname.endsWith('manifest.json') ||
    url.pathname.startsWith('/cevher/icon-')
  ) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eski önbellek temizleniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});