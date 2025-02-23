const CACHE_NAME = "kkgs-32-cache-v1";
const urlsToCache = [
    "/",
    "https://kkgs-32.github.io/index.html",
    "https://kkgs-32.github.io/index.js",
    "https://kkgs-32.github.io/change.html",
    "https://kkgs-32.github.io/change.js",
    "https://kkgs-32.github.io/404.html",
    "https://kkgs-32.github.io/app/apple-touch-icon.png",
    "https://kkgs-32.github.io/app/favicon-96x96.png",
    "https://kkgs-32.github.io/app/favicon.ico",
    "https://kkgs-32.github.io/app/favicon.svg",
    "https://kkgs-32.github.io/app/manifest.json",
    "https://kkgs-32.github.io/app/service-worker.js",
    "https://kkgs-32.github.io/app/web-app-manifest-192x192.png",
    "https://kkgs-32.github.io/app/web-app-manifest-512x512.png",
    "https://kkgs-32.github.io/site/index.html",

];

// インストール時にキャッシュを保存
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// フェッチ時にキャッシュから取得
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// 古いキャッシュの削除
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});