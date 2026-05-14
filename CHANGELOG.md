# Changelog

## Unreleased

### SvelteKit rebuild (Phase 1)

- Scaffold SvelteKit (TypeScript), `@sveltejs/adapter-static` with `build/` output and GitHub Pages base `/Health`, `vite-plugin-pwa` with Workbox precache, Nothing OS–inspired design tokens and shell (bottom nav, status strip, offline banner, install/update prompts).
- Move the previous root single-file app into `legacy/` for archival reference; GitHub Actions now deploy the Vite build output instead of the repo root.
- Add `docs/HEALTH_APP_REBUILD_PLAN.md` as the authoritative rebuild specification.

### Legacy single-file app (merged snapshot in `legacy/`)

#### Added

- **normalizePlanV1ToV2** on ingest/save: bumps `plan_schema_version`, fills `schedule.meal_times` and protein `daily_totals` when derivable.
- **Today**: schedule-sorted timeline, macro strip vs phase, Sunday prep / Monday check-in reminders, smarter “up next” meal from clock order.
- **Meals**: **Cook mode** overlay (ingredient checkboxes, steps from description, 5/10/15 min timers), **Swaps** when JSON includes `swaps`, optional **backup / emergency** meals when listed.
- **Training**: on-device **rest countdown** (60/90/120s) when `weekly_split` exists.
- **Progress**: waist logging, weekly check-in notes, soft **Insights** from recent logs.
- **Intake**: allergies field + medication/condition checkbox; prompt profile includes them.
- **More → Appearance**: **Light mode** toggle (`localStorage`).
- Sample `samples/rudra-plan-v2-normalized.json`; **validatePlan** rejects duplicate phase ids.
- Five-tab navigation: **Today**, **Meals**, **Training**, **Progress**, and **More** (phases, prep, grocery, supplements live under More).
- **Training** tab rendering `training.weekly_split` when present; helpful fallback when only `training_note` exists.
- **Progress** tab with local weight log and JSON export from the More hub.
- **Macro repair** suggestions on the Meals tab when calories or protein fall meaningfully below phase targets.
- **Schema v2 enrichment**: `enrichPlanForApp` fills missing `daily_totals` from meal kcal sums, adds default `schedule` and `safety` blocks; `meta.plan_schema_version` set to 2 on save.
- Expanded **validatePlanWarnings** (protein gaps, water >4L, training program missing, supplement safety hint).
- **Intake**: optional wake / sleep / training clock fields; **Skip to JSON** shortcut; prompt screen **paste JSON** flow.
- **PWA**: service worker `health-v10` with `skipWaiting`, network-first navigation, cache update of `index.html`, stale-cache cleanup; in-app **refresh** snackbar when a new SW is waiting.
- Sample plan: `samples/minimal-plan-v2.json`.
- Docs: `docs/QA_CHECKLIST.md` for manual regression checks.

#### Changed

- Claude **buildPrompt** appends explicit schema v2 / safety instructions.
- **Supplement** copy passes through cautious wording helper for several harsh phrases.
- **Grocery** tab shows a standing disclaimer that prices are estimates.
- **Prep** tab includes a short **food safety** reminder card.

#### Fixed

- Progress log button wiring uses a static form (no duplicate listeners on tab revisit).
