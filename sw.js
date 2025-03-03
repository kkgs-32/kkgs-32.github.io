const CACHE_NAME = 'v11.4.0.0';
const UPDATE_MESSAGE = "Google AdSenseの登録";
const BASE_URL = 'https://kkgs-32.github.io';
const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
    `https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css`,
];

self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => { return cache.addAll(urlsToCache); })); self.skipWaiting(); });

self.addEventListener('fetch', (event) => { event.respondWith(fetch(event.request).catch(() => caches.match(event.request))); });

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((cacheNames) => { return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))); }));
    self.clients.claim(); event.waitUntil(self.clients.matchAll({ type: 'window' }).then((clients) => { clients.forEach((client) => { client.postMessage({ type: 'SW_UPDATE', version: CACHE_NAME, message: UPDATE_MESSAGE, }); }); }));
});