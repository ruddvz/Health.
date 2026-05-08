import {
  getProfile,
  getPlan,
  setLang,
  setProfile,
  setPlan,
  exportLocalBackup,
  importLocalBackup,
  clearAllAppStorage,
} from "./store.js";
import { initHealthState, getHealthState, setHealthState } from "./healthStore.js";
import { applyThemeFromHealthStore } from "./themeApply.js";
import { generatePlan } from "./plangen.js";
import { t } from "./i18n.js";
import { mountHome } from "./pages/home.js";
import { mountPhases } from "./pages/phases.js";
import { mountMeals } from "./pages/meals.js";
import { mountWorkout } from "./pages/workout.js";
import { mountProgress } from "./pages/progress.js";
import { mountGrocery } from "./pages/grocery.js";
import { mountSupps } from "./pages/supps.js";
import { mountTools } from "./pages/tools.js";
import { maybeAskNotifications, requestPushPermission, scheduleLocalReminders } from "./notifications.js";

initHealthState();
applyThemeFromHealthStore();

const ROUTE_IDS = ["home", "phases", "meals", "workout", "progress", "grocery", "supps", "tools"];

/** Map Plan0-style `?screen=` values to in-app routes (see manifest shortcuts). */
const SCREEN_ALIAS = {
  dashboard: "home",
  home: "home",
  meals: "meals",
  supplements: "supps",
  supps: "supps",
  workout: "workout",
  prep: "workout",
  habits: "tools",
  tools: "tools",
  stats: "progress",
  progress: "progress",
  grocery: "grocery",
  phases: "phases",
  settings: "settings",
};

const NAV_ICONS = {
  home: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 17v-5h4v5h4V9.5l-6-5-6 5V17h4z"/></svg>`,
  phases: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M17 3H3a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 2h2v2H8V5zm-4 4h10v2H4V9zm0 4h10v2H4v-2z"/></svg>`,
  meals: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2H7v6H5V2H3v6c0 1.9 1.4 3.4 3.25 3.9V19h2.5v-7.1C10.6 11.4 12 9.9 12 8V2H9v6zm5 1v10h2v4h2V2c-2.2 0-4 1.8-4 4v1z"/></svg>`,
  workout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h4v10H4zM14 7h4v10h-4zM14 7l-3-3M10 17l3 3"/></svg>`,
  grocery: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 16a2 2 0 100 4 2 2 0 000-4zm0 0h9a1 1 0 00.95-.68L18 6H4.21L3 3H1v2h1.5L6 16zm10 0a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
  supps: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 9.59l6.91-6.91a4.5 4.5 0 016.36 6.36l-6.91 6.91a4.5 4.5 0 01-6.36-6.36zm8.48-5.48a2.5 2.5 0 013.55 3.54l-1.94 1.94-3.54-3.54 1.93-1.94zM4.91 10.41l3.54 3.54-1.94 1.94a2.5 2.5 0 01-3.54-3.54l1.94-1.94z"/></svg>`,
  progress: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16h14M5 13l3-4 2 2 5-6 3 4"/></svg>`,
  tools: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5"/><path d="M13 13l4 4"/></svg>`,
};

function readScreenParam() {
  const p = new URLSearchParams(window.location.search);
  return (p.get("screen") || "").toLowerCase().trim();
}

