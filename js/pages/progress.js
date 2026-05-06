import { t } from "../i18n.js";
import { todayKey, getFoodTotals } from "../foodLog.js";
import { getWeights, logWeight } from "../weightStore.js";

const MEASURE_KEY = "np_measurements";

function planWeekNum(plan, profile) {
  const start = new Date(plan.startDate || plan.generatedAt || Date.now());
  const diff = Math.floor((Date.now() - start.getTime()) / (7 * 86400000));
  const cap = plan.totalWeeks || profile.durationWeeks || 16;
  return Math.max(1, Math.min(diff + 1, cap));
}

function enrichPhases(plan) {
  let c = 1;
  return (plan.phases || []).map((p) => {
    const sw = p.startWeek ?? c;
    const ew = p.endWeek ?? sw + (p.weeks || 0) - 1;
    c = ew + 1;
    return { ...p, startWeek: sw, endWeek: ew };
  });
}

function getMeasures() {
  try {
    return JSON.parse(localStorage.getItem(MEASURE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveMeasures(arr) {
  localStorage.setItem(MEASURE_KEY, JSON.stringify(arr.slice(-52)));
}

function logMeasuresRow(waist, chest, arms) {
  const arr = getMeasures();
  const d = todayKey();
  const idx = arr.findIndex((x) => x.date === d);
  const row = { date: d, waist, chest, arms };
  if (idx >= 0) arr[idx] = { ...arr[idx], ...row };
  else arr.push(row);
  arr.sort((a, b) => a.date.localeCompare(b.date));
  saveMeasures(arr);
}

function renderWeightChart(weights, startWeight) {
  if (weights.length < 2) {
    return `<p class="progress-chart-empty">${t("progress.chart_need_two")}</p>`;
  }
  const last16 = weights.slice(-16);
  const vals = last16.map((w) => w.kg);
  const dates = last16.map((w) => w.date.slice(5));
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;
  const W = 320;
  const H = 100;
  const padL = 32;
  const padR = 8;
  const padT = 8;
  const padB = 20;
  const xScale = (i) => padL + (i / (vals.length - 1)) * (W - padL - padR);
  const yScale = (v) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const line = vals.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");

  const yMarks = [min + 0.5, (min + max) / 2, max - 0.5];
  const yLabels = yMarks
    .map((v) => `<text x="${padL - 4}" y="${yScale(v) + 4}" text-anchor="end" font-size="9" fill="rgba(255,255,255,0.3)">${v.toFixed(1)}</text>`)
    .join("");

  const xLabels = `
    <text x="${xScale(0)}" y="${H - 2}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.3)">${dates[0]}</text>
    <text x="${xScale(vals.length - 1)}" y="${H - 2}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.3)">${dates[dates.length - 1]}</text>`;

  const dots = vals
    .map(
      (v, i) =>
        `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="${i === vals.length - 1 ? 4 : 2.5}"
      fill="${i === vals.length - 1 ? "var(--accent-lime)" : "rgba(212,245,60,0.4)"}"/>`
    )
    .join("");

  return `<svg class="progress-chart-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    ${yLabels}${xLabels}
    <polyline points="${line}" fill="none" stroke="var(--accent-lime)" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}

function renderMeasurements(measures) {
  const last = measures[measures.length - 1] || {};
  return `<div class="measure-summary">
    ${[
      ["Waist", "waist"],
      ["Chest", "chest"],
      ["Arms", "arms"],
    ]
      .map(
        ([lbl, key]) => `
      <div class="measure-cell">
        <div class="measure-val">${last[key] != null ? last[key] : "—"}</div>
        <div class="measure-lbl">${lbl} cm</div>
      </div>`
      )
      .join("")}
  </div>
  <div class="measure-inputs">
    ${[
      ["waist", "Waist"],
      ["chest", "Chest"],
      ["arms", "Arms"],
    ]
      .map(
        ([key, lbl]) =>
          `<input type="number" class="weight-input measure-input" data-measure="${key}" step="0.5" min="20" max="200"
        placeholder="${lbl}" value="${last[key] != null ? last[key] : ""}" />`
      )
      .join("")}
  </div>
  <button type="button" class="btn btn-outline" id="log-measures-btn">${t("progress.log_measures")}</button>`;
}

function renderPhaseTimeline(plan, profile) {
  const weekNum = planWeekNum(plan, profile);
  const colors = ["var(--accent-lime)", "var(--accent-teal)", "var(--accent-orange)", "var(--accent-purple)"];
  const phases = enrichPhases(plan);

  return `<div class="glass progress-phase-card">
    ${phases
      .map((p, i) => {
        const isActive = weekNum >= p.startWeek && weekNum <= p.endWeek;
        const col = colors[i % colors.length];
        return `<div class="progress-phase-row">
        <div class="progress-phase-bar" style="background:${col};${isActive ? `box-shadow:0 0 12px ${col}` : "opacity:0.35"}"></div>
        <div class="progress-phase-body">
          <div class="progress-phase-title ${isActive ? "" : "muted"}">
            Phase ${p.index}${isActive ? ` · ${t("progress.current")}` : ""}
          </div>
          <div class="progress-phase-meta">
            ${t("phases.weeks", { n: p.weeks })} · ${p.calories} kcal · ${t("progress.weeks_range", { a: p.startWeek, b: p.endWeek })}
          </div>
        </div>
        <div class="progress-phase-protein">${p.macro?.protein ?? 0}g</div>
      </div>`;
      })
      .join("")}
  </div>`;
}

function renderComplianceStrip(profile, plan) {
  const rows = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `np_food_log_${d.toISOString().slice(0, 10)}`;
    let log = [];
    try {
      log = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      log = [];
    }
    const pct = Math.min(100, Math.round((log.length / 5) * 100));
    const label = d.toISOString().slice(5, 10);
    rows.push({ label, pct });
  }
  return `<div class="glass progress-compliance">
    <div class="section-eyebrow progress-inline-eyebrow">${t("progress.meal_compliance_week")}</div>
    <div class="compliance-strip">
      ${rows
        .map(
          (r) => `
        <div class="compliance-day">
          <div class="compliance-dot-track"><div class="compliance-dot-fill" style="height:${r.pct}%"></div></div>
          <span class="compliance-day-lbl">${r.label}</span>
        </div>`
        )
        .join("")}
    </div>
    <p class="progress-compliance-hint">${t("progress.compliance_hint")}</p>
  </div>`;
}

function renderBodyCompCard(profile, weightKg) {
  const h = profile.height_cm || 170;
  const age = profile.age || 30;
  const sex = profile.sex === "female" ? "female" : "male";
  const bmiRaw = weightKg / (h / 100) ** 2;
  const bmi = +bmiRaw.toFixed(1);
  let bfPct = sex === "female" ? 1.2 * bmiRaw + 0.23 * age - 5.4 : 1.2 * bmiRaw + 0.23 * age - 16.2;
  bfPct = Math.max(4, Math.min(55, bfPct));
  const fatMass = (bfPct / 100) * weightKg;
  const leanMass = weightKg - fatMass;

  let bmiLabel = "progress.bmi_normal";
  let bmiColor = "var(--accent-lime)";
  if (bmiRaw < 18.5) {
    bmiLabel = "progress.bmi_under";
    bmiColor = "var(--accent-teal)";
  } else if (bmiRaw < 25) {
    bmiLabel = "progress.bmi_normal";
  } else if (bmiRaw < 30) {
    bmiLabel = "progress.bmi_over";
    bmiColor = "var(--accent-orange)";
  } else {
    bmiLabel = "progress.bmi_obese";
    bmiColor = "var(--accent-orange)";
  }

  return `
      <div class="section-eyebrow">${t("progress.body_comp")}</div>
      <div class="glass body-comp-card">
        <p class="body-comp-note">${t("progress.body_comp_note")}</p>
        <div class="body-comp-grid">
          <div class="body-comp-cell">
            <div class="body-comp-val" style="color:${bmiColor}">${bmi}</div>
            <div class="body-comp-lbl">BMI · ${t(bmiLabel)}</div>
          </div>
          <div class="body-comp-cell">
            <div class="body-comp-val">${bfPct.toFixed(1)}%</div>
            <div class="body-comp-lbl">${t("progress.est_bf")}</div>
          </div>
          <div class="body-comp-cell">
            <div class="body-comp-val">${leanMass.toFixed(1)}</div>
            <div class="body-comp-lbl">${t("progress.lean_kg")}</div>
          </div>
          <div class="body-comp-cell">
            <div class="body-comp-val">${fatMass.toFixed(1)}</div>
            <div class="body-comp-lbl">${t("progress.fat_kg")}</div>
          </div>
        </div>
      </div>`;
}

export function mountProgress(root, profile, plan) {
  const weights = getWeights();
  const measures = getMeasures();
  const startWeight = profile.weight_kg;
  const lastWeight = weights.length ? weights[weights.length - 1].kg : startWeight;
  const change = +(lastWeight - startWeight).toFixed(1);
  const changeSign = change > 0 ? "+" : "";
  const food = getFoodTotals();
  const wn = planWeekNum(plan, profile);

  root.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div class="ph-eyebrow">// ${t("progress.eyebrow")}</div>
        <div class="ph-title">${t("nav.progress")}</div>
        <div class="ph-desc">${t("progress.intro")}</div>
      </div>

      <div class="home-stat-bar progress-stat-bar">
        <div class="home-stat-item">
          <span class="home-stat-val">${startWeight}</span>
          <span class="home-stat-lbl">${t("progress.start_kg")}</span>
        </div>
        <div class="home-stat-item">
          <span class="home-stat-val" style="color:${change <= 0 ? "var(--accent-lime)" : "var(--accent-orange)"}">
            ${changeSign}${change}
          </span>
          <span class="home-stat-lbl">${t("progress.delta_kg")}</span>
        </div>
        <div class="home-stat-item">
          <span class="home-stat-val">${lastWeight}</span>
          <span class="home-stat-lbl">${t("progress.current_kg")}</span>
        </div>
      </div>

      ${renderBodyCompCard(profile, lastWeight)}

      <div class="info-box info-box-lime progress-food-summary">
        <strong>${t("progress.today_logged")}</strong> ${food.kcal} / ${plan.targetCalories ?? "—"} kcal · ${t("progress.week_label")} ${wn}
      </div>

      ${renderComplianceStrip(profile, plan)}

      <div class="section-eyebrow">${t("progress.weight_trend")}</div>
      <div class="glass progress-chart-card">
        ${renderWeightChart(weights, startWeight)}
        <div class="weight-input-row progress-weight-row">
          <label class="weight-field">
            <span class="weight-field-lbl">${t("progress.weight_input_lbl")}</span>
            <input type="number" class="weight-input" id="prog-weight-input" step="0.1" min="20" max="400" placeholder="${t("home.weight_ph")}" />
          </label>
          <button type="button" class="btn btn-primary weight-save-btn" id="prog-weight-btn">${t("home.weight_save")}</button>
        </div>
      </div>

      <div class="section-eyebrow">${t("progress.measurements")}</div>
      <div class="glass progress-measure-card">
        ${renderMeasurements(measures)}
      </div>

      <div class="section-eyebrow">${t("progress.phase_timeline")}</div>
      ${renderPhaseTimeline(plan, profile)}
    </div>`;

  root.querySelector("#prog-weight-btn")?.addEventListener("click", () => {
    const kg = parseFloat(root.querySelector("#prog-weight-input")?.value || "");
    if (!Number.isFinite(kg) || kg < 20 || kg > 400) return;
    logWeight(kg);
    mountProgress(root, profile, plan);
  });

  root.querySelector("#log-measures-btn")?.addEventListener("click", () => {
    const w = parseFloat(root.querySelector('[data-measure="waist"]')?.value || "");
    const c = parseFloat(root.querySelector('[data-measure="chest"]')?.value || "");
    const a = parseFloat(root.querySelector('[data-measure="arms"]')?.value || "");
    if (![w, c, a].every((x) => Number.isFinite(x) && x > 0)) return;
    logMeasuresRow(w, c, a);
    mountProgress(root, profile, plan);
  });
}
