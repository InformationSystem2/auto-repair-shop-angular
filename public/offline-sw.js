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

// Try the network first; on success update the API cache, on failure serve the
// last cached copy. This is what makes the data available offline.
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
    // No cached copy available -> return a well-formed JSON error so the app
    // can detect the offline state instead of crashing.
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

  // Offline SPA navigation -> serve the app shell so Angular can route.
  if (request.mode === 'navigate') {
    return (await cache.match('/index.html')) || new Response('Offline', { status: 503 });
  }

  return new Response('Network connection lost (offline)', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}
