import { t } from "../i18n.js";
import { buildDayMeals } from "../plangen.js";

const WATER_KEY   = "np_water_";
const CHECKIN_KEY = "np_checkin_";
const STREAK_KEY  = "np_streak";
const WEIGHT_KEY  = "np_weights";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
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
  const start = new Date(plan.startDate || Date.now());
  const diff = Math.floor((Date.now() - start.getTime()) / (7 * 86400000));
  const weekNum = Math.max(1, Math.min(diff + 1, plan.totalWeeks || 16));
  for (const p of plan.phases || []) {
    if (weekNum <= p.endWeek) return { phase: p, weekNum };
  }
  return { phase: plan.phases?.[plan.phases.length - 1], weekNum };
}

export function mountHome(root, profile, plan) {
  const today = new Date().getDay();
  const monBased = today === 0 ? 6 : today - 1;
  const td = Math.min(Math.max(profile.trainingDays || 4, 1), 7);
  const isWorkout = monBased < td;
  const meals = buildDayMeals(profile, monBased, plan.targetCalories, { forceRest: !isWorkout });

  const streak   = updateStreak();
  let water      = getWater();
  const checkin  = getCheckin();
  const GLASSES  = 8;

  const { weekNum } = phaseForWeek(plan);
  const totalWeeks  = profile.durationWeeks || 16;
  const weekPct     = Math.round((weekNum / totalWeeks) * 100);

  const proteinPct = Math.min(100, Math.round((plan.macro?.protein / plan.macro?.protein) * 100));
  const carbPct    = Math.min(100, Math.round(((plan.macro?.carbs || 0) / (plan.macro?.carbs || 1)) * 100));
  const fatPct     = Math.min(100, Math.round(((plan.macro?.fat || 0) / (plan.macro?.fat || 1)) * 100));

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

  root.innerHTML = `
    <div class="page-enter">

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
          <span class="progress-card-label">Week ${weekNum} of ${totalWeeks}</span>
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

        <!-- Macro targets -->
        <div class="macro-bars" style="margin-top:16px">
          <div class="macro-bar-row">
            <span class="macro-bar-label">Protein</span>
            <div class="macro-bar-track"><div class="macro-bar-fill protein" style="width:${proteinPct}%"></div></div>
            <span class="macro-bar-val">${plan.macro?.protein || 0}g</span>
          </div>
          <div class="macro-bar-row">
            <span class="macro-bar-label">Carbs</span>
            <div class="macro-bar-track"><div class="macro-bar-fill carbs" style="width:${carbPct}%"></div></div>
            <span class="macro-bar-val">${plan.macro?.carbs || 0}g</span>
          </div>
          <div class="macro-bar-row">
            <span class="macro-bar-label">Fat</span>
            <div class="macro-bar-track"><div class="macro-bar-fill fat" style="width:${fatPct}%"></div></div>
            <span class="macro-bar-val">${plan.macro?.fat || 0}g</span>
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
