# Health — Personal Plan

Health is a **local-first PWA** that turns a structured JSON health plan into an interactive daily dashboard. This repository is being rebuilt as **SvelteKit + TypeScript** with a Nothing OS–inspired interface (see `docs/HEALTH_APP_REBUILD_PLAN.md`). The previous single-file app lives in `legacy/` for reference.

- **Privacy:** The app does not send your plan to a server by default. Data stays in browser storage once you import a plan (import UI arrives in Phase 2).
- **Offline:** After the first load, assets are cached by the service worker. An offline fallback page is included.
- **Install:** Use your browser’s “Add to Home Screen” / install flow; Chromium shows a prompt when `beforeinstallprompt` fires.
- **Hosting:** Static build output is deployed to **GitHub Pages** at `https://ruddvz.github.io/Health/` (production build uses base path `/Health`).

## Requirements

- Node.js 22+ (matches GitHub Actions)

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (dev uses an empty base path, so routes are `/`, `/meals`, and so on).

## Build

```bash
npm run build
```

Output is written to `build/`, suitable for GitHub Pages.

## Preview the production build

```bash
npm run preview
```

Use the printed URL; asset URLs will include `/Health` when built for production.

## Deploy

Pushes to `main` run `.github/workflows/pages.yml`, which runs `npm ci`, `npm run build`, and publishes the `build/` folder via GitHub Pages.

## Tests and checks

```bash
npm test
npm run check
npm run lint
```

## Upload JSON (roadmap)

Phase 2 adds file upload, paste, Zod validation, persistence, and System diagnostics. A placeholder sample lives at `static/samples/rudra-plan-v2.json`.

## Reset data (roadmap)

Phase 2+ will expose “delete local data” in System; until then, clear site data for this origin in the browser.

## Schema

The plan schema is documented in the rebuild plan; TypeScript types start in `src/lib/types/plan.ts` and will expand with validation.

## Known limitations

- Today / Meals / Train / Progress / System screens are **shell placeholders** until Phases 2–7 land.
- The legacy HTML app is not removed from the repo; use `legacy/` only as a reference or fallback.
