import { t, dayLabel } from "../i18n.js";
import { buildDayMeals } from "../plangen.js";

export function mountMeals(root, profile, plan) {
  let day = new Date().getDay();
  day = day === 0 ? 6 : day - 1;
  let tab = "workout";

  function renderInner() {
    const forceRest = tab === "rest";
    const meals = buildDayMeals(profile, day, plan.targetCalories, { forceRest });
    const dayRow = [0, 1, 2, 3, 4, 5, 6]
      .map(
        (i) =>
          `<button type="button" class="day-pill ${i === day ? "active" : ""}" data-day="${i}">${dayLabel(i)}</button>`
      )
      .join("");

    const mealCards = meals
      .map(
        (m) => `
      <div class="glass meal-card">
        <div class="meal-head">
          <div>
            <div class="meal-time">${t("slots." + m.slot)}</div>
            <strong>${m.name}</strong>
          </div>
          <span class="tag">${m.kcal} kcal</span>
        </div>
        <ul class="ing-list">${m.ingredients.map((ing) => `<li>${ing.name} — ${ing.grams} g</li>`).join("")}</ul>
        ${m.tags?.includes("high_protein") ? `<span class="tag">${t("meals.high_protein")}</span>` : ""}
      </div>`
      )
      .join("");

    const jainNote = plan.flags?.jain ? `<p class="step-sub">${t("meals.jain_note")}</p>` : "";

    root.innerHTML = `
      <div class="page-enter">
        <h2 class="step-title" style="font-size:1.2rem">${t("meals.title")}</h2>
        <div class="tabs">
          <button type="button" class="tab ${tab === "workout" ? "active" : ""}" data-tab="workout">${t("meals.tab_workout")}</button>
          <button type="button" class="tab ${tab === "rest" ? "active" : ""}" data-tab="rest">${t("meals.tab_rest")}</button>
        </div>
        <div class="weekday-row">${dayRow}</div>
        ${jainNote}
        ${mealCards || `<p class="empty-hint">${t("meals.rest")}</p>`}
      </div>`;

    root.querySelectorAll("[data-tab]").forEach((b) => {
      b.addEventListener("click", () => {
        tab = b.dataset.tab;
        renderInner();
      });
    });
    root.querySelectorAll("[data-day]").forEach((b) => {
      b.addEventListener("click", () => {
        day = +b.dataset.day;
        renderInner();
      });
    });
  }

  renderInner();
}
