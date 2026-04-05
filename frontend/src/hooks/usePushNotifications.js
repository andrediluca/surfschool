import { useState, useEffect, useCallback } from 'react';
import API from '../api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function usePushNotifications() {
  const supported = 'serviceWorker' in navigator && 'PushManager' in window;
  const [permission, setPermission] = useState(
    supported ? Notification.permission : 'denied'
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if the current browser subscription is known to the backend
  const checkSubscription = useCallback(async () => {
    if (!supported) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) { setSubscribed(false); return; }
      const { data } = await API.get(
        `/auth/push/?endpoint=${encodeURIComponent(sub.endpoint)}`
      );
      setSubscribed(data.subscribed);
    } catch {
      setSubscribed(false);
    }
  }, [supported]);

  useEffect(() => { checkSubscription(); }, [checkSubscription]);

  const subscribe = useCallback(async () => {
    if (!supported || loading) return;
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return;

      const { data: vapid } = await API.get('/push/vapid-public-key/');
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid.publicKey),
      });

      const json = sub.toJSON();
      await API.post('/auth/push/', {
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      });
      setSubscribed(true);
    } catch (err) {
      console.error('Push subscribe failed:', err);
    } finally {
      setLoading(false);
    }
  }, [supported, loading]);

  const unsubscribe = useCallback(async () => {
    if (!supported || loading) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await API.delete('/auth/push/', { data: { endpoint: sub.endpoint } });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch (err) {
      console.error('Push unsubscribe failed:', err);
    } finally {
      setLoading(false);
    }
  }, [supported, loading]);

  return { supported, permission, subscribed, loading, subscribe, unsubscribe };
}
