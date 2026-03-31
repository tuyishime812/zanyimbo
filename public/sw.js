// Service Worker for DGT Sounds PWA
// Handles caching, offline support, and background sync

const CACHE_NAME = 'dgt-sounds-v1'
const OFFLINE_URL = '/offline.html'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/dowa_logo.png',
  '/index.css',
  '/src/main.jsx'
]

// Network timeout for fetch requests
const NETWORK_TIMEOUT = 5000

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('[SW] Some assets failed to cache:', err)
        // Continue even if some assets fail
        return Promise.resolve()
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return

  event.respondWith(
    fetchWithTimeout(event.request)
      .then((response) => {
        // Network succeeded, cache the response
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache error responses
          if (response.ok) {
            cache.put(event.request, responseClone)
          }
        })
        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', event.request.url)
            return cachedResponse
          }

          // If this is a navigation request, serve offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }

          // Return a generic offline response for other requests
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
      })
  )
})

// Fetch with timeout
function fetchWithTimeout(request) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
    )
  ])
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  // Handle cache updates
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls)
      })
    )
  }

  // Handle cache cleanup
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        )
      })
    )
  }
})

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-music-data') {
    event.waitUntil(syncMusicData())
  }
})

async function syncMusicData() {
  // Implement background sync logic here
  console.log('[SW] Syncing music data in background')
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification from DGT Sounds',
    icon: '/dowa_logo.png',
    badge: '/dowa_logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('DGT Sounds', options)
  )
})

console.log('[SW] Service Worker loaded')
