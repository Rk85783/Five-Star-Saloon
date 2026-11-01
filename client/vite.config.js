import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { pwaManifest } from './src/pwa/manifest.js';

const serviceWorkerTemplate = readFileSync(resolve('src/pwa/sw-template.js'), 'utf8');
const devPrecacheUrls = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
];

function createServiceWorker(precacheUrls, cacheVersion = 'dev') {
  return serviceWorkerTemplate
    .replace('self.__PRECACHE_URLS__', JSON.stringify(precacheUrls))
    .replace('self.__CACHE_VERSION__', JSON.stringify(cacheVersion));
}

function fiveStarPwaPlugin() {
  return {
    name: 'five-star-pwa',
    transformIndexHtml(html) {
      return html.replace('%SHOP_NAME%', pwaManifest.name);
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = request.url?.split('?')[0];
        if (request.method !== 'GET') return next();

        if (pathname === '/manifest.webmanifest') {
          response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.end(JSON.stringify(pwaManifest));
          return;
        }

        if (pathname === '/sw.js') {
          response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
          response.setHeader('Cache-Control', 'no-cache');
          response.setHeader('Service-Worker-Allowed', '/');
          response.end(createServiceWorker(devPrecacheUrls));
          return;
        }

        return next();
      });
    },
    generateBundle(_options, bundle) {
      const bundledAssets = Object.values(bundle)
        .filter((item) => item.type === 'chunk' || (item.type === 'asset' && /\.(css|woff2?|png|svg|webp|ico)$/i.test(item.fileName)))
        .map((item) => `/${item.fileName}`);
      const precacheUrls = [...new Set([...devPrecacheUrls, ...bundledAssets])];
      const cacheVersion = createHash('sha256').update(precacheUrls.join('\n')).digest('hex').slice(0, 12);

      this.emitFile({ type: 'asset', fileName: 'manifest.webmanifest', source: JSON.stringify(pwaManifest, null, 2) });
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: createServiceWorker(precacheUrls, cacheVersion) });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), fiveStarPwaPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
