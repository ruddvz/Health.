import { t } from "../i18n.js";
import { buildDayMeals } from "../plangen.js";
import { todayKey, getFoodTotals } from "../foodLog.js";
import { getWeights, logWeight } from "../weightStore.js";
import { getSwapOverride } from "../mealSwap.js";

const WATER_KEY = "np_water_";
const CHECKIN_KEY = "np_checkin_";
const STREAK_KEY = "np_streak";
const PHOTO_DISMISS_KEY = "np_photo_dismissed";

function renderWeightSection(profile) {
  const weights = getWeights();
  const today = todayKey();
  const todayEntry = weights.find((w) => w.date === today);
  const spark =
    weights.length >= 2
      ? (() => {
          const last8 = weights.slice(-8);
          const vals = last8.map((w) => w.kg);
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          const range = max - min || 1;
          const W = 120;
          const H = 32;
          const pad = 4;
          const points = vals
            .map((v, i) => {
              const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
              const y = H - pad - ((v - min) / range) * (H - pad * 2);
              return `${x},${y}`;
            })
            .join(" ");
          const trend = vals[vals.length - 1] - vals[0];
          const trendIcon = trend < -0.2 ? "↓" : trend > 0.2 ? "↑" : "→";
          const trendColor =
            trend < -0.2 ? "var(--accent-lime)" : trend > 0.2 ? "var(--accent-orange)" : "var(--accent-teal)";
          const dots = vals
            .map((v, i) => {
              const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
              const y = H - pad - ((v - min) / range) * (H - pad * 2);
              return `<circle cx="${x}" cy="${y}" r="2.5" fill="var(--accent-lime)"/>`;
            })
            .join("");
          return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span class="section-eyebrow" style="margin:0">${t("home.weight_log")}</span>
        <span style="font-family:var(--font-display);font-size:1.05rem;font-weight:900;color:${trendColor}">${vals[vals.length - 1]} kg ${trendIcon}</span>
      </div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:${H}px;overflow:visible;margin-bottom:10px" aria-hidden="true">
        <polyline points="${points}" fill="none" stroke="var(--accent-lime)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}
      </svg>`;
        })()
      : `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span class="section-eyebrow" style="margin:0">${t("home.weight_log")}</span>
      </div>`;

  const placeholder = todayEntry ? String(todayEntry.kg) : String(profile.weight_kg ?? "");

  return `
    <div class="weight-widget glass" id="weight-widget">
      ${spark}
      <div class="weight-input-row">
        <label class="weight-field">
          <span class="weight-field-lbl">${t("home.weight_kg")}</span>
          <input type="number" class="weight-input" id="weight-input" step="0.1" min="30" max="300" placeholder="${t("home.weight_ph")}" value="${placeholder}" />
        </label>
        <button type="button" class="btn btn-primary weight-save-btn" id="weight-save">${t("home.weight_save")}</button>
      </div>
    </div>`;
}

function greeting(profile) {
  const h = new Date().getHours();
  let key = "home.greeting_morning";
  if (h >= 12 && h < 17) key = "home.greeting_afternoon";
  if (h >= 17) key = "home.greeting_evening";
  return t(key, { name: profile.name });
}

function updateStreak() {
  const today = todayKey();
  let s = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"days":0,"last":""}');
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (s.last === today) return s.days;
  if (s.last === yesterday) { s.days += 1; }
  else if (s.last !== today) { s.days = 1; }
  s.last = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
  return s.days;
}

function getWater() {
  return parseInt(localStorage.getItem(WATER_KEY + todayKey()) || "0", 10);
}

function setWater(n) {
  localStorage.setItem(WATER_KEY + todayKey(), n);
}

function getCheckin() {
  return JSON.parse(localStorage.getItem(CHECKIN_KEY + todayKey()) || "{}");
}

function saveCheckin(obj) {
  localStorage.setItem(CHECKIN_KEY + todayKey(), JSON.stringify(obj));
}

function phaseForWeek(plan) {
  const start = new Date(plan.startDate || plan.generatedAt || Date.now());
  const diff = Math.floor((Date.now() - start.getTime()) / (7 * 86400000));
  const cap = plan.totalWeeks || 16;
  const weekNum = Math.max(1, Math.min(diff + 1, cap));
  let c = 1;
  for (const p of plan.phases || []) {
    const sw = p.startWeek ?? c;
    const ew = p.endWeek ?? sw + (p.weeks || 0) - 1;
    if (weekNum >= sw && weekNum <= ew) return { phase: p, weekNum };
    c = ew + 1;
  }
  return { phase: plan.phases?.[plan.phases.length - 1], weekNum };
}

export function mountHome(root, profile, plan) {
  const today = new Date().getDay();
  const monBased = today === 0 ? 6 : today - 1;
  const td = Math.min(Math.max(profile.trainingDays || 4, 1), 7);
  const isWorkout = monBased < td;
  const meals = buildDayMeals(profile, monBased, plan.targetCalories, { forceRest: !isWorkout }).map((bm) => {
    const sw = getSwapOverride(monBased, bm.slot);
    return { ...bm, name: sw || bm.name };
  });

  const streak   = updateStreak();
  let water      = getWater();
  const checkin  = getCheckin();
  const GLASSES  = 8;

  const { weekNum } = phaseForWeek(plan);
  const totalWeeks  = profile.durationWeeks || 16;
  const weekPct     = Math.round((weekNum / totalWeeks) * 100);

  const food = getFoodTotals();
  const mp = plan.macro?.protein || 1;
  const mc = plan.macro?.carbs || 1;
  const mf = plan.macro?.fat || 1;
  const proteinPct = Math.min(100, Math.round((food.protein / mp) * 100));
  const carbPct = Math.min(100, Math.round((food.carbs / mc) * 100));
  const fatPct = Math.min(100, Math.round((food.fat / mf) * 100));

  const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dayType   = isWorkout
    ? `<span style="color:var(--accent-lime)">Workout day</span> — ${dayLabels[today]}`
    : `<span style="color:var(--accent-teal)">Rest day</span> — ${dayLabels[today]}`;

  const scheduleItems = meals.map(m => `
    <div class="schedule-item">
      <div class="schedule-dot"></div>
      <div class="schedule-name">${m.name}</div>
      <div class="schedule-time">${t("slots." + m.slot)}</div>
    </div>`).join("");

  const habits = [
    { id: "workout",   label: isWorkout ? "Hit the gym" : "Active rest / walk", icon: "🏋️" },
    { id: "prep",      label: "Meals prepped / packed",                          icon: "🥡" },
    { id: "supps",     label: "Supplements taken",                               icon: "💊" },
    { id: "water",     label: "3L water goal",                                   icon: "💧" },
  ];

  const habitHTML = habits.map(h => {
    const done = !!checkin[h.id];
    return `
      <button type="button" class="habit-item ${done ? "done" : ""}" data-habit="${h.id}">
        <span class="habit-icon">${h.icon}</span>
        <span class="habit-label">${h.label}</span>
        <span class="habit-check">${done ? "✓" : ""}</span>
      </button>`;
  }).join("");

  const glassHTML = Array.from({ length: GLASSES }, (_, i) => `
    <button type="button" class="water-glass ${i < water ? "filled" : ""}" data-glass="${i}"></button>`
  ).join("");

  const coachTips = [
    "Take your Week 1 photo today — same lighting every 4 weeks. The comparison is more motivating than the scale.",
    "3L of water isn't optional. Dehydration stalls fat loss and kills gym performance.",
    "Eating is part of the programme. Skipping meals when cutting is how you lose muscle, not fat.",
    "Sleep 7–9 hrs. Growth hormone peaks between 11 PM and 3 AM. This is when you actually build muscle.",
    "Weigh yourself same time, same day each week. Daily weight swings are water — not fat.",
    "Add 10 minutes of walking after dinner. It significantly improves insulin sensitivity overnight.",
  ];
  const tip = coachTips[new Date().getDay() % coachTips.length];

  const photoDismissed = localStorage.getItem(PHOTO_DISMISS_KEY);
  const photoDue = weekNum > 0 && weekNum % 4 === 0;
  const showPhotoBanner = photoDue && photoDismissed !== String(weekNum);

  root.innerHTML = `
    <div class="page-enter">

      ${showPhotoBanner ? `
      <div class="photo-banner glass" id="photo-banner">
        <div class="photo-banner-inner">
          <span class="photo-banner-icon" aria-hidden="true">📸</span>
          <div class="photo-banner-copy">
            <div class="photo-banner-title">${t("home.photo_title", { week: weekNum })}</div>
            <div class="photo-banner-sub">${t("home.photo_sub")}</div>
          </div>
          <button type="button" class="photo-dismiss" id="photo-dismiss" data-week="${weekNum}" aria-label="${t("home.photo_dismiss")}">×</button>
        </div>
      </div>` : ""}

      <!-- Hero -->
      <div class="home-hero">
        <div class="home-greeting">${greeting(profile)}</div>
        <div class="home-name">${profile.name}.</div>
        <div class="home-stat-bar">
          <div class="home-stat-item">
            <span class="home-stat-val">${profile.weight_kg}</span>
            <span class="home-stat-lbl">kg</span>
          </div>
          <div class="home-stat-item">
            <span class="home-stat-val">${weekNum}<span style="font-size:0.95rem;font-weight:500;opacity:0.45">/${totalWeeks}</span></span>
            <span class="home-stat-lbl">Week</span>
          </div>
          <div class="home-stat-item">
            <span class="home-stat-val">${plan.macro?.protein || 0}g</span>
            <span class="home-stat-lbl">Protein</span>
          </div>
        </div>
      </div>

      <!-- Weight log -->
      <div class="section-eyebrow" style="margin-top:4px">${t("home.weight_section")}</div>
      ${renderWeightSection(profile)}

      <!-- Streak + progress -->
      <div class="streak-row">
        <span class="streak-icon">🔥</span>
        <div class="streak-text">
          <strong>${streak} day streak</strong>
          <div>Keep showing up — consistency is the entire game.</div>
        </div>
        <span class="streak-badge">${streak > 0 ? "Active" : "Start today"}</span>
      </div>

      <!-- Plan progress bar -->
      <div class="progress-card">
        <div class="progress-card-head">
          <span class="progress-card-title">Plan Progress</span>
          <span class="progress-card-label">Week ${weekNum} of ${totalWeeks} · ${food.kcal}/${plan.targetCalories ?? 0} ${t("home.kcal_today")}</span>
        </div>
        <div class="progress-week-bar">
          <div class="progress-week-fill" style="width:${weekPct}%"></div>
        </div>
        <div class="progress-ticks">
          <span class="progress-tick">Start</span>
          <span class="progress-tick">${Math.round(totalWeeks / 4)}wk</span>
          <span class="progress-tick">${Math.round(totalWeeks / 2)}wk</span>
          <span class="progress-tick">${Math.round(totalWeeks * 0.75)}wk</span>
          <span class="progress-tick">End</span>
        </div>

        <!-- Macros vs today's log -->
        <div class="macro-bars" style="margin-top:16px">
          <div class="macro-bar-row">
            <span class="macro-bar-label">Protein</span>
            <div class="macro-bar-track"><div class="macro-bar-fill protein" style="width:${proteinPct}%"></div></div>
            <span class="macro-bar-val">${Math.round(food.protein)}/${plan.macro?.protein || 0}g</span>
          </div>
          <div class="macro-bar-row">
            <span class="macro-bar-label">Carbs</span>
            <div class="macro-bar-track"><div class="macro-bar-fill carbs" style="width:${carbPct}%"></div></div>
            <span class="macro-bar-val">${Math.round(food.carbs)}/${plan.macro?.carbs || 0}g</span>
          </div>
          <div class="macro-bar-row">
            <span class="macro-bar-label">Fat</span>
            <div class="macro-bar-track"><div class="macro-bar-fill fat" style="width:${fatPct}%"></div></div>
            <span class="macro-bar-val">${Math.round(food.fat)}/${plan.macro?.fat || 0}g</span>
          </div>
        </div>
      </div>

      <!-- Today's schedule -->
      <div class="section-eyebrow">Today · ${dayType}</div>
      <div class="schedule-card">
        ${scheduleItems || `<div class="schedule-item"><div class="schedule-name" style="color:var(--text-dim)">Rest day — no training meals</div></div>`}
      </div>

      <!-- Water tracker -->
      <div class="water-tracker">
        <div class="water-glasses" id="water-glasses">${glassHTML}</div>
        <div>
          <div class="water-count" id="water-count">${water}/${GLASSES}</div>
          <div class="water-label">glasses</div>
        </div>
      </div>

      <!-- Daily habits checkin -->
      <div class="section-eyebrow">Daily Check-in</div>
      <div class="habit-list glass" id="habit-list">
        ${habitHTML}
      </div>

      <div class="glass signals-card">
        <div class="section-eyebrow signals-card-title">${t("home.signals_title")}</div>

        <div class="signal-row">
          <span class="signal-icon" aria-hidden="true">😴</span>
          <span class="signal-label">${t("home.signal_sleep")}</span>
          <div class="signal-sleep-input">
            <input type="number" class="weight-input signal-input" id="sleep-hrs" min="0" max="14" step="0.5"
              placeholder="—" value="${checkin.sleepHours != null && checkin.sleepHours !== "" ? checkin.sleepHours : ""}" />
            <span class="signal-hint">hrs</span>
          </div>
        </div>

        <div class="signal-row signal-row--wrap">
          <span class="signal-icon" aria-hidden="true">😊</span>
          <span class="signal-label">${t("home.signal_mood")}</span>
          <div class="mood-grid">
            ${["😫", "😔", "😐", "😊", "🤩"]
              .map(
                (e, i) =>
                  `<button type="button" class="mood-btn ${checkin.mood === i ? "selected" : ""}" data-mood="${i}" aria-pressed="${checkin.mood === i}">${e}</button>`
              )
              .join("")}
          </div>
        </div>

        <div class="signal-row signal-row--wrap">
          <span class="signal-icon" aria-hidden="true">⚡</span>
          <span class="signal-label">${t("home.signal_energy")}</span>
          <div class="energy-grid">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) =>
                  `<button type="button" class="energy-btn ${checkin.energy === n ? "selected" : ""}" data-energy="${n}" aria-pressed="${checkin.energy === n}">${n}</button>`
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Quick nav -->
      <div class="section-eyebrow" style="margin-top:24px">Quick Access</div>
      <div class="quick-grid">
        <button type="button" class="glass quick-card" data-go="phases">
          <span class="qc-icon">📅</span>
          <div class="qc-title">${t("nav.phases")}</div>
          <div class="qc-sub">Week-by-week plan</div>
          <span class="qc-arrow">›</span>
        </button>
        <button type="button" class="glass quick-card" data-go="meals">
          <span class="qc-icon">🍽</span>
          <div class="qc-title">${t("nav.meals")}</div>
          <div class="qc-sub">Every meal, every day</div>
          <span class="qc-arrow">›</span>
        </button>
        <button type="button" class="glass quick-card" data-go="grocery">
          <span class="qc-icon">🛒</span>
          <div class="qc-title">${t("nav.grocery")}</div>
          <div class="qc-sub">Tap to check off</div>
          <span class="qc-arrow">›</span>
        </button>
        <button type="button" class="glass quick-card" data-go="supps">
          <span class="qc-icon">💊</span>
          <div class="qc-title">${t("nav.supps")}</div>
          <div class="qc-sub">Stack + timing</div>
          <span class="qc-arrow">›</span>
        </button>
        <button type="button" class="glass quick-card" data-go="progress">
          <span class="qc-icon">📊</span>
          <div class="qc-title">${t("nav.progress")}</div>
          <div class="qc-sub">${t("home.quick_progress")}</div>
          <span class="qc-arrow">›</span>
        </button>
        <button type="button" class="glass quick-card" data-go="tools">
          <span class="qc-icon">🔎</span>
          <div class="qc-title">${t("nav.tools")}</div>
          <div class="qc-sub">${t("home.quick_tools")}</div>
          <span class="qc-arrow">›</span>
        </button>
      </div>

      <!-- Coach tip -->
      <div class="section-eyebrow">Coach Tip</div>
      <div class="info-box info-box-lime" style="margin-bottom:8px">
        <strong>Today: </strong>${tip}
      </div>

      <div class="info-box info-box-orange" style="margin-bottom:28px">
        <strong>${plan.targetCalories} kcal</strong> target today.
        ${isWorkout ? "Workout day — eat all of it. Carbs fuel performance." : "Rest day — slightly lower carbs, same protein."}
      </div>

    </div>`;

  function bindWeightWidget() {
    root.querySelector("#weight-save")?.addEventListener("click", () => {
      const kg = parseFloat(root.querySelector("#weight-input")?.value || "");
      if (!Number.isFinite(kg) || kg < 20 || kg > 400) return;
      logWeight(kg);
      const slot = root.querySelector("#weight-widget");
      if (!slot) return;
      slot.outerHTML = renderWeightSection(profile);
      bindWeightWidget();
    });
  }
  bindWeightWidget();

  root.querySelector("#photo-dismiss")?.addEventListener("click", (e) => {
    const w = e.target?.closest("#photo-dismiss")?.dataset?.week;
    if (w != null) localStorage.setItem(PHOTO_DISMISS_KEY, String(w));
    document.getElementById("photo-banner")?.remove();
  });

  root.querySelector("#sleep-hrs")?.addEventListener("change", () => {
    const inp = root.querySelector("#sleep-hrs");
    const v = parseFloat(inp?.value || "");
    const cur = getCheckin();
    if (Number.isFinite(v) && v >= 0 && v <= 14) cur.sleepHours = v;
    else delete cur.sleepHours;
    saveCheckin(cur);
  });

  root.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cur = getCheckin();
      const i = +btn.dataset.mood;
      cur.mood = cur.mood === i ? undefined : i;
      saveCheckin(cur);
      root.querySelectorAll(".mood-btn").forEach((b) => {
        const on = +b.dataset.mood === cur.mood;
        b.classList.toggle("selected", on);
        b.setAttribute("aria-pressed", String(on));
      });
    });
  });

  root.querySelectorAll(".energy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cur = getCheckin();
      const n = +btn.dataset.energy;
      cur.energy = cur.energy === n ? undefined : n;
      saveCheckin(cur);
      root.querySelectorAll(".energy-btn").forEach((b) => {
        const on = +b.dataset.energy === cur.energy;
        b.classList.toggle("selected", on);
        b.setAttribute("aria-pressed", String(on));
      });
    });
  });

  // ── Water glasses ──
  root.querySelectorAll(".water-glass").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = +btn.dataset.glass;
      water = idx < water ? idx : idx + 1;
      water = Math.max(0, Math.min(GLASSES, water));
      setWater(water);
      root.querySelectorAll(".water-glass").forEach((g, i) => {
        g.classList.toggle("filled", i < water);
      });
      const cnt = document.getElementById("water-count");
      if (cnt) cnt.textContent = `${water}/${GLASSES}`;
    });
  });

  // ── Habit checkin ──
  root.querySelectorAll(".habit-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.habit;
      const cur = getCheckin();
      if (cur[key]) delete cur[key];
      else cur[key] = true;
      saveCheckin(cur);
      btn.classList.toggle("done", !!cur[key]);
      const chk = btn.querySelector(".habit-check");
      if (chk) chk.textContent = cur[key] ? "✓" : "";
    });
  });

  // ── Quick nav ──
  root.querySelectorAll("[data-go]").forEach((b) => {
    b.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("np-route", { detail: b.dataset.go }));
    });
  });
}
