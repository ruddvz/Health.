import { t, dayLabel } from "../i18n.js";
import { buildDayMeals, getSwapAlternatives } from "../plangen.js";
import { getFoodTotals, isMealEaten, toggleMealEaten } from "../foodLog.js";
import { getSwapOverride, setSwapOverride } from "../mealSwap.js";

const SLOT_TIMES = {
  breakfast: "7:00 AM",
  mid_morning: "10:00 AM",
  lunch: "1:00 PM",
  pre_workout: "4:00 PM",
  post_workout: "7:30 PM",
  dinner: "7:00 PM",
  snack: "3:30 PM",
};

function mondayBasedToday() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export function mountMeals(root, profile, plan) {
  let day = new Date().getDay();
  day = day === 0 ? 6 : day - 1;
  let tab = "workout";

  let swapSlot = null;

  function closeDrawer() {
    swapSlot = null;
    const drawer = root.querySelector("#swap-drawer");
    if (drawer) drawer.hidden = true;
  }

  function openDrawer(slot, templateName) {
    swapSlot = slot;
    const drawer = root.querySelector("#swap-drawer");
    const optsEl = root.querySelector("#swap-options");
    if (!drawer || !optsEl) return;
    const opts = getSwapAlternatives(profile, day, slot, templateName);
    optsEl.innerHTML =
      opts.length > 0
        ? opts
            .map(
              (name) =>
                `<button type="button" class="swap-opt-btn glass" data-pick-name="${encodeURIComponent(name)}">${name}</button>`
            )
            .join("")
        : `<p class="swap-empty">${t("meals.swap_none")}</p>`;
    drawer.hidden = false;
    drawer.querySelectorAll("[data-pick-name]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nm = decodeURIComponent(btn.dataset.pickName || "");
        if (nm) setSwapOverride(day, slot, nm);
        closeDrawer();
        renderInner();
      });
    });
  }

  function renderInner() {
    const forceRest = tab === "rest";
    const baseMeals = buildDayMeals(profile, day, plan.targetCalories, { forceRest });
    const meals = baseMeals.map((bm) => {
      const sw = getSwapOverride(day, bm.slot);
      return { ...bm, name: sw || bm.name };
    });
    const templateBySlot = Object.fromEntries(baseMeals.map((m) => [m.slot, m.name]));

    const dayRow = [0, 1, 2, 3, 4, 5, 6]
      .map(
        (i) =>
          `<button type="button" class="day-pill ${i === day ? "active" : ""}" data-day="${i}">${dayLabel(i)}</button>`
      )
      .join("");

    const viewingToday = day === mondayBasedToday();
    const totals = getFoodTotals();
    const tgt = plan.targetCalories || 1;
    const pct = Math.min(100, Math.round((totals.kcal / tgt) * 100));

    const complianceBar =
      viewingToday && meals.length > 0
        ? `
        <div class="compliance-bar glass" id="compliance-bar">
          <div class="compliance-row">
            <span class="compliance-label">${t("meals.compliance_today")}</span>
            <span class="compliance-kcal" id="comp-kcal">${totals.kcal} / ${plan.targetCalories} kcal</span>
          </div>
          <div class="progress-track" style="margin-top:8px">
            <div class="progress-fill" id="comp-fill" style="width:${pct}%;animation:none"></div>
          </div>
          <div class="compliance-macros">
            <span>P: ${Math.round(totals.protein)}g / ${plan.macro?.protein ?? 0}g</span>
            <span>C: ${Math.round(totals.carbs)}g / ${plan.macro?.carbs ?? 0}g</span>
            <span>F: ${Math.round(totals.fat)}g / ${plan.macro?.fat ?? 0}g</span>
          </div>
        </div>`
        : "";

    const mealCards = meals
      .map((m) => {
        const time = SLOT_TIMES[m.slot] || "";
        const tags = [];
        if (m.tags?.includes("high_protein")) tags.push(`<span class="tag tag-lime">${t("meals.high_protein")}</span>`);
        if (m.tags?.includes("no_cook")) tags.push(`<span class="tag">No cook</span>`);
        if (m.tags?.includes("batch")) tags.push(`<span class="tag">Batch cook</span>`);

        const ings = m.ingredients
          .map(
            (ing) =>
              `<li>${ing.name}<span style="margin-left:auto;font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);flex-shrink:0">${ing.grams}g</span></li>`
          )
          .join("");

        const eaten = viewingToday && isMealEaten(m.slot);
        const eatBtn =
          viewingToday
            ? `
          <button type="button" class="meal-eat-btn ${eaten ? "eaten" : ""}" data-meal-slot="${m.slot}" data-meal-name="${encodeURIComponent(m.name)}" data-meal-kcal="${m.kcal}">
            ${eaten ? t("meals.eaten") : t("meals.mark_eaten")}
          </button>`
            : "";

        const tmpl = templateBySlot[m.slot] || m.name;
        const hasSwap = !!getSwapOverride(day, m.slot);

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
            <button type="button" class="meal-swap-btn" data-swap-slot="${m.slot}" data-template="${encodeURIComponent(tmpl)}">
              ${t("meals.swap")}
            </button>
            ${hasSwap ? `<button type="button" class="meal-swap-reset" data-reset-slot="${m.slot}">${t("meals.swap_reset")}</button>` : ""}
            ${eatBtn}
          </div>
        </div>`;
      })
      .join("");

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

        ${complianceBar}

        ${totalKcal > 0 ? `
          <div class="info-box info-box-lime" style="margin-bottom:14px">
            <strong>Total today: ~${totalKcal} kcal.</strong>
            ${tab === "workout"
              ? " Eat every meal — carbs fuel tonight's session."
              : " Rest day — carbs are lower but protein stays the same. Your body burns stored fat."}
          </div>` : ""}

        ${mealCards || `<div class="empty-hint">${t("meals.rest")}</div>`}

        <div class="swap-drawer glass" id="swap-drawer" hidden>
          <div class="section-eyebrow swap-drawer-title">${t("meals.swap_alts")}</div>
          <div id="swap-options" class="swap-options"></div>
          <div class="swap-drawer-actions">
            <button type="button" class="btn btn-ghost" id="swap-close">${t("meals.swap_cancel")}</button>
          </div>
        </div>
      </div>`;

    root.querySelector("#swap-close")?.addEventListener("click", closeDrawer);

    root.querySelectorAll("[data-tab]").forEach((b) => {
      b.addEventListener("click", () => {
        tab = b.dataset.tab;
        closeDrawer();
        renderInner();
      });
    });
    root.querySelectorAll("[data-day]").forEach((b) => {
      b.addEventListener("click", () => {
        day = +b.dataset.day;
        closeDrawer();
        renderInner();
      });
    });

    root.querySelectorAll(".meal-swap-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slot = btn.dataset.swapSlot;
        const tmpl = decodeURIComponent(btn.dataset.template || "");
        openDrawer(slot, tmpl);
      });
    });

    root.querySelectorAll(".meal-swap-reset").forEach((btn) => {
      btn.addEventListener("click", () => {
        setSwapOverride(day, btn.dataset.resetSlot, null);
        closeDrawer();
        renderInner();
      });
    });

    root.querySelectorAll(".meal-eat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slot = btn.dataset.mealSlot;
        const name = decodeURIComponent(btn.dataset.mealName || "");
        const kcal = +btn.dataset.mealKcal || 0;
        toggleMealEaten(slot, name, kcal, plan);
        renderInner();
      });
    });

    if (swapSlot && templateBySlot[swapSlot]) {
      openDrawer(swapSlot, templateBySlot[swapSlot]);
    }
  }

  renderInner();
}
