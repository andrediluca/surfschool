// Delta9 Surf School — Service Worker (push notifications)

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch (e) { data = { title: 'Delta9', body: event.data.text() }; }

  const title = data.title || 'Delta9 Surf School';
  const options = {
    body: data.body || '',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: data.tag || 'delta9-notification',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
