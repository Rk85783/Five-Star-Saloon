# Five Star Saloon

Starter workspace for the Five Star Saloon website: React + Vite + Tailwind CSS on the frontend, with an independent Node.js + Express API. Shop details and service pricing belong in `client/src/data/shopConfig.js`, which is the static source of truth. The frontend does not need the API to render.

## Requirements

- Node.js 20.19+ or 22.12+ and npm.
- No paid APIs, paid assets, database, authentication, payment gateway, or admin panel are part of the initial MVP.

## Setup and development

```sh
npm install
cp .env.example .env
npm run dev
```

The client runs at `http://localhost:5173`; the optional API runs at `http://localhost:3000`. On PowerShell, copy the environment template with `Copy-Item .env.example .env`.

Run only one service with `npm run dev:client` or `npm run dev:server`. The API health check is `GET http://localhost:3000/api/health`.

## Quality checks

```sh
npm test
npm run lint
npm run build
```

The build outputs a static site to `client/dist/`. Booking requests are composed in the browser and opened with WhatsApp Click-to-Chat; they are never sent to or stored by the Express API. Set `whatsappNumber` in `client/src/data/shopConfig.js` to a confirmed international number before enabling booking. Address and opening hours remain blank until confirmed.

The PWA caches only its static shell, icons, manifest, and offline page. Booking details are not retained by the service worker. Service-worker installation requires HTTPS in production (or localhost during development); deploy to a static host that provides HTTPS. Do not put secrets in source control. Configure allowed browser origins through `CLIENT_ORIGINS` as a comma-separated list.
