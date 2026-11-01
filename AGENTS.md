# Repository Guidelines

## Product Scope

Build Five Star Saloon for one local Indian barber shop. The MVP uses React, Vite, Tailwind CSS, Node.js, Express, and WhatsApp Click-to-Chat. Keep the design mobile-first and premium black and gold (`#0B0B0B`, `#151515`, `#D4AF37`), display prices in INR, and keep WhatsApp booking direct. Do not add authentication, payments, a database, an admin panel, paid APIs, or paid assets.

## Structure and Configuration

The repository uses npm workspaces: `client/` contains the Vite app and `server/` contains an independent Express API. Keep reusable UI in `client/src/components/`, route views in `client/src/pages/`, and static shop information, services, hours, and WhatsApp contact in `client/src/data/shopConfig.js`. This file is the single source of truth for frontend content. The frontend must render from this static configuration even when the API is unavailable. Keep server configuration and routes under `server/src/`; expose only approved endpoints.

## Development and Quality

Use two spaces in JS/JSX/CSS, camelCase for variables and functions, and PascalCase for React components. Use Tailwind utilities and shared theme tokens for visual consistency. Run `npm run dev` for both services, or `npm run dev:client` / `npm run dev:server` separately. Run `npm test`, `npm run lint`, and `npm run build` before submitting. Tests use Node’s built-in test runner.

## API and Security

Keep API routes under `/api`; the initial endpoint is `GET /api/health`. Use Helmet and CORS restricted to comma-separated `CLIENT_ORIGINS` from environment configuration. Never commit `.env`, credentials, or customer data; keep `.env.example` limited to safe placeholders. Collect only booking details needed for a request. Build WhatsApp Click-to-Chat links client-side, URL-encode message text, and state that the shop must confirm appointments manually. The service worker may cache static build assets only; never cache form data or WhatsApp requests. Production service-worker registration requires HTTPS.

## Contributions

Write short imperative commit subjects. Pull requests should explain user impact, list checks run, and include mobile screenshots when visual behavior changes. Do not overwrite existing files without inspecting them first.
