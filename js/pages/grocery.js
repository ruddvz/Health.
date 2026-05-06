import { t } from "../i18n.js";

const CAT_KEYS = ["protein", "carbs", "veg", "dairy", "pantry"];

export function mountGrocery(root, profile, plan) {
  let cat = "protein";
  const storageKey = "np_grocery_checked";
  let checked = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

  function save() {
    localStorage.setItem(storageKey, JSON.stringify([...checked]));
  }

  function renderInner() {
    const items = plan.grocery.filter((g) => g.category === cat);
    const list = items
      .map((g) => {
        const id = `${g.category}|${g.name}`;
        const isOn = checked.has(id);
        return `<div class="grocery-item ${isOn ? "checked" : ""}" data-id="${id}"><span>${g.name}</span><strong>${g.grams} g</strong></div>`;
      })
      .join("");

    const tabs = CAT_KEYS.map((c) => {
      const key = c === "veg" ? "grocery.cat_veg" : c === "dairy" ? "grocery.cat_dairy" : `grocery.cat_${c}`;
      return `<button type="button" class="tab ${cat === c ? "active" : ""}" data-cat="${c}">${t(key)}</button>`;
    }).join("");

    const tip = profile.city
      ? t("grocery.tip", { city: profile.city })
      : t("grocery.tip_default");

    root.innerHTML = `
      <div class="page-enter">
        <h2 class="step-title" style="font-size:1.2rem">${t("grocery.title")}</h2>
        <p class="step-sub">${tip}</p>
        <div class="grocery-tabs">${tabs}</div>
        ${list || `<p class="empty-hint">—</p>`}
      </div>`;

    root.querySelectorAll("[data-cat]").forEach((b) => {
      b.addEventListener("click", () => {
        cat = b.dataset.cat;
        renderInner();
      });
    });
    root.querySelectorAll(".grocery-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        if (checked.has(id)) checked.delete(id);
        else checked.add(id);
        save();
        el.classList.toggle("checked", checked.has(id));
      });
    });
  }

  renderInner();
}
