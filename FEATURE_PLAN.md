# NutriPal — Feature Implementation Plan

> **Status:** Features **1–12** from this document are **implemented** in the codebase (meal compliance through install banner, Progress tab, tools, settings with plan regen, meal swaps, local notifications + SW push handlers, etc.). What remains optional: a **push subscription backend** for real remote pushes, and **expanding** `js/data/foods.js` beyond the starter list.
>
> **Architecture:** Static PWA — no server, no database. State in `localStorage`. Read `PLAN.md` and `UI_REDESIGN_PLAN.md` before changing flows or tokens.
>
> **Inspiration sources:** HEALTHSYNC_MERN (daily monitoring, medication adherence, analytics), ai_meal_planner (meal swap, recipe cards, compliance), NutriGuide AI (weight charting, macro tracking, progress dashboard), Acara Plate (daily health signals, food database, habit coaching, PWA install).

---

## localStorage Key Registry (do not break existing keys)

```
np_lang                 String   — 'en'|'hi'|'gu'
np_profile              JSON     — user profile (name, goal, macros, etc.)
np_plan                 JSON     — generated plan object
np_grocery_checked      JSON     — array of checked grocery item IDs
np_water_YYYY-MM-DD     String   — glasses drunk today (0–8)
np_checkin_YYYY-MM-DD   JSON     — daily habit check-in object
np_streak               JSON     — {days: number, last: 'YYYY-MM-DD'}

NEW keys added by this plan:
np_weights              JSON     — [{date:'YYYY-MM-DD', kg:number}]
np_measurements         JSON     — [{date:'YYYY-MM-DD', waist:n, chest:n, arms:n}]
np_food_log_YYYY-MM-DD  JSON     — [{mealId, name, kcal, protein, carbs, fat}]
np_supp_log_YYYY-MM-DD  JSON     — {supplementId: bool, ...}
np_meal_swap_map        JSON     — {"0-breakfast": "Meal name", ...} weekday overrides
np_photo_dismissed      String   — last dismissed plan week number (photo banner)
np_install_dismissed    String   — '1' if install banner dismissed
np_push_asked           String   — '1' after notification permission prompt

Deferred / optional:
np_photo_dates          JSON     — [{week:n, date:'YYYY-MM-DD'}] (not yet used)
np_push_sub             String   — push subscription JSON (needs backend)
np_sleep_YYYY-MM-DD     JSON     — superseded by extended np_checkin_* for Feature 3 signals
np_mood_YYYY-MM-DD      JSON     — superseded by extended np_checkin_* 
```

---

## Feature Priority Order

| # | Feature | Impact | Effort | Inspired By |
|---|---------|--------|--------|-------------|
| 1 | Meal Compliance Tracker | ★★★★★ | Medium | NutriGuide, ai_meal_planner |
| 2 | Weight Log + Sparkline Chart | ★★★★★ | Medium | NutriGuide, HEALTHSYNC |
| 3 | Daily Health Signals | ★★★★☆ | Low | Acara Plate, HEALTHSYNC |
| 4 | Progress Page (new tab) | ★★★★☆ | High | NutriGuide, HEALTHSYNC |
| 5 | Supplement Adherence Log | ★★★★☆ | Low | HEALTHSYNC |
| 6 | Meal Swap / Alternatives | ★★★☆☆ | Medium | ai_meal_planner |
| 7 | Web Push Reminders | ★★★☆☆ | High | HEALTHSYNC, Acara Plate |
| 8 | Food Database Search | ★★★☆☆ | High | Acara Plate, NutriGuide |
| 9 | Body Composition Display | ★★★☆☆ | Low | NutriGuide |
| 10 | Progress Photo Reminders | ★★☆☆☆ | Low | All four repos |
| 11 | Profile Edit in Settings | ★★☆☆☆ | Medium | HEALTHSYNC |
| 12 | PWA Install Banner | ★★☆☆☆ | Low | Acara Plate |

---

---

## FEATURE 1 — Meal Compliance Tracker

**What it does:** Each meal card gets a "Mark as eaten" button. Tapping it logs the meal's calories and macros for the day. A running today's intake counter appears at the top of the Meals page. Bar fills as the day progresses toward target.

**Inspired by:** NutriGuide's daily nutrition logging, ai_meal_planner's meal compliance.

### Files to change

**`js/pages/meals.js`** — Primary change

In `renderInner()`, add to each meal card template:
```html
<button type="button" class="meal-eat-btn ${eaten ? 'eaten' : ''}" data-meal-id="${m.slot}">
  ${eaten ? '✓ Eaten' : 'Mark eaten'}
</button>
```