function readHashRoute() {
  return (window.location.hash || "").replace(/^#\/?/, "").toLowerCase() || null;
}

function resolveRouteFromLocation() {
  const qs = readScreenParam();
  if (qs && SCREEN_ALIAS[qs]) return SCREEN_ALIAS[qs];
  const h = readHashRoute();
  if (h && ROUTE_IDS.includes(h)) return h;
  if (h && SCREEN_ALIAS[h]) return SCREEN_ALIAS[h];
  return null;
}

function syncUrlFromRoute() {
  const url = new URL(window.location.href);
  url.hash = route;
  url.searchParams.delete("screen");
  const cur = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (cur !== next) history.replaceState(null, "", next);
}

let route = "home";
let openSettingsOnLaunch = false;

function initRouteFromUrl() {
  const resolved = resolveRouteFromLocation();
  if (resolved === "settings") {
    openSettingsOnLaunch = true;
    route = "home";
    return;
  }
  if (resolved && ROUTE_IDS.includes(resolved)) {
    route = resolved;
    return;
  }
  route = "home";
}

initRouteFromUrl();

function ensureAuth() {
  if (!getProfile()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function renderNav() {
  const nav = document.getElementById("bottom-nav");
  const items = [
    ["home", "nav.home"],
    ["phases", "nav.phases"],
    ["meals", "nav.meals"],
    ["workout", "nav.workout"],
    ["progress", "nav.progress"],
    ["grocery", "nav.grocery"],
    ["supps", "nav.supps"],
    ["tools", "nav.tools"],
  ];
  nav.innerHTML = items
    .map(
      ([id, key]) => `
    <button type="button" class="nav-item ${route === id ? "active" : ""}" data-route="${id}">
      <div class="nav-icon-wrap">${NAV_ICONS[id]}</div>
      ${t(key)}
    </button>`
    )
    .join("");
  nav.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      route = btn.dataset.route;
      syncUrlFromRoute();
      render();
    });
  });
}

function renderMain() {
  const main = document.getElementById("app-main");
  main.innerHTML = "";
  const profile = getProfile();
  let plan = getPlan();

  if (!profile) return;

  if (!plan) {
    try {
      plan = generatePlan(profile);
      setPlan(plan);
    } catch (_) {
      main.innerHTML = `
        <div style="padding:32px 20px;text-align:center">
          <p style="color:var(--text-dim);margin-bottom:20px">Something went wrong loading your plan.</p>
          <button type="button" class="btn btn-primary" onclick="localStorage.removeItem('np_profile');localStorage.removeItem('np_plan');window.location.href='index.html'">
            Start over
          </button>
        </div>`;
      return;
    }
  }

  document.getElementById("app-name").textContent = `${profile.name}.`;

  const pages = {
    home: mountHome,
    phases: mountPhases,
    meals: mountMeals,
    workout: mountWorkout,
    progress: mountProgress,
    grocery: mountGrocery,
    supps: mountSupps,
    tools: mountTools,
  };
  pages[route]?.(main, profile, plan);

  window.scrollTo({ top: 0, behavior: "instant" });
}

function render() {
  if (!ensureAuth()) return;
  renderNav();
  renderMain();
  syncUrlFromRoute();
}

document.addEventListener("np-route", (e) => {
  if (e.detail && ROUTE_IDS.includes(e.detail)) {
    route = e.detail;
    syncUrlFromRoute();
    render();
  }
});

window.addEventListener("hashchange", () => {
  const resolved = resolveRouteFromLocation();
  if (resolved === "settings") {
    document.getElementById("settings-panel")?.classList.add("open");
    populateSettingsFields();
    return;
  }
  if (resolved && ROUTE_IDS.includes(resolved) && resolved !== route) {
    route = resolved;
    render();
  }
});

function syncTrainDayButtons(profile) {
  const td = Math.min(Math.max(profile?.trainingDays || 4, 1), 7);
  document.querySelectorAll(".train-day-btn").forEach((btn) => {
    btn.classList.toggle("active", +btn.dataset.train === td);
  });
}

function populateSettingsFields() {
  const profile = getProfile();
  if (!profile) return;
  const wEl = document.getElementById("edit-weight");
  const cEl = document.getElementById("edit-city");
  if (wEl) wEl.value = profile.weight_kg ?? "";
  if (cEl) cEl.value = profile.city ?? "";
  syncTrainDayButtons(profile);
  syncPreferenceChips();
}

