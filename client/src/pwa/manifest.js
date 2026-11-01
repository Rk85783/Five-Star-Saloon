import { shopConfig } from '../data/shopConfig.js';

export const pwaManifest = {
  id: '/',
  name: shopConfig.name,
  short_name: shopConfig.shortName,
  description: `${shopConfig.name} — premium barber services.`,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0B0B0B',
  theme_color: '#0B0B0B',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