Add a daily summary bar above the meal list:
```html
<div class="compliance-bar glass" id="compliance-bar">
  <div class="compliance-row">
    <span class="compliance-label">Today</span>
    <span class="compliance-kcal" id="comp-kcal">0 / ${plan.targetCalories} kcal</span>
  </div>
  <div class="progress-track" style="margin-top:8px">
    <div class="progress-fill" id="comp-fill" style="width:${pct}%;animation:none"></div>
  </div>
  <div class="compliance-macros">
    <span>P: ${loggedProtein}g / ${plan.macro.protein}g</span>
    <span>C: ${loggedCarbs}g / ${plan.macro.carbs}g</span>
    <span>F: ${loggedFat}g / ${plan.macro.fat}g</span>
  </div>
</div>
```

**Storage logic** (add to `meals.js`):
```js
const LOG_KEY = `np_food_log_${todayKey()}`;

function getLog() {
  return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
}

function toggleEaten(mealId, mealData) {
  const log = getLog();
  const idx = log.findIndex(e => e.mealId === mealId);
  if (idx >= 0) log.splice(idx, 1);          // un-mark
  else log.push({ mealId, ...mealData });      // mark eaten
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

function getTotals() {
  return getLog().reduce((t, e) => ({
    kcal: t.kcal + (e.kcal || 0),
    protein: t.protein + (e.protein || 0),
    carbs: t.carbs + (e.carbs || 0),
    fat: t.fat + (e.fat || 0),
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
}
```

**`css/app.css`** — Add these classes:

```css
.meal-eat-btn {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border-radius: var(--radius-btn);
  border: 1.5px solid var(--border-mid);
  background: var(--surface-low);
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-spring);
}
.meal-eat-btn.eaten {
  background: var(--lime-15);
  border-color: rgba(212,245,60,0.4);
  color: var(--accent-lime);
}
.compliance-bar { padding: 14px 16px; margin-bottom: 14px; }
.compliance-row { display: flex; justify-content: space-between; align-items: center; }
.compliance-label { font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); }
.compliance-kcal { font-family: var(--font-display); font-size: 0.92rem; font-weight: 700; color: var(--text); }
.compliance-macros { display: flex; gap: 12px; margin-top: 8px; font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); }
```

**Also update `js/pages/home.js`** — Show today's compliance on the home page progress card. Read from `np_food_log_YYYY-MM-DD` and display `loggedKcal / targetKcal`.

---

## FEATURE 2 — Weight Log + Sparkline Chart

**What it does:** User taps a weight log widget on the home page. Enters today's weight. App shows a tiny sparkline chart of the last 8 weigh-ins inline. Long-term trend (gaining/losing/stable) shown with an arrow.

**Inspired by:** NutriGuide's weight tracking, HEALTHSYNC's daily monitoring.

### Files to change

**`js/pages/home.js`** — Add weight log widget below the hero stats:

```js
const WEIGHT_KEY = 'np_weights';

function getWeights() {
  return JSON.parse(localStorage.getItem(WEIGHT_KEY) || '[]');
}

function logWeight(kg) {
  const weights = getWeights();
  const today = todayKey();
  const idx = weights.findIndex(w => w.date === today);
  if (idx >= 0) weights[idx].kg = kg;
  else weights.push({ date: today, kg });
  weights.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(weights.slice(-52))); // keep 1 year
}

function renderSparkline(weights) {
  if (weights.length < 2) return '';
  const last8 = weights.slice(-8);
  const vals = last8.map(w => w.kg);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 120, H = 32, pad = 4;
  const points = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  const trend = vals[vals.length - 1] - vals[0];
  const trendIcon = trend < -0.2 ? '↓' : trend > 0.2 ? '↑' : '→';
  const trendColor = trend < -0.2 ? 'var(--accent-lime)' : trend > 0.2 ? 'var(--accent-orange)' : 'var(--accent-teal)';
  return `
    <div class="weight-widget glass">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span class="section-eyebrow" style="margin:0">Weight Log</span>
        <span style="font-family:var(--font-display);font-size:1.2rem;font-weight:900;color:${trendColor}">${vals[vals.length-1]} kg ${trendIcon}</span>
      </div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:${H}px;overflow:visible">
        <polyline points="${points}" fill="none" stroke="var(--accent-lime)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${vals.map((v, i) => {
          const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
          const y = H - pad - ((v - min) / range) * (H - pad * 2);
          return `<circle cx="${x}" cy="${y}" r="${i === vals.length-1 ? 3.5 : 2}" fill="${i === vals.length-1 ? 'var(--accent-lime)' : 'var(--border-mid)'}"/>`;
        }).join('')}
      </svg>
      <div style="display:flex;gap:8px;margin-top:10px">
        <input type="number" class="field" id="weight-input" step="0.1" min="30" max="250" placeholder="${vals[vals.length-1]}" style="flex:1;padding:10px 12px;font-size:0.9rem">
        <button type="button" class="btn btn-primary" id="weight-log-btn" style="width:auto;padding:10px 16px;font-size:0.85rem">Log</button>
      </div>
    </div>`;
}
```

Wire the "Log" button in `mountHome()`:
```js
document.getElementById('weight-log-btn')?.addEventListener('click', () => {
  const val = parseFloat(document.getElementById('weight-input').value);
  if (!isNaN(val) && val > 30 && val < 250) {
    logWeight(val);
    mountHome(root, profile, plan); // re-render
  }
});
```

