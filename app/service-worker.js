const CACHE_NAME = "kkgs-32-cache-v4";
const urlsToCache = [
    "/",
    "/index.html",
    "/index.js",
    "/change.html",
    "/change.js",
    "/404.html",
    "/app/apple-touch-icon.png",
    "/app/favicon-96x96.png",
    "/app/favicon.ico",
    "/app/favicon.svg",
    "/app/manifest.json",
    "/app/service-worker.js",
    "/app/web-app-manifest-192x192.png",
    "/app/web-app-manifest-512x512.png",
    "/site/",
    "/site/index.html",

];

// インストール時にキャッシュを保存
self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    );
  });

// アクティベート時に古いキャッシュを削除
self.addEventListener("activate", (event) => {
    const currentCaches = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!currentCaches.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 新しい Service Worker がインストールされるとき
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting(); // 新しい Service Worker を即座に有効化
    }
});