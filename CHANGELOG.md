# Changelog

## [Unreleased]

### Added

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

### Changed

- Claude **buildPrompt** appends explicit schema v2 / safety instructions.
- **Supplement** copy passes through cautious wording helper for several harsh phrases.
- **Grocery** tab shows a standing disclaimer that prices are estimates.
- **Prep** tab includes a short **food safety** reminder card.

### Fixed

- Progress log button wiring uses a static form (no duplicate listeners on tab revisit).