**`css/app.css`** — Add:
```css
.weight-widget { padding: 14px 16px; margin-bottom: 14px; }
```

---

## FEATURE 3 — Daily Health Signals (Sleep + Mood)

**What it does:** Extends the existing daily check-in on home page with: sleep hours input, mood picker (5 emoji options), energy level (1–5 tap grid). All stored in `np_checkin_YYYY-MM-DD` (existing key, just extend the schema).

**Inspired by:** Acara Plate's daily signals tracking, HEALTHSYNC's daily monitoring.

### Files to change

**`js/pages/home.js`** — Add to the check-in section after the habit list:

```html
<div class="glass signals-card" style="margin-top:10px;padding:16px">
  <div class="section-eyebrow" style="margin:0 0 12px">Health Signals</div>

  <!-- Sleep -->
  <div class="signal-row">
    <span class="signal-icon">😴</span>
    <span class="signal-label">Sleep</span>
    <div style="display:flex;align-items:center;gap:8px;margin-left:auto">
      <input type="number" class="field" id="sleep-hrs" min="0" max="14" step="0.5"
        placeholder="hrs" value="${checkin.sleepHours || ''}"
        style="width:72px;padding:8px 10px;font-size:0.88rem;text-align:center">
      <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">hrs</span>
    </div>
  </div>

  <!-- Mood -->
  <div class="signal-row" style="margin-top:12px">
    <span class="signal-icon">😊</span>
    <span class="signal-label">Mood</span>
    <div class="mood-grid" style="margin-left:auto">
      ${['😫','😔','😐','😊','🤩'].map((e, i) =>
        `<button type="button" class="mood-btn ${checkin.mood === i ? 'selected' : ''}" data-mood="${i}">${e}</button>`
      ).join('')}
    </div>
  </div>

  <!-- Energy -->
  <div class="signal-row" style="margin-top:12px">
    <span class="signal-icon">⚡</span>
    <span class="signal-label">Energy</span>
    <div class="energy-grid" style="margin-left:auto">
      ${[1,2,3,4,5].map(n =>
        `<button type="button" class="energy-btn ${checkin.energy === n ? 'selected' : ''}" data-energy="${n}">${n}</button>`
      ).join('')}
    </div>
  </div>
</div>
```

**Storage:** Extend `saveCheckin()` to write `sleepHours`, `mood`, `energy` into the existing `np_checkin_YYYY-MM-DD` JSON object.

**`css/app.css`** — Add:
```css
.signal-row { display:flex; align-items:center; gap:10px; }
.signal-icon { font-size:1.1rem; flex-shrink:0; }
.signal-label { font-size:0.85rem; color:var(--text-dim); }
.mood-grid { display:flex; gap:5px; }
.mood-btn { width:32px; height:32px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface-low); font-size:1rem; cursor:pointer; transition:all var(--dur-fast) var(--ease-spring); }
.mood-btn.selected { border-color:rgba(212,245,60,0.5); background:var(--lime-15); transform:scale(1.1); }
.energy-grid { display:flex; gap:4px; }
.energy-btn { width:28px; height:28px; border-radius:6px; border:1.5px solid var(--border); background:var(--surface-low); font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:var(--text-dim); cursor:pointer; transition:all var(--dur-fast) var(--ease-spring); }
.energy-btn.selected { background:var(--lime-15); border-color:rgba(212,245,60,0.5); color:var(--text); }
```

---

## FEATURE 4 — Progress Page (New Tab)

**What it does:** Replaces the "Prep" slot in the nav OR adds as a 6th page accessed from Home. Shows: weight trend chart (full-size), body measurements log, week-by-week compliance summary, phase timeline with current week highlighted.

**Inspired by:** NutriGuide's progress dashboard, HEALTHSYNC's analytics.

### Files to create / change

**New file: `js/pages/progress.js`**

