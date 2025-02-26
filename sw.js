const CACHE_NAME = 'my-app-cache-v4.1.4';
const BASE_URL = 'https://kkgs-32.github.io';
const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // すぐに適用
});

// fetch イベントでキャッシュを使用
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request) || caches.match(`${BASE_URL}/offline.html`))
    );
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});
