import { t } from "../i18n.js";
import { buildDayMeals } from "../plangen.js";

function greeting(profile) {
  const h = new Date().getHours();
  let key = "home.greeting_morning";
  if (h >= 12 && h < 17) key = "home.greeting_afternoon";
  if (h >= 17) key = "home.greeting_evening";
  return t(key, { name: profile.name });
}

export function mountHome(root, profile, plan) {
  const today = new Date().getDay();
  const monBased = today === 0 ? 6 : today - 1;
  const td = Math.min(Math.max(profile.trainingDays || 4, 1), 7);
  const isWorkout = monBased < td;
  const meals = buildDayMeals(profile, monBased, plan.targetCalories, { forceRest: !isWorkout });
  const lines = meals
    .map((m) => `<li><strong>${t("slots." + m.slot)}</strong> — ${m.name} <span class="tag">${m.kcal} kcal</span></li>`)
    .join("");

  root.innerHTML = `
    <div class="page-enter">
      <p class="step-sub" style="margin-top:0">${greeting(profile)}</p>
      <div class="glass card">
        <h3>${t("home.today")}</h3>
        <ul class="ing-list" style="list-style:none;padding-left:0">${lines}</ul>
      </div>
      <div class="stat-row">
        <div class="stat-pill"><strong>${profile.weight_kg}</strong> kg</div>
        <div class="stat-pill"><strong>${profile.durationWeeks}</strong> wk</div>
        <div class="stat-pill"><strong>${plan.macro.protein}</strong> g ${t("phases.macros").split(" ")[0]}</div>
      </div>
      <h3 style="margin:16px 0 8px;font-size:0.95rem;color:var(--text-dim)">${t("home.quick")}</h3>
      <div class="quick-grid">
        <button type="button" class="glass quick-card" data-go="phases"><strong>${t("nav.phases")}</strong><span>${t("phases.title")}</span></button>
        <button type="button" class="glass quick-card" data-go="meals"><strong>${t("nav.meals")}</strong><span>${t("meals.title")}</span></button>
        <button type="button" class="glass quick-card" data-go="grocery"><strong>${t("nav.grocery")}</strong><span>${t("grocery.title")}</span></button>
        <button type="button" class="glass quick-card" data-go="supps"><strong>${t("nav.supps")}</strong><span>${t("supps.title")}</span></button>
      </div>
      <div class="glass card" style="margin-top:14px">
        <h3>${t("home.tip_title")}</h3>
        <p style="margin:0;color:var(--text-dim);font-size:0.9rem">${t("home.tip_body")}</p>
      </div>
    </div>`;

  root.querySelectorAll("[data-go]").forEach((b) => {
    b.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("np-route", { detail: b.dataset.go }));
    });
  });
}