```js
import { t } from "../i18n.js";

export function mountProgress(root, profile, plan) {
  const weights     = JSON.parse(localStorage.getItem('np_weights') || '[]');
  const measures    = JSON.parse(localStorage.getItem('np_measurements') || '[]');
  const startWeight = profile.weight_kg;
  const lastWeight  = weights.length ? weights[weights.length-1].kg : startWeight;
  const change      = (lastWeight - startWeight).toFixed(1);
  const changeSign  = change > 0 ? '+' : '';

  root.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div class="ph-eyebrow">// Your progress</div>
        <div class="ph-title">Progress</div>
        <div class="ph-desc">Every 4 weeks take a front, side, and back photo. The comparison will motivate you more than the scale.</div>
      </div>

      <!-- Weight change summary -->
      <div class="home-stat-bar" style="margin-bottom:16px">
        <div class="home-stat-item">
          <span class="home-stat-val">${startWeight}</span>
          <span class="home-stat-lbl">Start kg</span>
        </div>
        <div class="home-stat-item">
          <span class="home-stat-val" style="color:${change <= 0 ? 'var(--accent-lime)' : 'var(--accent-orange)'}">
            ${changeSign}${change}
          </span>
          <span class="home-stat-lbl">Change kg</span>
        </div>
        <div class="home-stat-item">
          <span class="home-stat-val">${lastWeight}</span>
          <span class="home-stat-lbl">Current kg</span>
        </div>
      </div>

      <!-- Weight chart (rendered inline SVG) -->
      <div class="section-eyebrow">Weight Trend</div>
      <div class="glass" style="padding:16px;margin-bottom:14px">
        ${renderWeightChart(weights, startWeight)}
        ${renderWeightInput()}
      </div>

      <!-- Body measurements -->
      <div class="section-eyebrow">Body Measurements</div>
      <div class="glass" style="padding:16px;margin-bottom:14px">
        ${renderMeasurements(measures)}
      </div>

      <!-- Phase timeline -->
      <div class="section-eyebrow">Phase Timeline</div>
      ${renderPhaseTimeline(plan, profile)}
    </div>`;

  wirProgress(root, profile, plan);
}
```

**Helper functions in `progress.js`:**
```js
function renderWeightChart(weights, startWeight) {
  if (weights.length < 2) {
    return `<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:16px 0">
      Log at least 2 weigh-ins to see your trend chart.</p>`;
  }
  const last16 = weights.slice(-16);
  const vals   = last16.map(w => w.kg);
  const dates  = last16.map(w => w.date.slice(5)); // MM-DD
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;
  const W = 320, H = 100, padL = 32, padR = 8, padT = 8, padB = 20;
  const xScale = i => padL + (i / (vals.length - 1)) * (W - padL - padR);
  const yScale = v => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const line = vals.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');

  // Y-axis labels
  const yLabels = [min + 0.5, (min + max) / 2, max - 0.5].map(v =>
    `<text x="${padL - 4}" y="${yScale(v) + 4}" text-anchor="end" font-size="9" fill="rgba(255,255,255,0.3)">${v.toFixed(1)}</text>`
  ).join('');

  // X-axis labels (first and last)
  const xLabels = `
    <text x="${xScale(0)}" y="${H}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.3)">${dates[0]}</text>
    <text x="${xScale(vals.length-1)}" y="${H}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.3)">${dates[dates.length-1]}</text>`;

  const dots = vals.map((v, i) =>
    `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="${i === vals.length-1 ? 4 : 2.5}"
      fill="${i === vals.length-1 ? 'var(--accent-lime)' : 'rgba(212,245,60,0.4)'}"/>`
  ).join('');

  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;overflow:visible">
    ${yLabels}${xLabels}
    <polyline points="${line}" fill="none" stroke="var(--accent-lime)" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}

function renderWeightInput() {
  return `<div style="display:flex;gap:8px;margin-top:12px">
    <input type="number" class="field" id="prog-weight-input" step="0.1" min="30" max="250"
      placeholder="Today's weight (kg)" style="flex:1;padding:10px 12px;font-size:0.9rem">
    <button type="button" class="btn btn-primary" id="prog-weight-btn"
      style="width:auto;padding:10px 18px;font-size:0.85rem">Log</button>
  </div>`;
}