function syncPreferenceChips() {
  const st = getHealthState().settings || {};
  const theme = st.theme || "auto";
  document.querySelectorAll("#theme-grid [data-theme]").forEach((b) => {
    b.classList.toggle("active", b.dataset.theme === theme);
  });
  const units = st.units || "metric";
  document.querySelectorAll("#units-grid [data-units]").forEach((b) => {
    b.classList.toggle("active", b.dataset.units === units);
  });
  const ws = st.weekStart || "monday";
  document.querySelectorAll("#weekstart-grid [data-weekstart]").forEach((b) => {
    b.classList.toggle("active", b.dataset.weekstart === ws);
  });
  const wg = document.getElementById("edit-water-goal");
  if (wg) wg.value = String(st.waterGoal ?? 8);
  const co = document.getElementById("edit-cal-override");
  if (co) co.value = st.calorieGoal != null && st.calorieGoal !== "" ? String(st.calorieGoal) : "";
}

function translateSettingsChrome(panel) {
  const titleEl = document.getElementById("settings-title");
  const subEl = document.getElementById("settings-sub");
  const closeEl = document.getElementById("settings-close");
  const saveEl = document.getElementById("settings-save");
  if (titleEl) titleEl.textContent = t("settings.title");
  if (subEl) subEl.textContent = t("settings.subtitle");
  document.getElementById("settings-prefs-sub") && (document.getElementById("settings-prefs-sub").textContent = t("settings.prefs_sub"));
  document.getElementById("lbl-prefs") && (document.getElementById("lbl-prefs").textContent = t("settings.prefs_title"));
  document.getElementById("lbl-theme") && (document.getElementById("lbl-theme").textContent = t("settings.theme_lbl"));
  document.getElementById("lbl-units") && (document.getElementById("lbl-units").textContent = t("settings.units_lbl"));
  document.getElementById("lbl-weekstart") && (document.getElementById("lbl-weekstart").textContent = t("settings.week_lbl"));
  document.getElementById("lbl-water-goal") && (document.getElementById("lbl-water-goal").textContent = t("settings.water_goal_lbl"));
  document.getElementById("lbl-cal-override") && (document.getElementById("lbl-cal-override").textContent = t("settings.cal_override_lbl"));
  document.getElementById("edit-cal-override") && (document.getElementById("edit-cal-override").placeholder = t("settings.cal_override_ph"));
  document.getElementById("lbl-about") && (document.getElementById("lbl-about").textContent = t("settings.about_lbl"));
  const aboutBody = document.getElementById("settings-about-body");
  if (aboutBody) aboutBody.textContent = t("settings.about_body");
  const notifyBtn = document.getElementById("settings-notify-btn");
  if (notifyBtn) notifyBtn.textContent = t("settings.notify_btn");
  const notifyHint = document.getElementById("settings-notify-hint");
  if (notifyHint) notifyHint.textContent = t("settings.notify_hint");

  document.querySelectorAll("#theme-grid [data-theme]").forEach((b) => {
    const k = b.dataset.theme;
    if (k === "dark") b.textContent = t("settings.theme_dark");
    if (k === "light") b.textContent = t("settings.theme_light");
    if (k === "auto") b.textContent = t("settings.theme_auto");
  });
  document.querySelectorAll("#units-grid [data-units]").forEach((b) => {
    if (b.dataset.units === "metric") b.textContent = t("settings.units_metric");
    if (b.dataset.units === "imperial") b.textContent = t("settings.units_imperial");
  });
  document.querySelectorAll("#weekstart-grid [data-weekstart]").forEach((b) => {
    if (b.dataset.weekstart === "monday") b.textContent = t("settings.week_mon");
    if (b.dataset.weekstart === "sunday") b.textContent = t("settings.week_sun");
  });
  if (closeEl) closeEl.textContent = t("settings.close");
  if (saveEl) saveEl.textContent = t("settings.save");
  document.getElementById("lbl-weight") && (document.getElementById("lbl-weight").textContent = t("settings.weight_lbl"));
  document.getElementById("lbl-train") && (document.getElementById("lbl-train").textContent = t("settings.train_lbl"));
  document.getElementById("lbl-city") && (document.getElementById("lbl-city").textContent = t("settings.city_lbl"));
  document.getElementById("lbl-lang") && (document.getElementById("lbl-lang").textContent = t("settings.lang_lbl"));
  const cityInp = document.getElementById("edit-city");
  if (cityInp) cityInp.placeholder = t("settings.city_ph");

  document.getElementById("lbl-data") && (document.getElementById("lbl-data").textContent = t("settings.data_title"));
  const hint = document.getElementById("settings-data-hint");
  if (hint) hint.textContent = t("settings.data_privacy_hint");
  const exp = document.getElementById("data-export");
  const imp = document.getElementById("data-import-btn");
  const clr = document.getElementById("data-clear-btn");
  if (exp) exp.textContent = t("settings.data_export");
  if (imp) imp.textContent = t("settings.data_import");
  if (clr) clr.textContent = t("settings.data_clear");

  document.getElementById("clear-modal-title") && (document.getElementById("clear-modal-title").textContent = t("settings.data_clear"));
  document.getElementById("clear-modal-body") && (document.getElementById("clear-modal-body").textContent = t("settings.data_clear_modal"));
  document.getElementById("clear-modal-input-lbl") &&
    (document.getElementById("clear-modal-input-lbl").textContent = t("settings.data_clear_input"));
  document.getElementById("clear-data-cancel") && (document.getElementById("clear-data-cancel").textContent = t("settings.data_cancel"));
  document.getElementById("clear-data-confirm") && (document.getElementById("clear-data-confirm").textContent = t("settings.data_clear_btn"));

  document.getElementById("settings-btn")?.setAttribute("aria-label", t("settings.title"));
  populateSettingsFields();
  panel?.classList.add("open");
}

