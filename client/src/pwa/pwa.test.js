import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { pwaManifest } from './manifest.js';

const publicDirectory = new URL('../../public/', import.meta.url);
const serviceWorkerTemplate = await readFile(new URL('./sw-template.js', import.meta.url), 'utf8');

test('manifest uses the configured shop name and installable standalone settings', () => {
  assert.equal(pwaManifest.name, 'Five Star Saloon');
  assert.equal(pwaManifest.display, 'standalone');
  assert.equal(pwaManifest.start_url, '/');
  assert.ok(pwaManifest.icons.some(({ sizes, purpose }) => sizes === '192x192' && purpose === 'any'));
  assert.ok(pwaManifest.icons.some(({ sizes, purpose }) => sizes === '512x512' && purpose === 'any'));
  assert.ok(pwaManifest.icons.some(({ sizes, purpose }) => sizes === '512x512' && purpose === 'maskable'));
});

test('manifest icon assets are valid PNGs with their declared dimensions', async () => {
  for (const icon of pwaManifest.icons) {
    const bytes = await readFile(new URL(icon.src.slice(1), publicDirectory));
    assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), Number.parseInt(icon.sizes, 10));
    assert.equal(bytes.readUInt32BE(20), Number.parseInt(icon.sizes, 10));
  }
});

test('offline fallback explains connectivity and confirms details are not stored', async () => {
  const offlinePage = await readFile(new URL('offline.html', publicDirectory), 'utf8');
  assert.match(offlinePage, /You’re offline/);
  assert.match(offlinePage, /No booking details are saved/);
  assert.match(offlinePage, /href="\/"/);
});

test('service worker only serves same-origin GET assets and falls back offline for navigation', async () => {
  const handlers = {};
  const precacheUrls = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/assets/app.js', '/assets/app.css'];
  const offlineResponse = new Response('<h1>You are offline</h1>', { headers: { 'Content-Type': 'text/html' } });
  const cache = { addAll: async () => {} };
  const deletedCaches = [];
  const cacheStorage = {
    open: async () => cache,
    keys: async () => ['five-star-static-v0', 'unrelated-old-cache', 'five-star-static-test-version'],
    delete: async (key) => { deletedCaches.push(key); return true; },
    match: async (key) => key === '/offline.html' ? offlineResponse : undefined,
  };
  const self = {
    __PRECACHE_URLS__: precacheUrls,
    __CACHE_VERSION__: 'test-version',
    location: { origin: 'https://saloon.example' },
    clients: { claim: async () => {} },
    addEventListener: (type, handler) => { handlers[type] = handler; },
    skipWaiting: async () => {},
  };
  const runWorker = new Function('self', 'caches', 'URL', 'fetch', 'Response', serviceWorkerTemplate);
  runWorker(self, cacheStorage, URL, async () => { throw new Error('offline'); }, Response);

  let navigationResponse;
  handlers.fetch({
    request: { method: 'GET', url: 'https://saloon.example/unknown', mode: 'navigate' },
    respondWith: (response) => { navigationResponse = response; },
  });
  assert.equal((await navigationResponse).status, 200);
  assert.match(await (await navigationResponse).text(), /You are offline/);

  for (const request of [
    { method: 'POST', url: 'https://saloon.example/booking', mode: 'cors' },
    { method: 'GET', url: 'https://wa.me/919876543210?text=private', mode: 'cors' },
    { method: 'GET', url: 'https://saloon.example/api/booking', mode: 'cors' },
  ]) {
    let intercepted = false;
    handlers.fetch({ request, respondWith: () => { intercepted = true; } });
    assert.equal(intercepted, false);
  }

  assert.deepEqual(precacheUrls.filter((url) => url.startsWith('/api/') || url.startsWith('https://')), []);
  assert.doesNotMatch(serviceWorkerTemplate, /cache\.put\(/);

  let activation;
  handlers.activate({ waitUntil: (promise) => { activation = promise; } });
  await activation;
  assert.deepEqual(deletedCaches, ['five-star-static-v0']);
  assert.match(serviceWorkerTemplate, /const CACHE_NAME = `\$\{CACHE_PREFIX\}\$\{self\.__CACHE_VERSION__\}`;/);
});
