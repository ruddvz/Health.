# Health — Personal Plan

Health is a **local-first PWA** that turns a structured JSON health plan into an interactive daily dashboard.

This repo now ships a **SvelteKit + TypeScript** build to GitHub Pages (Nothing OS–inspired shell; see `docs/HEALTH_APP_REBUILD_PLAN.md`). The **full-featured single-file app** from earlier iterations is preserved under **`legacy/`** (`legacy/index.html`, etc.) for reference and porting work.

## What the legacy app included

The snapshot in `legacy/` reflects the pre-SvelteKit feature set:

1. Intake form (or **Skip to JSON**) with a Claude prompt that includes **schema v2** guidance.
2. **Upload** or **paste** JSON and apply it.
3. **Today** — schedule timeline, macro strip vs phase, reminders, plan warnings, water, safety card.
4. **Meals** — phase selector, workout/rest toggle, **Cook mode**, **Swaps**, macro gap hints, optional backup meals.
5. **Training** — `training.weekly_split` rendering, on-device **rest countdown** when present.
6. **Progress** — weight and waist logs, check-ins, insights; export from **More → Data**.
7. **More** hub — Phases, Prep, Grocery, Supplements; appearance (light mode); grocery price disclaimer; prep food-safety note.

## Sample JSON

- `samples/minimal-plan-v2.json` — small valid plan with `training.weekly_split` for smoke tests.
- `samples/rudra-plan-v2-normalized.json` — richer schema v2 example (night-shift `schedule`, swaps, safety).
- `static/samples/rudra-plan-v2.json` — placeholder used by the SvelteKit shell until import lands in Phase 2.

## Tech & privacy

- **Production site:** SvelteKit static build (`npm run build` → `build/`), base path **`/Health`** on GitHub Pages.
- **Legacy:** single `legacy/index.html`, system fonts, strict CSP meta, no analytics; data in **localStorage** / **sessionStorage**.
- Roadmaps: `HEALTH_APP_EXECUTION_PLAN.md`, `docs/HEALTH_APP_REBUILD_PLAN.md`, `docs/QA_CHECKLIST.md`.

## Requirements

- Node.js 22+ (matches GitHub Actions)

## Run locally (SvelteKit)

```bash
npm install
npm run dev
```

Open the URL Vite prints (dev uses an empty base path: `/`, `/meals`, `/system`, …).

## Build

```bash
npm run build
```

Output is written to **`build/`** for GitHub Pages.

## Preview the production build

```bash
npm run preview
```

Asset URLs use the `/Health` base in production builds.

## Deploy

Pushes to `main` run `.github/workflows/pages.yml`: `npm ci`, `npm run build`, publish **`build/`**.

## Tests and checks

```bash
npm test
npm run check
npm run lint
```

## SvelteKit roadmap

Import/paste JSON, Zod validation, persistence, and full Today/Meals/Train/Progress behavior are tracked in **`docs/HEALTH_APP_REBUILD_PLAN.md`** (Phases 2–8). Until then, tab screens beyond basic layout are mostly placeholders.

## Reset data

Clear site data for this origin in the browser, or use **More → Data** flows described in the legacy app when running `legacy/index.html` locally.

## Known limitations

- The live **GitHub Pages** app follows the **SvelteKit** shell until feature parity is implemented.
- **`legacy/`** is a static snapshot; opening `legacy/index.html` directly may break asset paths (`assets/` icons) unless served with correct base URL.
