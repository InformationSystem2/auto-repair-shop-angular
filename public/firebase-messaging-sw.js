importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAZ6lU3Mrb3ElEk3a7nI7REtAi1_Devtyg',
  authDomain: 'project-5ed4e5c6-d00d-4ed4-86c.firebaseapp.com',
  projectId: 'project-5ed4e5c6-d00d-4ed4-86c',
  storageBucket: 'project-5ed4e5c6-d00d-4ed4-86c.firebasestorage.app',
  messagingSenderId: '776780812382',
  appId: '1:776780812382:web:2ffb46facbc66b1c31e4cf',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const title = payload.notification?.title || payload.data?.title || 'Auxilio Mecánico';
  const body = payload.notification?.body || payload.data?.body || '';
  
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
  });
});

// --- Offline Caching and Routing Logic (formerly offline-sw.js) ---
const SHELL_CACHE = 'auto-repair-shell-v2';
const API_CACHE = 'auto-repair-api-v2';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const KEEP = [SHELL_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (!KEEP.includes(cache)) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests (writes need online connectivity)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Skip WebSocket / live-streaming endpoints
  if (url.pathname.includes('ws/')) return;

  // --- API requests: network-first, fall back to cache when offline ---
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // --- App shell / static assets: stale-while-revalidate ---
  event.respondWith(staleWhileRevalidate(event.request));
});

async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ offline: true, message: 'Sin conexion: datos no disponibles en cache' }),
      { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((networkResponse) => {
      if (
        networkResponse &&
        networkResponse.status === 200 &&
        (networkResponse.type === 'basic' || networkResponse.type === 'cors')
      ) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  if (cached) return cached;

  const networkResponse = await networkFetch;
  if (networkResponse) return networkResponse;

  if (request.mode === 'navigate') {
    return (await cache.match('/index.html')) || new Response('Offline', { status: 503 });
  }

  return new Response('Network connection lost (offline)', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}
