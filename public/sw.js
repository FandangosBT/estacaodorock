const CACHE_NAME = 'festival-rock-v1';
const STATIC_CACHE = 'festival-static-v2';
const DYNAMIC_CACHE = 'festival-dynamic-v2';

// Recursos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/offline.html'
];

// URLs da API para cache dinâmico
const API_URLS = [
  '/api/bands',
  '/api/schedule'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1) Evita lidar com requisições de mídia/Range que retornam 206 (parcial)
  const isRangeRequest = request.headers.has('range');
  const isMedia = request.destination === 'video' || request.destination === 'audio';
  if (isRangeRequest || isMedia) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Estratégia Cache First para recursos estáticos
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              // Só coloca no cache respostas completas e do mesmo domínio
              if (
                response && response.ok && response.status !== 206 &&
                request.method === 'GET' && response.type === 'basic'
              ) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone).catch(() => {});
                  });
              }
              return response;
            })
            .catch(() => {
              // Fallback para página offline
              if (request.destination === 'document') {
                return caches.match('/offline.html');
              }
            });
        })
    );
    return;
  }
  
  // Estratégia Network First para APIs
  if (API_URLS.some(apiUrl => url.pathname.includes(apiUrl))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache apenas respostas bem-sucedidas e completas
          if (response && response.ok && response.status !== 206 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone).catch(() => {});
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache em caso de falha de rede
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Retorna dados offline básicos para APIs
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'Dados não disponíveis offline',
                  cached: false
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
            });
        })
    );
    return;
  }
  
  // Estratégia Stale While Revalidate para outros recursos
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            // Cache somente respostas completas do mesmo domínio
            if (
              response && response.ok && response.status !== 206 &&
              request.method === 'GET' && response.type === 'basic'
            ) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone).catch(() => {});
                });
            }
            return response;
          })
          .catch(() => {
            // Em caso de erro, retorna o cache se disponível
            return cachedResponse;
          });
        
        // Retorna cache imediatamente se disponível, senão aguarda fetch
        return cachedResponse || fetchPromise;
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aqui você pode implementar sincronização de dados
      // como envio de formulários offline, etc.
      Promise.resolve()
    );
  }
});

// Notificações push
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização do Festival!',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-96x96.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/icons/icon-96x96.svg'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Festival de Rock 2025', options)
  );
});

// Clique em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Atualização de cache em background
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls || []);
        })
    );
  }
});

(() => {
  try {
    const host = self && self.location && self.location.hostname;
    const __SW_DEV__ = host === 'localhost' || host === '127.0.0.1';
    const __origLog = console.log.bind(console);
    console.log = (...args) => { if (__SW_DEV__) __origLog(...args); };
  } catch (_) {
    // noop
  }
})();