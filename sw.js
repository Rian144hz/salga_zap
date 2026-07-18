
const CACHE = 'salga-zap-v1';

const PRECACHE = [
  './',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'init_screen/init_screen.html',
  'init_screen/init_screen.css',
  'init_screen/init_screen.js',
  'menu_screen/menu_screen.html',
  'menu_screen/menu_screen.css',
  'menu_screen/menu_screen.js',
  'car_screen/car_screen.html',
  'car_screen/car_screen.css',
  'car_screen/car_screen.js',
  'data_screen/data_screen.html',
  'data_screen/data_screen.css',
  'data_screen/data_screen.js',
  'data_screen/endereco.html',
  'data_screen/endereco.css',
  'data_screen/endereco.js',
  'data_screen/cartao.html',
  'data_screen/cartao.css',
  'data_screen/cartao.js',
  'confirm_order/confirm_order.html',
  'confirm_order/confirm_order.css',
  'confirm_order/confirm_order.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // externos (cdn) seguem pela rede

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
