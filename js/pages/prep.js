import { t } from "../i18n.js";

export function mountPrep(root, profile, plan) {
  const steps = (plan.prep || []).map((s, i) => `
    <div class="prep-step page-enter" style="animation-delay:${i * 50}ms">
      <div class="prep-step-num">${String(i + 1).padStart(2, "0")}</div>
      <div>
        <div class="prep-step-title">${s.t}</div>
        <div class="prep-step-body">${s.detail || ""}</div>
        <div class="prep-time-badge">⏱ ${s.m} min</div>
      </div>
    </div>`).join("");

  const dietNote = {
    veg:  "Your batch: paneer press → dal/lentil boil → rice → veg roast.",
    vegan:"Your batch: tofu press → lentil boil → rice → veg roast.",
    eggetarian: "Your batch: boil 12 eggs → dal/lentil boil → rice → veg roast.",
    nonveg: "Your batch: chicken breast (12 min) → rice (4 min) → boil eggs → roast veg.",
  }[profile.dietType] || "";

  root.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div class="ph-eyebrow">// Every Sunday</div>
        <div class="ph-title">Meal Prep<br>Guide</div>
        <div class="ph-desc">90 minutes on Sunday sets you up for the whole week. Grab-and-go every morning.</div>
      </div>

      ${dietNote ? `<div class="info-box info-box-lime" style="margin-bottom:16px"><strong>Your order of operations:</strong> ${dietNote}</div>` : ""}

      ${steps || `<div class="empty-hint">${t("prep.intro")}</div>`}

      <div class="info-box info-box-orange" style="margin-top:4px">
        <strong>Wednesday top-up takes 20 minutes.</strong> Pack Thursday–Saturday meals. Cook nothing new — just portion what's left from Sunday. If protein is running low, pan-cook at medium-high, 6–7 min per side.
      </div>
    </div>`;
}
