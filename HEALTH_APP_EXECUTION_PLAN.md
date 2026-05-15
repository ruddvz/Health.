# Health App — Final UI/UX, Content, Data, and Product Improvement Plan

This file is the **canonical execution roadmap** for turning the Health PWA into a premium, local-first daily companion. It condenses the full product specification into actionable engineering work while preserving every major requirement (information architecture, schema v2, validation tiers, PR sequence, privacy, PWA, accessibility, and QA). The original long-form narrative from the product brief can be archived alongside this file if a verbatim copy is required for compliance or design reviews.

**Project:** `ruddvz/Health`  
**Live site:** `https://ruddvz.github.io/Health/`  
**Primary plan sample reviewed:** `rudra plan v2.json`

---

## 0. Product Direction

The app should be a **personal health-plan viewer and daily execution companion**, not a JSON document viewer.

**Target feel:** Apple Health / Fitness polish, MyFitnessPal clarity, private offline-first PWA, daily coach, meal-prep and grocery assistant, progress tracker, **safe** supplement and nutrition guide (not overconfident medical advice).

---

## 1. Audit Summary (existing vs gap)

**Exists:** Intake, install banner, JSON upload, Claude prompt screen, shell with Home / Phases / Meals / Prep / Grocery / Supplements, day-type toggle, phase and grocery category selectors, PWA files, offline page.

**Gap:** Structure, validation, explanation, and **actionability** of rich JSON — not lack of raw content.

---

## 2. P0 Problems

1. **Document-like UX** → **Today dashboard** (next meal, macros remaining, day type, supplements, water, prep, grocery, check-in, one primary action).
2. **Weak validation** → Catch contradictions (meal totals vs phase targets, schedule vs meals/supplements, duplicate IDs, impossible numbers). Warnings vs hard errors (see §7).
3. **Overconfident supplement copy** → Cautious language, safety labels, evidence framing.
4. **Training underbuilt** → Full program schema (exercises, sets, reps, rest, progression, substitutions).
5. **No macro repair** → Suggested add-ons when day totals miss targets.
6. **Design system discipline** → Tokens, hierarchy, fewer competing badges.
7. **Privacy accuracy** → No third-party fonts by default; explicit privacy copy; treat JSON as untrusted.
8. **Health safety productized** → Disclaimers, consult card, red flags, allergies, medication warnings, ED caution, extreme deficit, under-18 note.

---

## 3. Information Architecture (target)

**Bottom nav (max 5):** Today · Meals · Training · Progress · More

**More:** Phases, Grocery, Prep, Supplements, Settings, Export / Re-upload, Privacy, About.

---

## 4. Screen Redesign (summary)

| Area                   | Goal                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Intake                 | Card flow, sections (About, Goal, Schedule, Training, Food, Lifestyle, Supplements), autosave, “Skip and upload JSON”, validations |
| Prompt                 | Numbered stepper, copy, paste JSON option, common mistakes, missing keys                                                           |
| Today                  | Greeting, phase, day toggle, primary card by time, macro strip, timeline from **user schedule**, smart warnings                    |
| Meals                  | Macro view, cards, swaps, cooking mode, grocery add, macro gap repair                                                              |
| Training               | Weekly split, today’s workout, set tracker, rest timer, history local                                                              |
| Progress               | Weight/waist/photos, streaks, check-in, red-flag engine, export                                                                    |
| Grocery / Prep / Supps | Under More; polish store/category modes, safety, tone                                                                              |

---

## 5. Design System (target tokens)

Premium dark: soft black, deep green, lime accent, large cards, calm spacing, iOS-style controls. Use provided CSS token palette (§5 in original spec): `--bg`, `--surface-*`, `--text-*`, `--accent`, radii, shadows, `--safe-bottom`.

**Typography:** System / self-hosted only (no Google Fonts for privacy).

---

## 6. Data Contract — Schema v2 (top-level)

Top-level keys: `meta` (schema_version 2.0, locale, units, disclaimer), `user`, `schedule`, `nutrition`, `training`, `meals`, `prep`, `grocery`, `supplements`, `progress`, `safety`.

**Critical:** `schedule` with timezone, wake/sleep, training time, meal_times — fixes schedule contradictions. Phase targets vs `actual_totals` / `target_delta` for meals.

---

## 7. Validation

- **`validatePlanV2(plan)`** — required keys, version, arrays, internal calorie/protein consistency, duplicate IDs, invalid numbers, impossible targets.
- **Warnings** — do not block: e.g. kcal >100 below target, protein >15g low, rest-day low vs TDEE, supplement claims without safety, training notes without program, meal vs wake/sleep conflict, water >4L, aggressive timeline.
- **Errors** — block: invalid JSON, missing top-level, no meals/phases, bad schema version, unsafe extreme calories, missing critical user fields, unparseable meal plan.

