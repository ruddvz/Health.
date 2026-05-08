import { t } from "../i18n.js";
import { SHOPPING_TIPS, BATCH_COOK_LIST } from "../data/groceryRef.js";
import { GROCERY_TEMPLATES, GROCERY_AUTOCOMPLETE } from "../data/groceryDatabase.js";
import { getHealthState, setHealthState } from "../healthStore.js";
import { importTodayMealsToGrocery } from "../mealToGrocery.js";
import { currencyLabel } from "../formatCurrency.js";

const CAT_KEYS = ["protein", "carbs", "veg", "dairy", "pantry"];

function uid() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function planItemId(g) {
  return `${g.category}|${g.name}`;
}

function manualCheckId(id) {
  return `manual|${id}`;
}

export function mountGrocery(root, profile, plan) {
  let cat = "protein";
  let topTab = "current";
  const storageKey = "np_grocery_checked";
  let checked = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

  function saveChecked() {
    localStorage.setItem(storageKey, JSON.stringify([...checked]));
  }

  function mergedRows() {
    const planItems = (plan.grocery || []).map((g) => ({
      kind: "plan",
      rowId: planItemId(g),
      category: g.category,
      name: g.name,
      qtyLabel: g.grams ? `${g.grams}g` : g.qty || "",
    }));
    const manual = (getHealthState().grocery?.manualItems || []).map((m) => ({
      kind: "manual",
      rowId: manualCheckId(m.id),
      category: m.category,
      name: m.name,
      qtyLabel: [m.qty, m.unit].filter(Boolean).join(" ") || "",
    }));
    return [...planItems, ...manual];
  }

  function importTemplate(tpl) {
    const s = getHealthState();
    const have = new Set((s.grocery.manualItems || []).map((x) => x.name.toLowerCase()));
    const planNames = new Set((plan.grocery || []).map((g) => g.name.toLowerCase()));
    const next = [...(s.grocery.manualItems || [])];
    for (const it of tpl.items || []) {
      const key = it.name.toLowerCase();
      if (have.has(key) || planNames.has(key)) continue;
      have.add(key);
      next.push({
        id: uid(),
        name: it.name,
        category: it.category || "pantry",
        qty: it.qty,
        unit: it.unit,
      });
    }
    s.grocery.manualItems = next;
    setHealthState(s);
  }

  function saveListSnapshot() {
    const name = window.prompt(t("grocery.snapshot_name"));
    if (!name || !name.trim()) return;
    const rows = mergedRows();
    const s = getHealthState();
    const lists = s.grocery.lists || [];
    lists.unshift({
      id: uid(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      lines: rows.map((r) => `${r.name} — ${r.qtyLabel} (${r.category})`),
    });
    s.grocery.lists = lists.slice(0, 24);
    setHealthState(s);
  }

  function clearDone() {
    const toDrop = new Set();
    for (const id of checked) {
      if (id.startsWith("manual|")) toDrop.add(id.slice("manual|".length));
    }
    if (toDrop.size) {
      const s = getHealthState();
      s.grocery.manualItems = (s.grocery.manualItems || []).filter((m) => !toDrop.has(m.id));
      setHealthState(s);
    }
    checked.clear();
    saveChecked();
  }

  function addManualLine(nameRaw) {
    const name = nameRaw.trim();
    if (!name) return;
    const s = getHealthState();
    const next = [...(s.grocery.manualItems || [])];
    next.push({ id: uid(), name, category: cat, qty: "", unit: "" });
    s.grocery.manualItems = next;
    setHealthState(s);
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(() => {});
  }

  function renderInner() {
    const rows = mergedRows().filter((r) => r.category === cat);
    const allRows = mergedRows();
    const catCounts = CAT_KEYS.reduce((acc, c) => {
      acc[c] = allRows.filter((r) => r.category === c).length;
      return acc;
    }, {});

    const checkedInCat = rows.filter((r) => checked.has(r.rowId)).length;
    const totalInCat = rows.length;
    const progressPct = totalInCat > 0 ? Math.round((checkedInCat / totalInCat) * 100) : 0;

    const catTabs = CAT_KEYS.map((c) => {
      const keyMap = { veg: "grocery.cat_veg", dairy: "grocery.cat_dairy" };
      const label = t(keyMap[c] || `grocery.cat_${c}`);
      const count = catCounts[c] || 0;
      const done = allRows.filter((r) => r.category === c && checked.has(r.rowId)).length;
      return `<button type="button" class="g-tab ${cat === c ? "active" : ""}" data-cat="${c}">
        ${label}${done > 0 && done === count && count > 0 ? " ✓" : ""}
      </button>`;
    }).join("");

    const listItems = rows
      .map((r) => {
        const isOn = checked.has(r.rowId);
        return `
        <div class="grocery-item ${isOn ? "checked" : ""}" data-id="${r.rowId}">
          <div class="gi-checkbox">
            <span class="gi-check-icon">✓</span>
          </div>
          <div class="gi-name">${r.name}${r.kind === "manual" ? ` <span style="font-size:0.65rem;color:var(--text-muted)">· ${t("grocery.manual_tag")}</span>` : ""}</div>
          <div class="gi-qty">${r.qtyLabel}</div>
        </div>`;
      })
      .join("");

    const tip = profile.city ? t("grocery.tip", { city: profile.city }) : t("grocery.tip_default");

    const prepBlock = (() => {
      const dk = profile.dietType === "nonveg" ? "nonveg" : profile.dietType === "vegan" ? "vegan" : "veg";
      const steps = BATCH_COOK_LIST[dk] || BATCH_COOK_LIST.veg;
      return steps
        .map(
          (s) => `
            <div class="glass" style="border-radius:12px;padding:12px 14px;margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:4px">
                <div style="font-size:0.82rem;font-weight:600;color:var(--text-primary);line-height:1.4">${s.item}</div>
                <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent-lime);white-space:nowrap;flex-shrink:0">${s.time}</span>
              </div>
              <div style="font-size:0.74rem;color:var(--text-muted);margin-bottom:4px">Qty: ${s.qty} · Yields: ${s.yield}</div>
              <div style="font-size:0.72rem;color:var(--text-dim);line-height:1.5;font-style:italic">${s.tip}</div>
            </div>`
        )
        .join("");
    })();

    const templatesTab = GROCERY_TEMPLATES.map(
      (tpl) => `
      <div class="glass" style="padding:14px;margin-bottom:10px">
        <div style="font-weight:700">${tpl.name}</div>
        <div class="step-sub">${(tpl.items || []).length} ${t("grocery.template_items")}</div>
        <button type="button" class="btn btn-outline" style="margin-top:10px;width:auto" data-import-tpl="${tpl.id}">${t("grocery.template_import")}</button>
      </div>`
    ).join("");

    const lists = getHealthState().grocery?.lists || [];
    const listsTab =
      lists.length > 0
        ? lists
            .map(
              (L) => `
        <div class="glass" style="padding:12px 14px;margin-bottom:8px">
          <div style="font-weight:600">${L.name}</div>
          <div class="step-sub">${(L.lines || []).length} ${t("grocery.lines")} · ${(L.createdAt || "").slice(0, 10)}</div>
          <button type="button" class="btn btn-ghost" style="margin-top:8px;width:auto" data-copy-list="${encodeURIComponent((L.lines || []).join("\n"))}">${t("grocery.copy_list")}</button>
        </div>`
            )
            .join("")
        : `<div class="empty-hint">${t("grocery.lists_empty")}</div>`;

    const acOptions = GROCERY_AUTOCOMPLETE.slice(0, 100)
      .map((k) => `<option value="${String(k).replace(/"/g, "'")}"></option>`)
      .join("");

    const currentBody =
      topTab === "current"
        ? `
        <div class="grocery-tabs">${catTabs}</div>
        ${totalInCat > 0 ? `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="flex:1">
              <div class="progress-track">
                <div class="progress-fill" style="width:${progressPct}%;background:var(--gradient-lime);animation:none"></div>
              </div>
            </div>
            <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted);white-space:nowrap">${checkedInCat}/${totalInCat}</span>
          </div>` : ""}
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          <input type="text" class="field" id="grocery-quick-add" list="grocery-ac-list" placeholder="${t("grocery.quick_add_ph")}" style="flex:1;min-width:0" />
          <button type="button" class="btn btn-primary" id="grocery-quick-btn" style="width:auto">${t("grocery.quick_add_btn")}</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          <button type="button" class="btn btn-outline" id="grocery-clear-done" style="width:auto">${t("grocery.clear_done")}</button>
          <button type="button" class="btn btn-ghost" id="grocery-save-snapshot" style="width:auto">${t("grocery.save_snapshot")}</button>
          <button type="button" class="btn btn-outline" id="grocery-share-list" style="width:auto">${t("grocery.share_list")}</button>
          <button type="button" class="btn btn-outline" id="grocery-from-meals" style="width:auto">${t("grocery.from_meals")}</button>
        </div>
        <div class="grocery-list">
          ${listItems || `<div class="grocery-item"><div class="gi-name" style="color:var(--text-dim)">—</div></div>`}
        </div>
        <datalist id="grocery-ac-list">${acOptions}</datalist>
        ${tip ? `<div class="info-box info-box-lime" style="margin-top:14px"><strong>Store tip:</strong> ${tip}</div>` : ""}
        <div class="section-eyebrow" style="margin-top:20px">${t("grocery.prep_title")}</div>
        <div class="info-box info-box-lime" style="margin-bottom:10px">${t("grocery.prep_blurb")}</div>
        ${prepBlock}
        <div class="section-eyebrow" style="margin-top:20px">${t("grocery.tips_general")}</div>
        <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:8px">
          ${SHOPPING_TIPS.general
            .map(
              (x) => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.78rem;color:var(--text-muted);line-height:1.5">
              <span style="color:var(--accent-lime);flex-shrink:0;margin-top:1px">→</span>
              <span>${x}</span>
            </div>`
            )
            .join("")}
        </div>
        <div class="section-eyebrow" style="margin-top:12px">${t("grocery.tips_budget")}</div>
        <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:8px">
          ${SHOPPING_TIPS.budget
            .map(
              (x) => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.78rem;color:var(--text-muted);line-height:1.5">
              <span style="color:var(--accent-teal);flex-shrink:0;margin-top:1px">$</span>
              <span>${x}</span>
            </div>`
            )
            .join("")}
        </div>
        ${["veg", "vegan", "eggetarian"].includes(profile.dietType) ? `
        <div class="section-eyebrow" style="margin-top:12px">${t("grocery.tips_indian")}</div>
        <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:16px">
          ${SHOPPING_TIPS.indian_grocery
            .map(
              (x) => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.78rem;color:var(--text-muted);line-height:1.5">
              <span style="color:var(--accent-gold);flex-shrink:0;margin-top:1px">◆</span>
              <span>${x}</span>
            </div>`
            )
            .join("")}
        </div>` : ""}`
        : "";

    const templatesBody = topTab === "templates" ? `<div class="section-eyebrow">${t("grocery.templates_title")}</div>${templatesTab}` : "";

    const listsBody = topTab === "lists" ? `<div class="section-eyebrow">${t("grocery.lists_title")}</div>${listsTab}` : "";

    const curCode = getHealthState().settings?.currencyCode;
    const curLine =
      curCode && curCode !== "NONE"
        ? `<div class="ph-desc" style="margin-top:6px;font-size:0.85rem;opacity:0.88">${t("grocery.currency_hint", { cur: currencyLabel(curCode) })}</div>`
        : "";

    root.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="ph-eyebrow">// ${t("grocery.header_eyebrow")}</div>
          <div class="ph-title">${t("grocery.title")}</div>
          <div class="ph-desc">${t("grocery.header_desc")}</div>
          ${curLine}
        </div>
        <div class="tabs" style="margin-bottom:12px">
          <button type="button" class="tab ${topTab === "current" ? "active" : ""}" data-top="current">${t("grocery.tab_current")}</button>
          <button type="button" class="tab ${topTab === "templates" ? "active" : ""}" data-top="templates">${t("grocery.tab_templates")}</button>
          <button type="button" class="tab ${topTab === "lists" ? "active" : ""}" data-top="lists">${t("grocery.tab_lists")}</button>
        </div>
        ${currentBody}
        ${templatesBody}
        ${listsBody}
      </div>`;

    root.querySelectorAll("[data-top]").forEach((b) => {
      b.addEventListener("click", () => {
        topTab = b.dataset.top;
        renderInner();
      });
    });

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
        saveChecked();
        el.classList.toggle("checked", checked.has(id));
        const chk = el.querySelector(".gi-check-icon");
        if (chk) chk.style.opacity = checked.has(id) ? "1" : "0";
        const box = el.querySelector(".gi-checkbox");
        if (box) {
          if (checked.has(id)) {
            box.style.background = "var(--accent-lime)";
            box.style.borderColor = "var(--accent-lime)";
            box.style.boxShadow = "0 0 10px rgba(61,219,122,0.35)";
          } else {
            box.style.background = "";
            box.style.borderColor = "";
            box.style.boxShadow = "";
          }
        }
      });
    });

    root.querySelector("#grocery-clear-done")?.addEventListener("click", () => {
      clearDone();
      renderInner();
    });

    root.querySelector("#grocery-save-snapshot")?.addEventListener("click", () => {
      saveListSnapshot();
      renderInner();
    });

    root.querySelector("#grocery-quick-btn")?.addEventListener("click", () => {
      const v = root.querySelector("#grocery-quick-add")?.value || "";
      addManualLine(v);
      root.querySelector("#grocery-quick-add").value = "";
      renderInner();
    });

    root.querySelector("#grocery-share-list")?.addEventListener("click", () => {
      const lines = mergedRows().map((r) => `- [ ] ${r.name} (${r.qtyLabel}) [${r.category}]`);
      copyText(lines.join("\n"));
    });

    root.querySelector("#grocery-from-meals")?.addEventListener("click", () => {
      const n = importTodayMealsToGrocery(profile, plan);
      window.alert(t("grocery.from_meals_done", { n: String(n) }));
      renderInner();
    });

    root.querySelectorAll("[data-import-tpl]").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.dataset.importTpl;
        const tpl = GROCERY_TEMPLATES.find((x) => x.id === id);
        if (tpl) importTemplate(tpl);
        topTab = "current";
        renderInner();
      });
    });

    root.querySelectorAll("[data-copy-list]").forEach((b) => {
      b.addEventListener("click", () => {
        copyText(decodeURIComponent(b.dataset.copyList || ""));
      });
    });
  }

  renderInner();
}