function setupClearDataModal() {
  const modal = document.getElementById("clear-data-modal");
  const input = document.getElementById("clear-data-input");
  const confirmBtn = document.getElementById("clear-data-confirm");
  const cancelBtn = document.getElementById("clear-data-cancel");

  function closeModal() {
    modal?.setAttribute("hidden", "");
    if (input) input.value = "";
    if (confirmBtn) confirmBtn.disabled = true;
  }

  function openModal() {
    modal?.removeAttribute("hidden");
    if (input) {
      input.value = "";
      input.focus();
    }
    if (confirmBtn) confirmBtn.disabled = true;
  }

  input?.addEventListener("input", () => {
    if (confirmBtn) confirmBtn.disabled = input.value.trim() !== "DELETE";
  });

  cancelBtn?.addEventListener("click", closeModal);
  modal?.querySelectorAll("[data-close-clear-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  confirmBtn?.addEventListener("click", () => {
    if (input?.value.trim() !== "DELETE") return;
    clearAllAppStorage();
    window.location.href = "index.html";
  });

  document.getElementById("data-clear-btn")?.addEventListener("click", () => {
    openModal();
  });

  return { openModal, closeModal };
}

function setupDataBackup() {
  document.getElementById("data-export")?.addEventListener("click", () => {
    const json = exportLocalBackup();
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "health-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  const fileInput = document.getElementById("data-import-file");
  document.getElementById("data-import-btn")?.addEventListener("click", () => fileInput?.click());

  fileInput?.addEventListener("change", () => {
    const f = fileInput.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importLocalBackup(String(reader.result || ""));
      if (ok) {
        window.alert(t("settings.data_import_ok"));
        window.location.reload();
      } else {
        window.alert(t("settings.data_import_err"));
      }
      fileInput.value = "";
    };
    reader.readAsText(f);
  });
}

function setupSettings() {
  const panel = document.getElementById("settings-panel");

  document.getElementById("settings-btn")?.addEventListener("click", () => {
    translateSettingsChrome(panel);
  });

  panel?.addEventListener("click", (e) => {
    if (e.target === panel) panel.classList.remove("open");
  });

  document.getElementById("settings-close")?.addEventListener("click", () => panel?.classList.remove("open"));

  panel?.querySelectorAll("[data-set-lang]").forEach((b) => {
    b.addEventListener("click", () => {
      setLang(b.dataset.setLang);
      render();
    });
  });

  function wireExclusiveGroup(containerSel, itemSel) {
    panel?.querySelectorAll(`${containerSel} ${itemSel}`).forEach((btn) => {
      btn.addEventListener("click", () => {
        panel.querySelectorAll(`${containerSel} ${itemSel}`).forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
  wireExclusiveGroup("#edit-train-days", ".train-day-btn");
  wireExclusiveGroup("#theme-grid", ".train-day-btn");
  wireExclusiveGroup("#units-grid", ".train-day-btn");
  wireExclusiveGroup("#weekstart-grid", ".train-day-btn");

  document.getElementById("settings-notify-btn")?.addEventListener("click", async () => {
    const ok = await requestPushPermission();
    if (ok) {
      const h = getHealthState();
      h.settings = { ...h.settings, notificationsEnabled: true };
      setHealthState(h);
      scheduleLocalReminders();
    }
    const hint = document.getElementById("settings-notify-hint");
    if (hint) hint.textContent = t("settings.notify_hint");
  });

  document.getElementById("settings-save")?.addEventListener("click", () => {
    const profile = getProfile();
    if (!profile) return;
    const next = { ...profile };
    const kg = parseFloat(document.getElementById("edit-weight")?.value || "");
    if (Number.isFinite(kg) && kg >= 30 && kg <= 300) next.weight_kg = kg;
    const activeTrain = panel?.querySelector("#edit-train-days .train-day-btn.active");
    if (activeTrain) next.trainingDays = +activeTrain.dataset.train;
    next.city = document.getElementById("edit-city")?.value?.trim() || "";

    const h = getHealthState();
    const th = panel?.querySelector("#theme-grid .train-day-btn.active");
    if (th?.dataset.theme) h.settings.theme = th.dataset.theme;
    const un = panel?.querySelector("#units-grid .train-day-btn.active");
    if (un?.dataset.units) h.settings.units = un.dataset.units;
    const ws = panel?.querySelector("#weekstart-grid .train-day-btn.active");
    if (ws?.dataset.weekstart) h.settings.weekStart = ws.dataset.weekstart;
    const wg = parseInt(document.getElementById("edit-water-goal")?.value || "", 10);
    if (Number.isFinite(wg) && wg >= 4 && wg <= 16) h.settings.waterGoal = wg;
    const calRaw = document.getElementById("edit-cal-override")?.value?.trim();
    if (!calRaw) h.settings.calorieGoal = null;
    else {
      const c = parseInt(calRaw, 10);
      if (Number.isFinite(c) && c >= 800 && c <= 6000) h.settings.calorieGoal = c;
    }
    setHealthState(h);
    applyThemeFromHealthStore();

    setProfile(next);
    const prevPlan = getPlan();
    setPlan(generatePlan(next, { preserveMetaFrom: prevPlan }));
    panel?.classList.remove("open");
    render();
  });

  setupClearDataModal();
  setupDataBackup();
}

function setupInstallBanner() {
  let deferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("np_install_dismissed")) return;
    setTimeout(() => showInstallBanner(), 5000);
  });

  function showInstallBanner() {
    if (!deferredInstallPrompt || document.querySelector(".install-banner")) return;
    const banner = document.createElement("div");
    banner.className = "install-banner glass";
    banner.innerHTML = `
      <div class="install-banner-inner">
        <div class="install-banner-copy">
          <div class="install-banner-title">${t("install.title")}</div>
          <div class="install-banner-sub">${t("install.sub")}</div>
        </div>
        <button type="button" class="btn btn-primary install-banner-btn" id="install-btn">${t("install.cta")}</button>
        <button type="button" class="install-dismiss" id="install-dismiss" aria-label="Dismiss">×</button>
      </div>`;
    document.body.appendChild(banner);
    banner.querySelector("#install-btn")?.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === "accepted") banner.remove();
      deferredInstallPrompt = null;
    });
    banner.querySelector("#install-dismiss")?.addEventListener("click", () => {
      localStorage.setItem("np_install_dismissed", "1");
      banner.remove();
    });
  }
}

render();
setupSettings();
setupInstallBanner();
maybeAskNotifications();

if (openSettingsOnLaunch) {
  const panel = document.getElementById("settings-panel");
  translateSettingsChrome(panel);
}