---

## 8–12. Content, Privacy, PWA, Accessibility, Performance

- **Content:** Fix sample schedule (night shift example), align meal calories ±100 kcal to phase, training program, rotations, emergency meals, grocery price realism, tone (firm not shaming).
- **Privacy:** No `innerHTML` from JSON; size cap (~2 MB); sanitize if HTML ever allowed; CSP; namespaced `health.v2.*` keys; delete/export UX.
- **PWA:** Versioned SW cache, network-first `index.html`, update snackbar, offline banner.
- **A11y:** WCAG 2.2 AA basics, 44px targets, focus, `aria-live`, reduced motion.
- **Perf:** Sectioned `index.html`, debounce storage, lazy tabs, no heavy libs.

---

## 13. Engineering PR Sequence (definition)

| PR        | Focus                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| **PR-1**  | Section comments, upload size limit, parse errors, validation wrapper, safe DOM helpers, delete local data, privacy card |
| **PR-2**  | Schema v2 validator, warnings, v1 migration, normalized sample JSON                                                      |
| **PR-3**  | Design tokens + shared components                                                                                        |
| **PR-4**  | Intake redesign + prompt v2                                                                                              |
| **PR-5**  | Today dashboard                                                                                                          |
| **PR-6**  | Meals 2.0 + macro repair                                                                                                 |
| **PR-7**  | Training tab + local history                                                                                             |
| **PR-8**  | Progress tab + export                                                                                                    |
| **PR-9**  | Grocery / prep / supps polish                                                                                            |
| **PR-10** | PWA polish, a11y pass, README / CHANGELOG / samples / QA checklist                                                       |

---

## 14. Claude Prompt Hardening

Require: schema 2.0, one schedule, meals within ±100 kcal / ±10g protein of targets, swaps, training program + progression, cautious supplements, food safety, red flags, non-medical framing, self-audit checklist before return.

---

## 15. Manual QA Checklist (headings)

Intake (metric/imperial, persistence, prompt) · JSON upload (valid, malformed, missing keys, huge file, XSS-like strings, paste, re-upload) · App shell · Today · Meals · Training · Progress · A11y · PWA.

---

## 16. Definition of Done

Polished on phone/tablet/desktop; first screen understandable in ~5 seconds; sample JSON works; Today answers “what next”; totals vs targets checked; schedule issues flagged; training fully rendered; grocery/prep/supps usable; supplement copy safe; data local; offline after first load; export + delete; one coherent visual product.

---

## 17. Final Build Order

1. Safe JSON validation and migration
2. Design system
3. Today dashboard
4. Meal target consistency + macro repair
5. Schedule-aware timeline
6. Training tab
7. Progress tracking
8. Grocery / prep / supplement polish
9. PWA update / offline
10. Accessibility and QA

**North star:** _“What should I do next, and is my plan still on track?”_

---

## Repo implementation status

| Item                                 | Status                                                                                                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| This roadmap file                    | Added                                                                                                                                                                                                            |
| PR-1 baseline                        | Landed on `cursor/health-plan-and-safety-8dc9` (merged into subsequent work)                                                                                                                                     |
| PR-2 schema / migration / enrichment | `normalizePlanV1ToV2`, `enrichPlanForApp`, duplicate phase id errors, wake/sleep vs meal warnings, `schema_version` 2.0 on save; samples `samples/minimal-plan-v2.json`, `samples/rudra-plan-v2-normalized.json` |
| PR-3 design system                   | Design tokens (`--ds-*`), light mode (`data-theme="light"`), new cook overlay + training timer styles                                                                                                            |
| PR-4 intake / prompt                 | Allergies + medication flag, schedule clocks, skip-to-JSON, paste JSON, prompt tail                                                                                                                              |
| PR-5 Today dashboard                 | Schedule-sorted timeline, macro strip vs phase, Sunday prep + Monday check-in reminders, smarter “up next” meal                                                                                                  |
| PR-6 Meals 2.0                       | Swaps (`details`), cook mode overlay, backup / emergency meal list when JSON provides it                                                                                                                         |
| PR-7 Training                        | `weekly_split` + on-device rest countdown                                                                                                                                                                        |
| PR-8 Progress                        | Waist + check-in notes, soft “insights” from logs, weight export unchanged                                                                                                                                       |
| PR-9 Grocery / prep / supps          | (unchanged this pass) price disclaimer, prep food-safety, supplement tone                                                                                                                                        |
| PR-10 PWA / docs / QA                | Offline page uses system fonts only; SW snackbar retained                                                                                                                                                        |

Branch: `cursor/health-pr2-pr10-8dc9`

_Update this table as PRs land._
