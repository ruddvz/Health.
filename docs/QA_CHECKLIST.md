# Manual QA checklist (Health PWA)

Use after substantive UI or storage changes.

## Navigation

- [ ] Bottom tabs: Today, Meals, Training, Progress, More all open the correct panel.
- [ ] From **More**, open Phases / Prep / Grocery / Supplements; **← More menu** returns to the hub.
- [ ] **Quick navigation** cards on Today still jump to the correct More sub-views.

## Intake & prompt

- [ ] Complete intake and generate prompt; optional schedule times appear in copied JSON profile.
- [ ] **Skip to JSON** opens the prompt screen without completing intake.
- [ ] **Paste JSON** + **Apply pasted JSON** loads a valid plan; malformed JSON shows an error.

## Plan load

- [ ] File upload still works; **>2 MB** file is rejected with a clear message.
- [ ] `samples/minimal-plan-v2.json` uploads and shows Training + Meals + Prep.

## Today / Meals

- [ ] **Up next** hero card shows the first meal of the day type.
- [ ] **Plan checks** warnings appear when the sample plan has intentional gaps (or remove warnings when aligned).

## Progress

- [ ] Log a weight; list updates; **Export progress JSON** from More downloads data.

## Service worker

- [ ] Bump `CACHE` in `sw.js`, reload twice; update snackbar appears; **Refresh** loads new assets.

## Data

- [ ] **Delete all local data** clears plan, progress list, and returns to intake.
