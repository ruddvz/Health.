import { t } from "../i18n.js";
import { FOODS } from "../data/foods.js";
import { appendCustomFoodToLog, todayKey } from "../foodLog.js";
import { getHealthState, setHealthState } from "../healthStore.js";
import { BUILTIN_HABIT_IDS, isBuiltinHabitDone, toggleBuiltinHabit, ensureBuiltinHabitSlots } from "../dashboardHabits.js";

const CAT_KEYS = ["all", "protein", "carbs", "veg", "fruit", "dairy", "indian", "pantry"];

const HABIT_ICONS = ["✓", "💧", "🏃", "📖", "🧘", "🍎", "💤", "⚡"];

let toolsUiTab = "food";

function habitUid() {
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function renderHeatmap(completions) {
  const set = new Set(completions || []);
  const cells = [];
  for (let i = 55; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dt = d.toISOString().slice(0, 10);
    const ok = set.has(dt);
    cells.push(
      `<div class="hm-cell" title="${dt}" style="background:${ok ? "var(--accent-lime)" : "var(--surface-mid)"};border-radius:3px;aspect-ratio:1"></div>`
    );
  }
  return `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;width:100%;max-width:280px;margin-top:8px">${cells.join("")}</div>`;
}

export function mountTools(root, profile, plan) {
  let query = "";
  let catFilter = "all";
  let newHabitName = "";
  let newHabitIcon = HABIT_ICONS[0];

  function filteredList() {
    const q = query.trim().toLowerCase();
    let list = FOODS;
    if (catFilter !== "all") list = list.filter((f) => f.cat === catFilter);
    if (q.length >= 2) list = list.filter((f) => f.name.toLowerCase().includes(q));
    else list = list.slice(0, 40);
    return list.slice(0, 36);
  }

  function toggleHabitDay(habitId) {
    if (BUILTIN_HABIT_IDS.includes(habitId)) {
      toggleBuiltinHabit(habitId);
      return;
    }
    const s = getHealthState();
    const habits = s.habits?.habits || [];
    const h = habits.find((x) => x.id === habitId);
    if (!h) return;
    const d = todayKey();
    const comp = new Set(h.completions || []);
    if (comp.has(d)) comp.delete(d);
    else comp.add(d);
    h.completions = [...comp];
    setHealthState(s);
  }

  function addHabit() {
    const name = newHabitName.trim();
    if (!name) return;
    const s = getHealthState();
    const habits = [...(s.habits?.habits || [])];
    habits.unshift({
      id: habitUid(),
      name,
      icon: newHabitIcon,
      completions: [],
    });
    s.habits.habits = habits.slice(0, 24);
    setHealthState(s);
    newHabitName = "";
  }

  function deleteHabit(id) {
    if (BUILTIN_HABIT_IDS.includes(id)) return;
    const s = getHealthState();
    s.habits.habits = (s.habits.habits || []).filter((h) => h.id !== id);
    setHealthState(s);
  }

  function renderInner() {
    const topTabs = `
      <div class="tabs" style="margin-bottom:12px">
        <button type="button" class="tab ${toolsUiTab === "food" ? "active" : ""}" data-tools-tab="food">${t("tools.tab_food")}</button>
        <button type="button" class="tab ${toolsUiTab === "habits" ? "active" : ""}" data-tools-tab="habits">${t("tools.tab_habits")}</button>
      </div>`;

    if (toolsUiTab === "habits") {
      ensureBuiltinHabitSlots({
        workout: "🏋️",
        prep: "🥡",
        supps: "💊",
        water: "💧",
      });
      const habits = getHealthState().habits?.habits || [];
      const today = todayKey();
      const ordered = [...BUILTIN_HABIT_IDS.map((id) => habits.find((h) => h.id === id)).filter(Boolean), ...habits.filter((h) => !BUILTIN_HABIT_IDS.includes(h.id))];
      const habitCards = ordered
        .map((h) => {
          const done = BUILTIN_HABIT_IDS.includes(h.id) ? isBuiltinHabitDone(h.id) : (h.completions || []).includes(today);
          const canDel = !BUILTIN_HABIT_IDS.includes(h.id);
          return `
        <div class="glass" style="padding:14px;margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
            <div>
              <span style="font-size:1.2rem;margin-right:6px">${h.icon || "✓"}</span>
              <strong>${h.name}</strong>
              <div class="step-sub">${BUILTIN_HABIT_IDS.includes(h.id) ? t("habits.dash_linked") : t("habits.tap_toggle")}</div>
            </div>
            ${canDel ? `<button type="button" class="btn btn-ghost" style="width:auto;padding:6px 10px" data-del-habit="${h.id}">${t("habits.delete")}</button>` : ""}
          </div>
          ${renderHeatmap(h.completions)}
          <button type="button" class="btn ${done ? "btn-primary" : "btn-outline"}" style="margin-top:12px;width:100%" data-toggle-habit="${h.id}">
            ${done ? t("habits.done_today") : t("habits.mark_today")}
          </button>
        </div>`;
        })
        .join("");

      const iconPick = HABIT_ICONS.map(
        (ic) =>
          `<button type="button" class="chip ${newHabitIcon === ic ? "selected" : ""}" data-pick-icon="${ic}" style="font-size:1.1rem">${ic}</button>`
      ).join("");

      root.innerHTML = `
      <div class="page-enter">
        ${topTabs}
        <div class="page-header">
          <div class="ph-eyebrow">// ${t("habits.eyebrow")}</div>
          <div class="ph-title">${t("habits.title")}</div>
          <div class="ph-desc">${t("habits.desc")}</div>
        </div>
        <div class="glass" style="padding:14px;margin-bottom:12px">
          <label class="label">${t("habits.new_name")}</label>
          <input type="text" class="field" id="habit-name-inp" placeholder="${t("habits.new_ph")}" />
          <div class="step-sub" style="margin:10px 0 6px">${t("habits.pick_icon")}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${iconPick}</div>
          <button type="button" class="btn btn-primary" style="margin-top:12px" id="habit-add-btn">${t("habits.add")}</button>
        </div>
        ${habits.length ? habitCards : `<div class="empty-hint">${t("habits.empty")}</div>`}
      </div>`;
      const inp = root.querySelector("#habit-name-inp");
      if (inp) inp.value = newHabitName;
      inp?.addEventListener("input", (e) => {
        newHabitName = e.target.value;
      });
      root.querySelectorAll("[data-pick-icon]").forEach((b) => {
        b.addEventListener("click", () => {
          newHabitIcon = b.dataset.pickIcon || HABIT_ICONS[0];
          mountTools(root, profile, plan);
        });
      });
      root.querySelector("#habit-add-btn")?.addEventListener("click", () => {
        newHabitName = root.querySelector("#habit-name-inp")?.value || "";
        addHabit();
        mountTools(root, profile, plan);
      });
      root.querySelectorAll("[data-toggle-habit]").forEach((b) => {
        b.addEventListener("click", () => {
          toggleHabitDay(b.dataset.toggleHabit);
          mountTools(root, profile, plan);
        });
      });
      root.querySelectorAll("[data-del-habit]").forEach((b) => {
        b.addEventListener("click", () => {
          deleteHabit(b.dataset.delHabit);
          mountTools(root, profile, plan);
        });
      });
      root.querySelectorAll("[data-tools-tab]").forEach((b) => {
        b.addEventListener("click", () => {
          toolsUiTab = b.dataset.toolsTab;
          mountTools(root, profile, plan);
        });
      });
      return;
    }

    const results = filteredList();
    const catsRow = CAT_KEYS.map(
      (c) =>
        `<button type="button" class="tools-cat ${catFilter === c ? "active" : ""}" data-cat="${c}">${t("tools.cat_" + c)}</button>`
    ).join("");

    root.innerHTML = `
      <div class="page-enter">
        ${topTabs}
        <div class="page-header">
          <div class="ph-eyebrow">// ${t("tools.eyebrow")}</div>
          <div class="ph-title">${t("tools.title")}</div>
          <div class="ph-desc">${t("tools.desc")}</div>
        </div>
        <div class="tools-cat-row">${catsRow}</div>
        <input type="search" class="weight-input tools-search" id="food-search" autocomplete="off"
          placeholder="${t("tools.placeholder")}" />
        <div class="tools-results">
          ${results.length
            ? results
                .map(
                  (f) => `
            <div class="food-result-card glass" data-food="${encodeURIComponent(f.name)}">
              <div class="food-result-top">
                <div>
                  <div class="food-result-name">${f.name}</div>
                  <div class="food-result-basis">${t("tools.basis")}: ${f.basis || "100g"} · ${t("tools.cat_" + (f.cat || "pantry"))}</div>
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
                .join("")
            : `<p class="tools-empty">${t("tools.no_results")}</p>`}
        </div>
      </div>`;

    const inp = root.querySelector("#food-search");
    if (inp) inp.value = query;
    inp?.addEventListener("input", (e) => {
      query = e.target.value;
      renderInner();
    });

    root.querySelectorAll("[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        catFilter = btn.dataset.cat || "all";
        renderInner();
      });
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

    root.querySelectorAll("[data-tools-tab]").forEach((b) => {
      b.addEventListener("click", () => {
        toolsUiTab = b.dataset.toolsTab;
        mountTools(root, profile, plan);
      });
    });
  }

  renderInner();
}
