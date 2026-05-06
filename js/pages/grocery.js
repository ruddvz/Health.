import { t } from "../i18n.js";
import { SHOPPING_TIPS, BATCH_COOK_LIST } from "../data/groceryRef.js";

const CAT_KEYS = ["protein", "carbs", "veg", "dairy", "pantry"];

export function mountGrocery(root, profile, plan) {
  let cat = "protein";
  const storageKey = "np_grocery_checked";
  let checked = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

  function save() {
    localStorage.setItem(storageKey, JSON.stringify([...checked]));
  }

  function renderInner() {
    const allItems = plan.grocery || [];
    const items    = allItems.filter(g => g.category === cat);

    const catCounts = CAT_KEYS.reduce((acc, c) => {
      acc[c] = allItems.filter(g => g.category === c).length;
      return acc;
    }, {});

    const checkedInCat = items.filter(g => checked.has(`${g.category}|${g.name}`)).length;
    const totalInCat   = items.length;

    const tabs = CAT_KEYS.map(c => {
      const keyMap = { veg: "grocery.cat_veg", dairy: "grocery.cat_dairy" };
      const label = t(keyMap[c] || `grocery.cat_${c}`);
      const count = catCounts[c] || 0;
      const done  = allItems.filter(g => g.category === c && checked.has(`${g.category}|${g.name}`)).length;
      return `<button type="button" class="g-tab ${cat === c ? "active" : ""}" data-cat="${c}">
        ${label}${done > 0 && done === count ? " ✓" : ""}
      </button>`;
    }).join("");

    const listItems = items.map(g => {
      const id   = `${g.category}|${g.name}`;
      const isOn = checked.has(id);
      const qty  = g.grams ? `${g.grams}g` : (g.qty || "");
      return `
        <div class="grocery-item ${isOn ? "checked" : ""}" data-id="${id}">
          <div class="gi-checkbox">
            <span class="gi-check-icon">✓</span>
          </div>
          <div class="gi-name">${g.name}</div>
          <div class="gi-qty">${qty}</div>
        </div>`;
    }).join("");

    const tip = profile.city
      ? t("grocery.tip", { city: profile.city })
      : t("grocery.tip_default");

    const progressPct = totalInCat > 0 ? Math.round((checkedInCat / totalInCat) * 100) : 0;

    root.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="ph-eyebrow">// Weekly shop</div>
          <div class="ph-title">Grocery List</div>
          <div class="ph-desc">Tap items to check them off. Buy this every week.</div>
        </div>

        <div class="grocery-tabs">${tabs}</div>

        ${totalInCat > 0 ? `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="flex:1">
              <div class="progress-track">
                <div class="progress-fill" style="width:${progressPct}%;background:var(--gradient-lime);animation:none"></div>
              </div>
            </div>
            <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted);white-space:nowrap">${checkedInCat}/${totalInCat} done</span>
          </div>` : ""}

        <div class="grocery-list">
          ${listItems || `<div class="grocery-item"><div class="gi-name" style="color:var(--text-dim)">—</div></div>`}
        </div>

        ${tip ? `<div class="info-box info-box-lime" style="margin-top:14px"><strong>Store tip:</strong> ${tip}</div>` : ""}

        <div class="section-eyebrow" style="margin-top:20px">Sunday Batch Cook</div>
        <div class="info-box info-box-lime" style="margin-bottom:10px">
          <strong>Prep once, eat all week.</strong> 90 min on Sunday = 5 days of fast, on-plan meals.
        </div>
        ${(() => {
          const dk = profile.dietType === "nonveg" ? "nonveg" : profile.dietType === "vegan" ? "vegan" : "veg";
          const steps = BATCH_COOK_LIST[dk] || BATCH_COOK_LIST.veg;
          return steps.map((s) => `
            <div class="glass" style="border-radius:12px;padding:12px 14px;margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:4px">
                <div style="font-size:0.82rem;font-weight:600;color:var(--text-primary);line-height:1.4">${s.item}</div>
                <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent-lime);white-space:nowrap;flex-shrink:0">${s.time}</span>
              </div>
              <div style="font-size:0.74rem;color:var(--text-muted);margin-bottom:4px">Qty: ${s.qty} · Yields: ${s.yield}</div>
              <div style="font-size:0.72rem;color:var(--text-dim);line-height:1.5;font-style:italic">${s.tip}</div>
            </div>`).join("");
        })()}

        <div class="section-eyebrow" style="margin-top:20px">Shopping Tips</div>
        <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:8px">
          ${SHOPPING_TIPS.general.map((tip) => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.78rem;color:var(--text-muted);line-height:1.5">
              <span style="color:var(--accent-lime);flex-shrink:0;margin-top:1px">→</span>
              <span>${tip}</span>
            </div>`).join("")}
        </div>

        <div class="section-eyebrow" style="margin-top:12px">Budget Buying Tips</div>
        <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:8px">
          ${SHOPPING_TIPS.budget.map((tip) => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.78rem;color:var(--text-muted);line-height:1.5">
              <span style="color:var(--accent-teal);flex-shrink:0;margin-top:1px">$</span>
              <span>${tip}</span>
            </div>`).join("")}
        </div>

        ${["veg", "vegan", "eggetarian"].includes(profile.dietType) ? `
        <div class="section-eyebrow" style="margin-top:12px">Indian Grocery Tips</div>
        <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:16px">
          ${SHOPPING_TIPS.indian_grocery.map((tip) => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.78rem;color:var(--text-muted);line-height:1.5">
              <span style="color:var(--accent-gold);flex-shrink:0;margin-top:1px">◆</span>
              <span>${tip}</span>
            </div>`).join("")}
        </div>` : ""}
      </div>`;

    root.querySelectorAll("[data-cat]").forEach(b => {
      b.addEventListener("click", () => { cat = b.dataset.cat; renderInner(); });
    });
    root.querySelectorAll(".grocery-item").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        if (checked.has(id)) checked.delete(id);
        else checked.add(id);
        save();
        el.classList.toggle("checked", checked.has(id));
        const chk = el.querySelector(".gi-check-icon");
        if (chk) chk.style.opacity = checked.has(id) ? "1" : "0";
        const box = el.querySelector(".gi-checkbox");
        if (box) {
          if (checked.has(id)) {
            box.style.background = "var(--accent-lime)";
            box.style.borderColor = "var(--accent-lime)";
            box.style.boxShadow = "0 0 10px rgba(212,245,60,0.35)";
          } else {
            box.style.background = "";
            box.style.borderColor = "";
            box.style.boxShadow = "";
          }
        }
      });
    });
  }

  renderInner();
}
