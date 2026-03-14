/// <reference lib="webworker" />

// Service Worker for PWA Push Notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 푸시 알림 수신
self.addEventListener("push", (event) => {
  const defaultData = {
    title: "인테리어 견적 알림",
    body: "새로운 소식이 있습니다.",
    url: "/",
  };

  let data = defaultData;
  try {
    if (event.data) {
      data = { ...defaultData, ...event.data.json() };
    }
  } catch {
    // JSON 파싱 실패 시 기본값 사용
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: data.url },
      vibrate: [200, 100, 200],
      requireInteraction: true,
    })
  );
});

// 알림 클릭 시 해당 페이지로 이동
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // 이미 열린 탭이 있으면 포커스
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      // 없으면 새 탭 열기
      return self.clients.openWindow(url);
    })
  );
});