function renderMeasurements(measures) {
  const last = measures[measures.length - 1] || {};
  return `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
    ${[['Waist','waist'],['Chest','chest'],['Arms','arms']].map(([lbl, key]) => `
      <div style="text-align:center">
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:900;color:var(--text)">${last[key] || '—'}</div>
        <div style="font-family:var(--font-mono);font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted)">${lbl} cm</div>
      </div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
    ${[['waist','Waist'],['chest','Chest'],['arms','Arms']].map(([key, lbl]) => `
      <input type="number" class="field" data-measure="${key}" step="0.5" min="20" max="200"
        placeholder="${lbl}" value="${last[key] || ''}" style="padding:8px 10px;font-size:0.85rem;text-align:center">`
    ).join('')}
  </div>
  <button type="button" class="btn btn-outline" id="log-measures-btn" style="margin-top:10px;font-size:0.85rem;padding:10px">
    Log Measurements
  </button>`;
}

function renderPhaseTimeline(plan, profile) {
  const start = new Date(plan.startDate || Date.now());
  const diff = Math.floor((Date.now() - start.getTime()) / (7 * 86400000));
  const weekNum = Math.max(1, diff + 1);
  const colors = ['var(--accent-lime)','var(--accent-teal)','var(--accent-orange)','var(--accent-purple)'];

  return `<div class="glass" style="padding:16px;margin-bottom:14px">
    ${(plan.phases || []).map((p, i) => {
      const isActive = weekNum >= (p.startWeek || 1) && weekNum <= (p.endWeek || 99);
      return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="width:4px;height:40px;border-radius:2px;background:${colors[i]};flex-shrink:0;
          ${isActive ? `box-shadow:0 0 12px ${colors[i]}` : 'opacity:0.3'}"></div>
        <div style="flex:1">
          <div style="font-family:var(--font-display);font-weight:700;font-size:0.9rem;color:${isActive ? 'var(--text)' : 'var(--text-muted)'}">
            Phase ${p.index} ${isActive ? '← current' : ''}
          </div>
          <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted)">
            ${t("phases.weeks", { n: p.weeks })} · ${p.calories} kcal
          </div>
        </div>
        <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:900;color:${isActive ? colors[i] : 'var(--text-muted)'}">
          ${p.macro.protein}g
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
```

**`js/app.js`** — Import and add to pages map:
```js
import { mountProgress } from "./pages/progress.js";
// in renderNav items array, replace 'prep' or add as 7th:
["progress", "nav.progress"]
// in pages map:
progress: mountProgress
```

**`js/i18n.js`** — Add `"nav.progress": "Progress"` to all three languages.

**`app.html`** — The nav auto-renders from `app.js`, no HTML changes needed.

---

## FEATURE 5 — Supplement Adherence Log

**What it does:** Each supplement card on the Supps page gets a "Taken today" toggle. Tapping marks it done. At the top, a "Today's adherence: X/Y" summary with a progress bar. Streak shown per supplement (how many days in a row taken).

**Inspired by:** HEALTHSYNC's medication adherence tracking.

### Files to change

**`js/pages/supps.js`** — Add at top of file:
```js
const SUPP_LOG_KEY = `np_supp_log_${new Date().toISOString().slice(0,10)}`;
function getSuppLog() { return JSON.parse(localStorage.getItem(SUPP_LOG_KEY) || '{}'); }
function saveSuppLog(obj) { localStorage.setItem(SUPP_LOG_KEY, JSON.stringify(obj)); }
```

In `mountSupps()`, add a summary header:
```html
<div class="compliance-bar glass" style="margin-bottom:14px">
  <div class="compliance-row">
    <span class="section-eyebrow" style="margin:0">Today's Adherence</span>
    <span style="font-family:var(--font-display);font-weight:900;color:var(--accent-lime)">${taken}/${total}</span>
  </div>
  <div class="progress-track" style="margin-top:8px">
    <div class="progress-fill" style="width:${pct}%;animation:none;background:var(--gradient-lime)"></div>
  </div>
</div>
```

Add to each `supp-card`:
```html
<button type="button" class="supp-taken-btn ${log[s.id] ? 'taken' : ''}" data-supp="${s.id}">
  ${log[s.id] ? '✓ Taken today' : 'Mark taken'}
</button>
```

**`css/app.css`** — Add:
```css
.supp-taken-btn {
  width: 100%;
  margin-top: 10px;
  padding: 9px;
  border-radius: var(--radius-btn);
  border: 1.5px solid var(--border-mid);
  background: var(--surface-low);
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-spring);
}
.supp-taken-btn.taken {
  background: var(--teal-15);
  border-color: rgba(62,255,200,0.4);
  color: var(--accent-teal);
}
```

---

## FEATURE 6 — Meal Swap / Alternatives

**What it does:** Each meal card gets a "Swap ↕" button. Tapping shows 2–3 alternative meals for the same slot and diet type. The user picks one and it persists as their chosen meal for that day/slot in localStorage.

**Inspired by:** ai_meal_planner's smart recipe recommendations.

### Files to change

**`js/plangen.js`** — Add a new export:
```js
export function getAlternativeMeals(profile, slot, currentMealId) {
  // Filter MEAL_TEMPLATES[profile.dietType][slot]
  // Return up to 3 meals that are NOT currentMealId
  return MEAL_TEMPLATES[profile.dietType]
    ?.filter(m => m.slot === slot && m.id !== currentMealId)
    .slice(0, 3) || [];
}
```

**`js/pages/meals.js`** — Add swap button to each meal card:
```html
<button type="button" class="meal-swap-btn" data-slot="${m.slot}" data-current="${m.id}">
  ↕ Swap
</button>
```

Add a swap drawer (rendered at bottom of page):
```html
<div class="swap-drawer glass" id="swap-drawer" style="display:none">
  <div class="section-eyebrow" style="margin-bottom:10px">Alternative meals</div>
  <div id="swap-options"></div>
  <button type="button" class="btn btn-ghost" id="swap-close">Cancel</button>
</div>
```

**Storage:** `np_meal_swaps_YYYY-MM-DD` — JSON object of `{slot: mealId}` overrides.

**`css/app.css`** — Add:
```css
.meal-swap-btn { padding:6px 14px; border-radius:var(--radius-pill); border:1.5px solid var(--border); background:var(--surface-low); color:var(--text-muted); font-size:0.75rem; font-weight:700; cursor:pointer; margin-top:8px; transition:all var(--dur-fast) ease; }
.meal-swap-btn:active { background:var(--surface-high); }
.swap-drawer { padding:16px; margin-top:14px; }
```

---

## FEATURE 7 — Web Push Reminders

**What it does:** After onboarding, prompt user to enable push notifications. Schedule reminders for: each meal time, supplement schedule, water goal at 8 PM if < 6 glasses logged.

**Inspired by:** HEALTHSYNC's multi-channel alert system, Acara Plate's health signals.

### Files to change

**`sw.js`** — Add push event handler:
```js
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'NutriPal', {
      body: data.body || '',
      icon: 'assets/icons/icon-192.png',
      badge: 'assets/icons/icon-192.png',
      tag: data.tag || 'nutripal',
      data: { url: data.url || '/app.html' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/app.html'));
});
```

**New file: `js/notifications.js`**
```js
const MEAL_REMINDERS = [
  { tag: 'breakfast',   title: 'Breakfast time', body: "Morning fuel — don't skip it.",  hour: 7,  min: 0  },
  { tag: 'mid_morning', title: 'Mid-morning',     body: "Yogurt + whey. 2 minutes.",      hour: 10, min: 0  },
  { tag: 'lunch',       title: 'Lunch',           body: "Chicken + rice from your Tiffin.", hour: 13, min: 0 },
  { tag: 'pre_workout', title: 'Pre-workout',      body: "Nitro Surge in 30 min.",         hour: 16, min: 0  },
  { tag: 'post_workout',title: 'Post-workout',     body: "Whey + creatine. Now.",          hour: 19, min: 30 },
  { tag: 'bedtime',     title: 'Before bed',       body: "Ashwagandha + magnesium.",       hour: 22, min: 30 },
];

export async function requestPushPermission() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export function scheduleLocalReminders() {
  // Uses setTimeout to schedule within the current session
  // For persistent reminders, a backend push server is needed
  // This is the client-side version
  const now = new Date();
  MEAL_REMINDERS.forEach(r => {
    const target = new Date(now);
    target.setHours(r.hour, r.min, 0, 0);
    const delay = target - now;
    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(r.title, { body: r.body, icon: 'assets/icons/icon-192.png', tag: r.tag });
        }
      }, delay);
    }
  });
}
```

**`js/app.js`** — After `render()` call, add:
```js
import { requestPushPermission, scheduleLocalReminders } from './notifications.js';
// Run after first load if permission not yet asked:
if (localStorage.getItem('np_push_asked') !== '1') {
  setTimeout(async () => {
    const granted = await requestPushPermission();
    if (granted) scheduleLocalReminders();
    localStorage.setItem('np_push_asked', '1');
  }, 3000);
} else if (Notification.permission === 'granted') {
  scheduleLocalReminders();
}
```

---

## FEATURE 8 — Food Database Search (Quick Lookup)

**What it does:** A searchable nutrition lookup. User types a food name, sees calories/protein/carbs/fat per 100g and per serving. Can tap to add to today's food log. Accessed via a "Tools" button on the home page or a search icon.

**Inspired by:** Acara Plate's food database, NutriGuide's meal search.

### Files to create

**New file: `js/data/foods.js`** — 100–150 most common foods with nutrition per 100g:
```js
export const FOODS = [
  { name: "Chicken breast (cooked)", kcal: 165, protein: 31, carbs: 0,  fat: 3.6 },
  { name: "Basmati rice (cooked)",   kcal: 130, protein: 2.7,carbs: 28, fat: 0.3 },
  { name: "Eggs (whole, large)",     kcal: 143, protein: 13, carbs: 1,  fat: 10  },
  { name: "Greek yogurt (plain 2%)", kcal: 59,  protein: 10, carbs: 3.6,fat: 0.4 },
  { name: "Whey protein (1 scoop)",  kcal: 120, protein: 24, carbs: 3,  fat: 1.5 },
  { name: "Sweet potato (baked)",    kcal: 86,  protein: 1.6,carbs: 20, fat: 0.1 },
  { name: "Banana (medium)",        kcal: 89,  protein: 1.1,carbs: 23, fat: 0.3 },
  { name: "Oats (dry)",             kcal: 389, protein: 17, carbs: 66, fat: 7   },
  { name: "Paneer (100g)",          kcal: 265, protein: 18, carbs: 1.2,fat: 20  },
  { name: "Lentils (cooked)",       kcal: 116, protein: 9,  carbs: 20, fat: 0.4 },
  { name: "Tofu (firm)",            kcal: 76,  protein: 8,  carbs: 1.9,fat: 4.8 },
  { name: "Almonds (28g handful)",  kcal: 164, protein: 6,  carbs: 6,  fat: 14  },
  { name: "Olive oil (1 tbsp)",     kcal: 119, protein: 0,  carbs: 0,  fat: 13.5},
  { name: "Broccoli (steamed)",     kcal: 35,  protein: 2.4,carbs: 7,  fat: 0.4 },
  { name: "Whole wheat bread (1sl)",kcal: 81,  protein: 4,  carbs: 15, fat: 1.1 },
  // ... extend to 100+ foods
];
```

**New file: `js/pages/tools.js`** — Food search page:
```js
import { FOODS } from '../data/foods.js';

