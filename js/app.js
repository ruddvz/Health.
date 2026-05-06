import { getProfile, getPlan, setLang, setProfile, setPlan } from "./store.js";
import { generatePlan } from "./plangen.js";
import { t } from "./i18n.js";
import { mountHome } from "./pages/home.js";
import { mountPhases } from "./pages/phases.js";
import { mountMeals } from "./pages/meals.js";
import { mountPrep } from "./pages/prep.js";
import { mountProgress } from "./pages/progress.js";
import { mountGrocery } from "./pages/grocery.js";
import { mountSupps } from "./pages/supps.js";
import { mountTools } from "./pages/tools.js";
import { maybeAskNotifications } from "./notifications.js";

let route = "home";

const NAV_ICONS = {
  home: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 17v-5h4v5h4V9.5l-6-5-6 5V17h4z"/></svg>`,
  phases: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M17 3H3a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 2h2v2H8V5zm-4 4h10v2H4V9zm0 4h10v2H4v-2z"/></svg>`,
  meals: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2H7v6H5V2H3v6c0 1.9 1.4 3.4 3.25 3.9V19h2.5v-7.1C10.6 11.4 12 9.9 12 8V2H9v6zm5 1v10h2v4h2V2c-2.2 0-4 1.8-4 4v1z"/></svg>`,
  prep: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1a9 9 0 100 18A9 9 0 0010 1zm.5 5v5.25l3.5 2.1-.75 1.23-4.25-2.58V6h1.5z"/></svg>`,
  grocery: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 16a2 2 0 100 4 2 2 0 000-4zm0 0h9a1 1 0 00.95-.68L18 6H4.21L3 3H1v2h1.5L6 16zm10 0a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
  supps: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 9.59l6.91-6.91a4.5 4.5 0 016.36 6.36l-6.91 6.91a4.5 4.5 0 01-6.36-6.36zm8.48-5.48a2.5 2.5 0 013.55 3.54l-1.94 1.94-3.54-3.54 1.93-1.94zM4.91 10.41l3.54 3.54-1.94 1.94a2.5 2.5 0 01-3.54-3.54l1.94-1.94z"/></svg>`,
  progress: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16h14M5 13l3-4 2 2 5-6 3 4"/></svg>`,
  tools: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5"/><path d="M13 13l4 4"/></svg>`,
};

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
    ["prep", "nav.prep"],
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
      render();
    });
  });
}

function renderMain() {
  const main = document.getElementById("app-main");
  main.innerHTML = "";
  const profile = getProfile();
  const plan = getPlan();
  if (!profile || !plan) return;

  document.getElementById("app-name").textContent = `${profile.name}.`;

  const pages = {
    home: mountHome,
    phases: mountPhases,
    meals: mountMeals,
    prep: mountPrep,
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
}

document.addEventListener("np-route", (e) => {
  if (e.detail) {
    route = e.detail;
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
}

function setupSettings() {
  const panel = document.getElementById("settings-panel");

  document.getElementById("settings-btn")?.addEventListener("click", () => {
    const titleEl = document.getElementById("settings-title");
    const subEl = document.getElementById("settings-sub");
    const closeEl = document.getElementById("settings-close");
    const saveEl = document.getElementById("settings-save");
    if (titleEl) titleEl.textContent = t("settings.title");
    if (subEl) subEl.textContent = t("settings.subtitle");
    if (closeEl) closeEl.textContent = t("settings.close");
    if (saveEl) saveEl.textContent = t("settings.save");
    document.getElementById("lbl-weight") && (document.getElementById("lbl-weight").textContent = t("settings.weight_lbl"));
    document.getElementById("lbl-train") && (document.getElementById("lbl-train").textContent = t("settings.train_lbl"));
    document.getElementById("lbl-city") && (document.getElementById("lbl-city").textContent = t("settings.city_lbl"));
    document.getElementById("lbl-lang") && (document.getElementById("lbl-lang").textContent = t("settings.lang_lbl"));
    const cityInp = document.getElementById("edit-city");
    if (cityInp) cityInp.placeholder = t("settings.city_ph");
    populateSettingsFields();
    panel?.classList.add("open");
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

  panel?.querySelectorAll(".train-day-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      panel.querySelectorAll(".train-day-btn").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  document.getElementById("settings-save")?.addEventListener("click", () => {
    const profile = getProfile();
    if (!profile) return;
    const next = { ...profile };
    const kg = parseFloat(document.getElementById("edit-weight")?.value || "");
    if (Number.isFinite(kg) && kg >= 30 && kg <= 300) next.weight_kg = kg;
    const activeTrain = panel?.querySelector(".train-day-btn.active");
    if (activeTrain) next.trainingDays = +activeTrain.dataset.train;
    next.city = document.getElementById("edit-city")?.value?.trim() || "";
    setProfile(next);
    const prevPlan = getPlan();
    setPlan(generatePlan(next, { preserveMetaFrom: prevPlan }));
    panel?.classList.remove("open");
    render();
  });
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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
