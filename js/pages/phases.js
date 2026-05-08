import { t } from "../i18n.js";
import { effectiveCalorieGoal, effectiveMacros } from "../effectiveTargets.js";

const PHASE_COLORS = ["1", "2", "3", "4"];

const PHASE_NAMES = [
  "Reset & Foundation",
  "Adaptation & Momentum",
  "Build & Burn",
  "Peak & Lock In",
];

const PHASE_ICONS = ["🌱", "📈", "🔥", "🏆"];

export function mountPhases(root, profile, plan) {
  const cards = (plan.phases || []).map((p, idx) => {
    const col  = PHASE_COLORS[idx % 4];
    const name = p.name || PHASE_NAMES[idx] || `Phase ${p.index}`;
    const icon = PHASE_ICONS[idx % 4];

    return `
    <div class="phase-card phase-card--${col} page-enter" style="animation-delay:${idx * 60}ms">
      <div class="phase-bg-num">${p.index}</div>
      <div class="phase-top-row">
        <div>
          <div class="phase-num-label">Phase ${String(p.index).padStart(2, "0")}</div>
          <div class="phase-name">${icon} ${name}</div>
        </div>
        <div class="phase-badge phase-badge--${col}">${t("phases.weeks", { n: p.weeks })}</div>
      </div>
      <div class="phase-kcal">
        <span class="phase-kcal-val">${p.calories.toLocaleString()}</span>
        <span class="phase-kcal-unit">kcal / day</span>
      </div>
      <div class="phase-focus-text">${p.focus}</div>
      <div class="macro-grid">
        <div class="macro-chip">
          <span class="macro-chip-val">${p.macro.protein}g</span>
          <span class="macro-chip-lbl">Protein</span>
        </div>
        <div class="macro-chip">
          <span class="macro-chip-val">${p.macro.carbs}g</span>
          <span class="macro-chip-lbl">Carbs</span>
        </div>
        <div class="macro-chip">
          <span class="macro-chip-val">${p.macro.fat}g</span>
          <span class="macro-chip-lbl">Fat</span>
        </div>
      </div>
      ${p.rotation ? `<div style="margin-top:12px;font-size:0.78rem;color:var(--text-muted);line-height:1.5">
        <span style="color:var(--accent-teal);font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase">Flavour rotation: </span>${p.rotation}
      </div>` : ""}
      ${p.note ? `<div style="margin-top:10px;font-size:0.82rem;color:var(--accent-teal);line-height:1.5">${p.note}</div>` : ""}
    </div>`;
  }).join("");

  const totalWeeks  = profile.durationWeeks || 16;
  const targetKcal  = effectiveCalorieGoal(plan);
  const protein     = effectiveMacros(plan).protein || 0;

  root.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div class="ph-eyebrow">// Your roadmap</div>
        <div class="ph-title">${plan.phases?.length || 4} Phases,<br>${totalWeeks} Weeks</div>
        <div class="ph-desc">
          ${profile.goal === "recomp"
            ? "You're doing a recomp — slight calorie deficit, very high protein. At your age you can lose fat and build muscle simultaneously."
            : profile.goal === "cut"
              ? "Calorie deficit with maximum protein to protect muscle. Each phase tightens the deficit while your gym performance builds."
              : "Progressive calorie surplus with high protein. Phases increase calories as your body adapts and demands more fuel."}
        </div>
      </div>

      <!-- Summary stats -->
      <div class="home-stat-bar" style="margin-bottom:20px">
        <div class="home-stat-item">
          <span class="home-stat-val">${targetKcal}</span>
          <span class="home-stat-lbl">Phase 1 kcal</span>
        </div>
        <div class="home-stat-item">
          <span class="home-stat-val">${protein}g</span>
          <span class="home-stat-lbl">Protein</span>
        </div>
        <div class="home-stat-item">
          <span class="home-stat-val">${totalWeeks}</span>
          <span class="home-stat-lbl">Total wks</span>
        </div>
      </div>

      ${cards}

      <div class="info-box info-box-lime" style="margin-top:4px">
        <strong>Flavour rotations so you don't lose your mind:</strong> Weeks 1–2 garlic + paprika. Weeks 3–4 cumin + coriander. Weeks 5–6 soy + ginger. Weeks 7–8 Italian herbs. Weeks 9–10 turmeric yogurt. Weeks 11–12 tandoori. Weeks 13–14 honey mustard. Weeks 15–16 salsa lime. Same chicken, different taste every two weeks.
      </div>
    </div>`;
}