export function mountTools(root, profile, plan) {
  let query = '';

  function renderInner() {
    const results = query.length < 2
      ? FOODS.slice(0, 12)
      : FOODS.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 20);

    root.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="ph-eyebrow">// Nutrition lookup</div>
          <div class="ph-title">Food Search</div>
          <div class="ph-desc">Search any food to see its nutrition per 100g.</div>
        </div>
        <input class="field" id="food-search" placeholder="Search chicken, rice, eggs…" value="${query}" autofocus>
        <div id="food-results" style="margin-top:14px">
          ${results.map(f => `
            <div class="food-result-card glass" style="padding:14px 16px;margin-bottom:8px;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center">
              <div>
                <div style="font-family:var(--font-display);font-size:0.9rem;font-weight:700;color:var(--text)">${f.name}</div>
                <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted);margin-top:2px">per 100g</div>
              </div>
              <div style="text-align:right">
                <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:900;color:var(--accent-lime)">${f.kcal}</div>
                <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-muted)">kcal</div>
              </div>
              <div style="grid-column:1/-1;display:flex;gap:12px">
                <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent-teal)">P ${f.protein}g</span>
                <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent-lime)">C ${f.carbs}g</span>
                <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent-orange)">F ${f.fat}g</span>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    document.getElementById('food-search')?.addEventListener('input', e => {
      query = e.target.value;
      renderInner();
    });
  }

  renderInner();
}
```

**`js/app.js`** — Add Tools to nav (or as a floating button on home page):
```js
import { mountTools } from './pages/tools.js';
// Add ["tools", "nav.tools"] to nav items
// Add tools: mountTools to pages map
```

---

## FEATURE 9 — Body Composition Display

**What it does:** On the Progress page (Feature 4), show BMI, estimated body fat % (using Navy Method if measurements logged, or Deurenberg formula if not), and lean mass / fat mass split. No input needed — calculated from profile.

**Inspired by:** NutriGuide's analytics, HEALTHSYNC's health dashboard.

### Files to change

**`js/pages/progress.js`** — Add calculation section:

```js
function calcBodyComp(profile, measures) {
  const { weight_kg: w, height_cm: h, age, sex } = profile;
  const bmi = w / ((h / 100) ** 2);

  // Deurenberg body fat estimate (no measurements needed)
  const bfPct = sex === 'female'
    ? (1.20 * bmi) + (0.23 * age) - 5.4
    : (1.20 * bmi) + (0.23 * age) - 16.2;

  const fatMass  = (bfPct / 100) * w;
  const leanMass = w - fatMass;

  return {
    bmi: bmi.toFixed(1),
    bfPct: Math.max(3, bfPct).toFixed(1),
    fatMass: fatMass.toFixed(1),
    leanMass: leanMass.toFixed(1),
  };
}

// BMI category
function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'var(--accent-teal)' };
  if (bmi < 25.0) return { label: 'Normal',      color: 'var(--accent-lime)' };
  if (bmi < 30.0) return { label: 'Overweight',  color: 'var(--accent-orange)' };
  return { label: 'Obese', color: 'var(--accent-orange)' };
}
```

Render as a 2x2 stat grid inside a glass card.

---

## FEATURE 10 — Progress Photo Reminder

**What it does:** Every 28 days (4 weeks), a banner appears on the home page: "Week X photo due today. Front · Side · Back. Same lighting as last time." Dismissable. Date of dismissal stored so it won't show again until next cycle.

### Files to change

**`js/pages/home.js`** — Add at the top of `mountHome()`:

```js
const PHOTO_KEY  = 'np_photo_dismissed';
const startDate  = new Date(plan.startDate || localStorage.getItem('np_start') || Date.now());
const daysSince  = Math.floor((Date.now() - startDate.getTime()) / 86400000);
const weekNum    = Math.floor(daysSince / 7) + 1;
const photoDue   = weekNum % 4 === 0;  // due on weeks 4, 8, 12, 16
const dismissed  = localStorage.getItem(PHOTO_KEY) === String(weekNum);
const showPhotoBanner = photoDue && !dismissed;
```

Add banner HTML before the hero:
```html
${showPhotoBanner ? `
  <div class="photo-banner glass" id="photo-banner">
    <div style="display:flex;align-items:center;gap:12px">
      <span style="font-size:1.4rem">📸</span>
      <div style="flex:1">
        <div style="font-family:var(--font-display);font-weight:700;font-size:0.9rem;color:var(--text)">Week ${weekNum} progress photo due</div>
        <div style="font-size:0.78rem;color:var(--text-dim);margin-top:2px">Front · Side · Back. Same lighting as always.</div>
      </div>
      <button type="button" class="photo-dismiss" data-week="${weekNum}" style="color:var(--text-muted);background:none;border:none;font-size:1.2rem;cursor:pointer">×</button>
    </div>
  </div>` : ''}
```

**`css/app.css`** — Add:
```css
.photo-banner { padding:14px 16px; margin-bottom:12px; border-color:rgba(212,245,60,0.25); }
```

Wire dismiss button to set `localStorage.setItem('np_photo_dismissed', weekNum)`.

---

## FEATURE 11 — Profile Edit in Settings

**What it does:** The settings panel currently only lets users change language. Extend it to let users update: current weight (recalculates plan calorie targets), training days, and city. Changing weight re-runs `generatePlan()` and saves the new plan.

### Files to change

**`js/app.js`** — In `setupSettings()`, add edit fields to the settings sheet HTML in `app.html`:

**`app.html`** — Replace/extend the settings sheet:
```html
<div class="glass settings-sheet">
  <h2 id="settings-title">Settings</h2>

  <div style="margin:16px 0">
    <label class="label">Language</label>
    <div class="lang-grid" style="margin-top:8px">
      <button type="button" class="glass lang-card" data-set-lang="en"><h2>English</h2></button>
      <button type="button" class="glass lang-card" data-set-lang="hi"><h2>Hinglish</h2></button>
      <button type="button" class="glass lang-card" data-set-lang="gu"><h2>Gujlish</h2></button>
    </div>
  </div>

  <div style="margin:16px 0">
    <label class="label">Current weight (kg)</label>
    <input class="field" type="number" id="edit-weight" step="0.5" min="30" max="250">
  </div>

  <div style="margin:16px 0">
    <label class="label">Training days / week</label>
    <div class="option-grid cols-3" id="edit-train-days" style="margin-top:8px"></div>
  </div>

  <div style="margin:16px 0">
    <label class="label">City (for grocery tips)</label>
    <input class="field" type="text" id="edit-city" placeholder="e.g. Toronto">
  </div>

  <div class="footer-actions">
    <button type="button" class="btn btn-primary" id="settings-save">Save changes</button>
    <button type="button" class="btn btn-ghost" id="settings-close">Cancel</button>
  </div>
</div>
```

**`js/app.js`** — In `setupSettings()`, populate fields from profile and wire "Save changes" to update `np_profile` + re-run `generatePlan()` + re-render.

---

## FEATURE 12 — PWA Install Banner

**What it does:** After the user completes onboarding (redirected to `app.html`), if the app is not yet installed (not running in standalone mode), show a tasteful install banner after 5 seconds.

**Inspired by:** Acara Plate's install-to-home-screen focus, Acara Health Sync.

### Files to change

**`js/app.js`** — Add at bottom:

```js
// PWA Install prompt
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (localStorage.getItem('np_install_dismissed')) return;
  setTimeout(showInstallBanner, 5000);
});

function showInstallBanner() {
  if (!deferredInstallPrompt) return;
  const banner = document.createElement('div');
  banner.className = 'install-banner glass';
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:14px 16px">
      <div style="flex:1">
        <div style="font-family:var(--font-display);font-weight:900;font-size:0.9rem">Add to Home Screen</div>
        <div style="font-size:0.78rem;color:var(--text-dim);margin-top:2px">Install NutriPal for offline access & instant launch.</div>
      </div>
      <button type="button" class="btn btn-primary" id="install-btn" style="width:auto;padding:9px 16px;font-size:0.82rem">Install</button>
      <button type="button" id="install-dismiss" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;padding:4px">×</button>
    </div>`;
  document.body.appendChild(banner);
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') banner.remove();
    deferredInstallPrompt = null;
  });
  document.getElementById('install-dismiss')?.addEventListener('click', () => {
    localStorage.setItem('np_install_dismissed', '1');
    banner.remove();
  });
}
```

**`css/app.css`** — Add:
```css
.install-banner {
  position: fixed;
  bottom: calc(80px + var(--safe-bottom) + 12px);
  left: 12px;
  right: 12px;
  max-width: 480px;
  margin: 0 auto;
  z-index: 60;
  border-color: rgba(212,245,60,0.25);
  animation: pageIn var(--dur-slow) var(--ease-smooth) both;
}
```

---

## Implementation Order for the Next Agent

Do these in order. Each builds on the previous.

```
1. Feature 1  — Meal compliance (meals.js)           — Low risk, high value
2. Feature 2  — Weight log (home.js)                 — Low risk, high value
3. Feature 3  — Health signals (home.js)             — Low risk, quick win
4. Feature 5  — Supplement log (supps.js)            — Low risk, quick win
5. Feature 10 — Photo reminder (home.js)             — Low risk, quick win
6. Feature 9  — Body composition (home.js or new)    — Low risk, formulaic
7. Feature 12 — Install banner (app.js)              — Low risk, PWA polish
8. Feature 4  — Progress page (new file)             — Medium risk, high value
9. Feature 11 — Profile edit (app.js + app.html)     — Medium risk
10. Feature 6 — Meal swap (meals.js + plangen.js)    — Medium risk
11. Feature 8  — Food database (new files)           — Medium risk, lots of data
12. Feature 7  — Push notifications (sw.js + new)    — High risk (browser APIs)
```

---

---

*Feature Plan v1 — May 2026. All features are localStorage-only, no server required. Built for static PWA deployment.*
