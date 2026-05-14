# Health — Personalised Plan

A mobile web app that turns a personalised Claude-generated health plan into a **daily companion**: Today dashboard, meals with macro gap hints, optional structured **training** block, local **progress** logging, and grocery / prep / supplements under **More**.

## How it works

1. Fill in the intake form (or tap **Skip to JSON** if you already have a plan file).
2. The app builds a Claude prompt (includes **schema v2** guidance for safer, more consistent JSON).
3. Paste the prompt into [Claude](https://claude.ai) and copy the JSON reply.
4. **Upload** the `.json` file or **paste** JSON on the prompt screen and tap **Apply pasted JSON**.
5. Use **Today** for the next meal and schedule, **Meals** for day-type and phase views, **Training** if `training.weekly_split` exists, **Progress** to log weight locally, and **More** for phases, prep, grocery, and supplements.

## Features

- **Today** — greeting, optional “up next” meal card, stats, schedule, tips, water, privacy/safety card, plan consistency warnings.
- **Meals** — phase selector, workout/rest toggle, **suggested add-ons** when totals lag phase targets.
- **Training** — renders `training.weekly_split` (exercises, sets, reps, rest, progression, substitutions, cues) when present.
- **Progress** — weight log stored in the browser; export JSON from **More → Data**.
- **More** hub — Phases, Prep, Grocery, Supplements; grocery price disclaimer; prep food-safety note; cautious wording pass on some supplement copy.
- Intake optional **wake / sleep / train** clock fields for better meal timing in generated plans.
- PWA with **versioned** service worker, offline shell, and **“refresh to update”** snackbar when a new SW is installed.
- Six-step intake, grocery checklist persistence, prep step checkmarks, supplement timing.

## Sample JSON

See `samples/minimal-plan-v2.json` for a small valid plan that includes `training.weekly_split` (for UI smoke tests). For a richer **schema v2** example with night-shift `schedule`, swaps, and safety fields, use `samples/rudra-plan-v2-normalized.json`.

## Tech & privacy

Single `index.html` (no bundler), system fonts only, strict CSP meta tag, no analytics. Plan JSON, checkmarks, tab state, and progress logs stay in **localStorage** / **sessionStorage** on the device. See `CHANGELOG.md` and `docs/QA_CHECKLIST.md`.

Roadmap: `HEALTH_APP_EXECUTION_PLAN.md`.

Hosted on GitHub Pages: [https://ruddvz.github.io/Health/](https://ruddvz.github.io/Health/)
