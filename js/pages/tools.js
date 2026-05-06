import { t } from "../i18n.js";
import { FOODS } from "../data/foods.js";
import { appendCustomFoodToLog } from "../foodLog.js";

export function mountTools(root, profile, plan) {
  let query = "";

  function renderInner() {
    const q = query.trim().toLowerCase();
    const results =
      q.length < 2
        ? FOODS.slice(0, 14)
        : FOODS.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 22);

    root.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="ph-eyebrow">// ${t("tools.eyebrow")}</div>
          <div class="ph-title">${t("tools.title")}</div>
          <div class="ph-desc">${t("tools.desc")}</div>
        </div>
        <input type="search" class="weight-input tools-search" id="food-search" autocomplete="off"
          placeholder="${t("tools.placeholder")}" />
        <div class="tools-results">
          ${results
            .map(
              (f) => `
            <div class="food-result-card glass" data-food="${encodeURIComponent(f.name)}">
              <div class="food-result-top">
                <div>
                  <div class="food-result-name">${f.name}</div>
                  <div class="food-result-basis">${t("tools.basis")}: ${f.basis || "100g"}</div>
                </div>
                <div class="food-result-kcal-wrap">
                  <div class="food-result-kcal">${f.kcal}</div>
                  <div class="food-result-kcal-lbl">kcal</div>
                </div>
              </div>
              <div class="food-result-macros">
                <span>P ${f.protein}g</span>
                <span>C ${f.carbs}g</span>
                <span>F ${f.fat}g</span>
              </div>
              <button type="button" class="btn btn-primary tools-add-btn">${t("tools.add_log")}</button>
            </div>`
            )
            .join("")}
        </div>
      </div>`;

    const inp = root.querySelector("#food-search");
    if (inp) inp.value = query;
    inp?.addEventListener("input", (e) => {
      query = e.target.value;
      renderInner();
    });

    root.querySelectorAll(".food-result-card").forEach((card) => {
      card.querySelector(".tools-add-btn")?.addEventListener("click", () => {
        const key = card.getAttribute("data-food");
        if (!key) return;
        const name = decodeURIComponent(key);
        const f = FOODS.find((x) => x.name === name);
        if (!f) return;
        appendCustomFoodToLog(`${f.name} (${f.basis || "100g"})`, f.kcal, f.protein, f.carbs, f.fat);
        const btn = card.querySelector(".tools-add-btn");
        if (btn) {
          btn.textContent = t("tools.added");
          btn.disabled = true;
          setTimeout(() => renderInner(), 900);
        }
      });
    });
  }

  renderInner();
}
