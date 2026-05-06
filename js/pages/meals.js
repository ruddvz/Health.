import { t, dayLabel } from "../i18n.js";
import { buildDayMeals } from "../plangen.js";

const SLOT_TIMES = {
  breakfast:  "7:00 AM",
  mid_morning:"10:00 AM",
  lunch:      "1:00 PM",
  pre_workout:"4:00 PM",
  post_workout:"7:30 PM",
  dinner:     "7:00 PM",
  snack:      "3:30 PM",
};

export function mountMeals(root, profile, plan) {
  let day = new Date().getDay();
  day = day === 0 ? 6 : day - 1;
  let tab = "workout";

  function renderInner() {
    const forceRest = tab === "rest";
    const meals = buildDayMeals(profile, day, plan.targetCalories, { forceRest });

    const dayRow = [0, 1, 2, 3, 4, 5, 6].map(i =>
      `<button type="button" class="day-pill ${i === day ? "active" : ""}" data-day="${i}">${dayLabel(i)}</button>`
    ).join("");

    const mealCards = meals.map(m => {
      const time = SLOT_TIMES[m.slot] || "";
      const tags = [];
      if (m.tags?.includes("high_protein")) tags.push(`<span class="tag tag-lime">${t("meals.high_protein")}</span>`);
      if (m.tags?.includes("no_cook"))      tags.push(`<span class="tag">No cook</span>`);
      if (m.tags?.includes("batch"))        tags.push(`<span class="tag">Batch cook</span>`);

      const ings = m.ingredients.map(ing =>
        `<li>${ing.name}<span style="margin-left:auto;font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);flex-shrink:0">${ing.grams}g</span></li>`
      ).join("");

      return `
        <div class="meal-card">
          <div class="meal-head">
            ${time ? `<div class="meal-time-badge">${time}</div>` : ""}
            <div class="meal-name">${m.name}</div>
            <div class="meal-kcal">${m.kcal} kcal</div>
          </div>
          <div class="meal-body">
            <ul class="ing-list">${ings}</ul>
            ${tags.length ? `<div class="meal-tags">${tags.join("")}</div>` : ""}
          </div>
        </div>`;
    }).join("");

    const totalKcal = meals.reduce((s, m) => s + (m.kcal || 0), 0);
    const jainNote = plan.flags?.jain
      ? `<div class="info-box info-box-orange" style="margin-bottom:12px"><strong>Jain mode:</strong> No root vegetables (onion, garlic, potato, carrot) in any meal.</div>`
      : "";

    root.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="ph-eyebrow">// 5 meals a day</div>
          <div class="ph-title">Meal Plan</div>
          <div class="ph-desc">Never skip a meal. Skipping when cutting is how you lose muscle, not fat.</div>
        </div>

        <div class="tabs">
          <button type="button" class="tab ${tab === "workout" ? "active" : ""}" data-tab="workout">${t("meals.tab_workout")}</button>
          <button type="button" class="tab ${tab === "rest" ? "active" : ""}" data-tab="rest">${t("meals.tab_rest")}</button>
        </div>

        <div class="weekday-row">${dayRow}</div>

        ${jainNote}

        ${totalKcal > 0 ? `
          <div class="info-box info-box-lime" style="margin-bottom:14px">
            <strong>Total today: ~${totalKcal} kcal.</strong>
            ${tab === "workout"
              ? " Eat every meal — carbs fuel tonight's session."
              : " Rest day — carbs are lower but protein stays the same. Your body burns stored fat."}
          </div>` : ""}

        ${mealCards || `<div class="empty-hint">${t("meals.rest")}</div>`}
      </div>`;

    root.querySelectorAll("[data-tab]").forEach(b => {
      b.addEventListener("click", () => { tab = b.dataset.tab; renderInner(); });
    });
    root.querySelectorAll("[data-day]").forEach(b => {
      b.addEventListener("click", () => { day = +b.dataset.day; renderInner(); });
    });
  }

  renderInner();
}
