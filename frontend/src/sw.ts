import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope;

// Очистка устаревших кэшей
cleanupOutdatedCaches();

// Пропуск ожидания и немедленная активация
self.skipWaiting();

// Перехват всех клиентов
self.clients.claim();

// Прекэширование файлов из манифеста (инжектируется vite-plugin-pwa)
precacheAndRoute(self.__WB_MANIFEST || []);

// Кэширование статических ресурсов (CSS, JS, изображения)
registerRoute(
  // Кэшируем CSS и JS файлы
  ({ request }) =>
    request.destination === "style" || request.destination === "script",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
    ],
  }),
);

// Кэширование изображений
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 дней
      }),
    ],
  }),
);

// Кэширование шрифтов
registerRoute(
  ({ request }) => request.destination === "font",
  new CacheFirst({
    cacheName: "fonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 год
      }),
    ],
  }),
);

// Кэширование API запросов
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 5 * 60, // 5 минут
      }),
    ],
  }),
);

// Кэширование внешних API (например, для данных)
registerRoute(
  ({ url }) =>
    url.origin === "https://api.example.com" ||
    url.origin === "https://jsonplaceholder.typicode.com",
  new StaleWhileRevalidate({
    cacheName: "external-api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 15 * 60, // 15 минут
      }),
    ],
  }),
);

// Кэширование Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 год
      }),
    ],
  }),
);

// Обработка навигации (SPA fallback)
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// Кастомная логика для offline fallback
self.addEventListener("fetch", (event) => {
  // Пропускаем запросы к Chrome extensions
  if (event.request.url.startsWith("chrome-extension://")) {
    return;
  }

  // Обработка offline страницы для навигации
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches
          .match("/offline.html")
          .then((response) => response || caches.match("/"))
          .then(
            (response) => response || new Response("Offline", { status: 503 }),
          ),
      ),
    );
  }
});

// // Обработка фоновой синхронизации
// self.addEventListener("sync", (event) => {
//   if (event.tag === "background-sync") {
//     event.waitUntil(
//       // Здесь можно добавить логику для отправки отложенных запросов
//       console.log("Background sync triggered"),
//     );
//   }
// });

// Обработка push уведомлений
self.addEventListener("push", (event) => {
  const options = {
    body: event.data?.text() || "Новое уведомление",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Открыть",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Закрыть",
        icon: "/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("PWA App", options));
});

// Обработка кликов по уведомлениям
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(self.clients.openWindow("/"));
  }
});

// Обработка установки и активации
self.addEventListener("install", (_event) => {
  console.log("Service Worker installing...");
  // skipWaiting() уже вызван выше
});

self.addEventListener("activate", (_event) => {
  console.log("Service Worker activating...");
  // clients.claim() уже вызван выше
});

// Экспорт типов для использования в основном приложении
export interface CacheConfig {
  cacheName: string;
  maxEntries: number;
  maxAgeSeconds: number;
}
