import { getProfile, getPlan, setLang } from "./store.js";
import { t } from "./i18n.js";
import { mountHome }    from "./pages/home.js";
import { mountPhases }  from "./pages/phases.js";
import { mountMeals }   from "./pages/meals.js";
import { mountPrep }    from "./pages/prep.js";
import { mountGrocery } from "./pages/grocery.js";
import { mountSupps }   from "./pages/supps.js";

let route = "home";

// ── Clean SVG icons ──────────────────────────────────
const NAV_ICONS = {
  home: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 17v-5h4v5h4V9.5l-6-5-6 5V17h4z"/></svg>`,
  phases: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M17 3H3a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 2h2v2H8V5zm-4 4h10v2H4V9zm0 4h10v2H4v-2z"/></svg>`,
  meals: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2H7v6H5V2H3v6c0 1.9 1.4 3.4 3.25 3.9V19h2.5v-7.1C10.6 11.4 12 9.9 12 8V2H9v6zm5 1v10h2v4h2V2c-2.2 0-4 1.8-4 4v1z"/></svg>`,
  prep:  `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1a9 9 0 100 18A9 9 0 0010 1zm.5 5v5.25l3.5 2.1-.75 1.23-4.25-2.58V6h1.5z"/></svg>`,
  grocery: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 16a2 2 0 100 4 2 2 0 000-4zm0 0h9a1 1 0 00.95-.68L18 6H4.21L3 3H1v2h1.5L6 16zm10 0a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
  supps: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 9.59l6.91-6.91a4.5 4.5 0 016.36 6.36l-6.91 6.91a4.5 4.5 0 01-6.36-6.36zm8.48-5.48a2.5 2.5 0 013.55 3.54l-1.94 1.94-3.54-3.54 1.93-1.94zM4.91 10.41l3.54 3.54-1.94 1.94a2.5 2.5 0 01-3.54-3.54l1.94-1.94z"/></svg>`,
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
    ["home",    "nav.home"],
    ["phases",  "nav.phases"],
    ["meals",   "nav.meals"],
    ["prep",    "nav.prep"],
    ["grocery", "nav.grocery"],
    ["supps",   "nav.supps"],
  ];
  nav.innerHTML = items.map(([id, key]) => `
    <button type="button" class="nav-item ${route === id ? "active" : ""}" data-route="${id}">
      <div class="nav-icon-wrap">${NAV_ICONS[id]}</div>
      ${t(key)}
    </button>`
  ).join("");
  nav.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => {
      route = btn.dataset.route;
      render();
    });
  });
}

function renderMain() {
  const main    = document.getElementById("app-main");
  main.innerHTML = "";
  const profile  = getProfile();
  const plan     = getPlan();
  if (!profile || !plan) return;

  document.getElementById("app-name").textContent = `${profile.name}.`;

  const pages = { home: mountHome, phases: mountPhases, meals: mountMeals, prep: mountPrep, grocery: mountGrocery, supps: mountSupps };
  pages[route]?.(main, profile, plan);

  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: "instant" });
}

function render() {
  if (!ensureAuth()) return;
  renderNav();
  renderMain();
}

document.addEventListener("np-route", e => {
  if (e.detail) { route = e.detail; render(); }
});

function setupSettings() {
  const panel = document.getElementById("settings-panel");
  document.getElementById("settings-btn")?.addEventListener("click", () => {
    const titleEl = document.getElementById("settings-title");
    const closeEl = document.getElementById("settings-close");
    if (titleEl) titleEl.textContent = t("settings.title");
    if (closeEl) closeEl.textContent = t("settings.close");
    panel.classList.add("open");
  });
  panel?.addEventListener("click", e => {
    if (e.target === panel) panel.classList.remove("open");
  });
  document.getElementById("settings-close")?.addEventListener("click", () => panel.classList.remove("open"));
  panel?.querySelectorAll("[data-set-lang]").forEach(b => {
    b.addEventListener("click", () => {
      setLang(b.dataset.setLang);
      panel.classList.remove("open");
      render();
    });
  });
}

render();
setupSettings();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
