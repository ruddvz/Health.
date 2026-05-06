import { getProfile, getPlan, setLang } from "./store.js";
import { t } from "./i18n.js";
import { mountHome } from "./pages/home.js";
import { mountPhases } from "./pages/phases.js";
import { mountMeals } from "./pages/meals.js";
import { mountPrep } from "./pages/prep.js";
import { mountGrocery } from "./pages/grocery.js";
import { mountSupps } from "./pages/supps.js";

let route = "home";

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
    ["grocery", "nav.grocery"],
    ["supps", "nav.supps"],
  ];
  nav.innerHTML = items
    .map(
      ([id, key]) => `
    <button type="button" class="nav-item ${route === id ? "active" : ""}" data-route="${id}">
      <span class="nav-dot"></span>
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
    grocery: mountGrocery,
    supps: mountSupps,
  };
  pages[route](main, profile, plan);
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

function setupSettings() {
  const panel = document.getElementById("settings-panel");
  document.getElementById("settings-btn").addEventListener("click", () => {
    document.getElementById("settings-title").textContent = t("settings.title");
    document.getElementById("settings-close").textContent = t("settings.close");
    panel.classList.add("open");
  });
  panel.addEventListener("click", (e) => {
    if (e.target === panel) panel.classList.remove("open");
  });
  document.getElementById("settings-close").addEventListener("click", () => panel.classList.remove("open"));
  panel.querySelectorAll("[data-set-lang]").forEach((b) => {
    b.addEventListener("click", () => {
      setLang(b.dataset.setLang);
      panel.classList.remove("open");
      render();
    });
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

