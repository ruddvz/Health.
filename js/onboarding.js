import { t } from "./i18n.js";
import { setLang, setProfile, setPlan } from "./store.js";
import { generatePlan } from "./plangen.js";

const STEPS = 16;
let step = 0;
let data = {
  name: "",
  goal: "cut",
  durationWeeks: 12,
  weight_kg: 70,
  height_cm: 170,
  age: 28,
  sex: "male",
  activityLevel: "moderate",
  trainingDays: 4,
  dietType: "veg",
  foodPrefs: [],
  supplements: [],
  city: "",
};

let weightUnit = "kg";
const root = document.getElementById("onb-root");
const backBtn = document.getElementById("onb-back");
const progressFill = document.getElementById("progress-fill");

function kgFrom(lbs) {
  return Math.round((lbs / 2.20462) * 10) / 10;
}
function lbsFrom(kg) {
  return Math.round(kg * 2.20462);
}

function setProgress() {
  const pct = ((step + 1) / STEPS) * 100;
  if (progressFill) progressFill.style.width = `${pct}%`;
}

function render() {
  setProgress();
  if (backBtn) {
    backBtn.classList.toggle("visible", step > 0 && step < 15);
  }

  if (step === 0) {
    root.innerHTML = `
      <div class="page-enter">
        <p class="app-brand">NutriPal</p>
        <h1 class="step-title">${t("lang.pick")}</h1>
        <div class="lang-grid">
          <button type="button" class="glass lang-card" data-lang="en">
            <h2>${t("lang.en")}</h2>
            <p>${t("lang.sample_en")}</p>
          </button>
          <button type="button" class="glass lang-card" data-lang="hi">
            <h2>${t("lang.hi")} हिंग्लिश</h2>
            <p>${t("lang.sample_hi")}</p>
          </button>
          <button type="button" class="glass lang-card" data-lang="gu">
            <h2>${t("lang.gu") ગુજ્લિશ</h2>
            <p>${t("lang.sample_gu")}</p>
          </button>
        </div>
      </div>`;
    root.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
        step = 1;
        render();
      });
    });
    return;
  }

  if (step === 1) {
    root.innerHTML = `
      <div class="page-enter">
        <p class="app-brand">NutriPal</p>
        <h1 class="step-title">${t("lang.sample_" + (localStorage.getItem("np_lang") || "en"))}</h1>
        <p class="step-sub">${t("onb.tap_begin")}</p>
        <div class="splash-tap"><button type="button" class="btn btn-primary" id="splash-go">${t("onb.next")}</button></div>
      </div>`;
    document.getElementById("splash-go").addEventListener("click", () => advance());
    return;
  }

  let body = "";

  if (step === 2) {
    body = `<h1 class="step-title">${t("onb.q_name")}</h1>
      <label class="label">${t("onb.q_name")}</label>
      <input class="field" id="f-name" value="${data.name.replace(/"/g, "&quot;")}" autocomplete="name">`;
  } else if (step === 3) {
    body = `<h1 class="step-title">${t("onb.q_goal")}</h1>
      <div class="option-grid cols-3">
        ${["cut", "build", "recomp"]
          .map(
            (g) =>
              `<button type="button" class="option-big ${data.goal === g ? "selected" : ""}" data-g="${g}">${t("onb.goal_" + g)}</button>`
          )
          .join("")}</div>`;
  } else if (step === 4) {
    const opts = [
      [4, "w4"],
      [8, "w8"],
      [12, "w12"],
      [16, "w16"],
      [24, "w24"],
      [52, "w52"],
    ];
    body = `<h1 class="step-title">${t("onb.q_duration")}</h1>
      <div class="option-grid">${opts
        .map(
          ([w, key]) =>
            `<button type="button" class="option-big ${data.durationWeeks === w ? "selected" : ""}" data-w="${w}">${t("onb." + key)}</button>`
        )
        .join("")}</div>
      <label class="label" style="margin-top:16px">${t("onb.custom_duration")}</label>
      <input class="field" type="number" min="1" max="104" id="f-custom-w" placeholder="12" value="${data.durationWeeks}">`;
  } else if (step === 5) {
    const disp = weightUnit === "kg" ? data.weight_kg : lbsFrom(data.weight_kg);
    body = `<h1 class="step-title">${t("onb.q_weight")}</h1>
      <div class="slider-row"><span id="weight-disp">${disp}${weightUnit === "kg" ? " kg" : " lb"}</span>
      <div class="toggle" style="margin-left:auto"><button type="button" class="${weightUnit === "kg" ? "active" : ""}" data-wu="kg">kg</button><button type="button" class="${weightUnit === "lbs" ? "active" : ""}" data-wu="lbs">lb</button></div></div>
      <input type="range" id="f-weight" min="${weightUnit === "kg" ? 40 : 88}" max="${weightUnit === "kg" ? 180 : 400}" step="1" value="${disp}">`;
  } else if (step === 6) {
    body = `<h1 class="step-title">${t("onb.q_height")}</h1>
      <div class="slider-row"><span id="height-disp">${data.height_cm} cm</span></div>
      <input type="range" id="f-height" min="140" max="210" step="1" value="${data.height_cm}">`;
  } else if (step === 7) {
    body = `<h1 class="step-title">${t("onb.q_age")}</h1>
      <div class="number-stepper">
        <button type="button" id="age-minus">−</button><div class="value" id="age-val">${data.age}</div><button type="button" id="age-plus">+</button>
      </div>`;
  } else if (step === 8) {
    body = `<h1 class="step-title">${t("onb.q_sex")}</h1>
      <div class="option-grid cols-3">
        ${[
          ["male", "m"],
          ["female", "f"],
          ["other", "x"],
        ]
          .map(
            ([val, key]) =>
              `<button type="button" class="option-big ${data.sex === val ? "selected" : ""}" data-s="${val}">${t("onb.sex_" + key)}</button>`
          )
          .join("")}</div>`;
  } else if (step === 9) {
    const acts = ["sedentary", "light", "moderate", "high"];
    body = `<h1 class="step-title">${t("onb.q_activity")}</h1>
      <div class="option-grid">${acts
        .map(
          (a) =>
            `<button type="button" class="option-big ${data.activityLevel === a ? "selected" : ""}" data-a="${a}">${t("onb.act_" + (a === "sedentary" ? "sed" : a === "light" ? "light" : a === "moderate" ? "mod" : "high"))}</button>`
        )
        .join("")}</div>`;
  } else if (step === 10) {
    body = `<h1 class="step-title">${t("onb.q_train")}</h1>
      <div class="option-grid cols-3">${[1, 2, 3, 4, 5, 6, 7]
        .map(
          (n) =>
            `<button type="button" class="option-big ${data.trainingDays === n ? "selected" : ""}" data-td="${n}">${n}</button>`
        )
        .join("")}</div>`;
  } else if (step === 11) {
    body = `<h1 class="step-title">${t("onb.q_diet")}</h1>
      <div class="option-grid">${["nonveg", "veg", "eggetarian", "vegan"]
        .map(
          (d) =>
            `<button type="button" class="option-big ${data.dietType === d ? "selected" : ""}" data-d="${d}">${t("onb.diet_" + (d === "nonveg" ? "nv" : d === "eggetarian" ? "egg" : d))}</button>`
        )
        .join("")}</div>`;
  } else if (step === 12) {
    const prefs = ["nodairy", "nogluten", "nopork", "jain", "halal"];
    body = `<h1 class="step-title">${t("onb.q_prefs")}</h1>
      <div class="chip-grid">${prefs
        .map((p) => {
          const on = data.foodPrefs.includes(p);
          return `<button type="button" class="chip ${on ? "selected" : ""}" data-p="${p}">${t("onb.pref_" + p)}</button>`;
        })
        .join("")}</div>`;
  } else if (step === 13) {
    const sups = ["creatine", "whey", "pre", "omega", "multi", "mag", "ash", "none"];
    body = `<h1 class="step-title">${t("onb.q_supps")}</h1>
      <div class="chip-grid">${sups
        .map((s) => {
          const on = data.supplements.includes(s);
          return `<button type="button" class="chip ${on ? "selected" : ""}" data-supp="${s}">${t("onb.supp_" + s)}</button>`;
        })
        .join("")}</div>`;
  } else if (step === 14) {
    body = `<h1 class="step-title">${t("onb.q_city")}</h1>
      <input class="field" id="f-city" placeholder="${t("onb.city_ph")}" value="${data.city.replace(/"/g, "&quot;")}">`;
  } else if (step === 15) {
    body = `<h1 class="step-title">${t("onb.loading")}</h1><div class="loading-bar"><div class="progress-track"><div class="progress-fill" id="load-bar" style="width:5%"></div></div></div>`;
  }

  root.innerHTML = `<div class="page-enter">${body}${
    step >= 2 && step < 15
      ? `<div class="footer-actions"><button type="button" class="btn btn-primary" id="onb-next">${t("onb.next")}</button>${
          step === 14 ? `<button type="button" class="btn btn-ghost" id="onb-skip">${t("onb.skip")}</button>` : ""
        }</div>`
      : ""
  }</div>`;

  wireStep();
}

function wireStep() {
  if (step === 3) {
    root.querySelectorAll("[data-g]").forEach((b) =>
      b.addEventListener("click", () => {
        data.goal = b.dataset.g;
        root.querySelectorAll("[data-g]").forEach((x) => x.classList.toggle("selected", x.dataset.g === data.goal));
      })
    );
  }
  if (step === 4) {
    root.querySelectorAll("[data-w]").forEach((b) =>
      b.addEventListener("click", () => {
        data.durationWeeks = +b.dataset.w;
        root.querySelectorAll("[data-w]").forEach((x) => x.classList.toggle("selected", +x.dataset.w === data.durationWeeks));
        const ci = document.getElementById("f-custom-w");
        if (ci) ci.value = data.durationWeeks;
      })
    );
  }
  if (step === 5) {
    root.querySelectorAll("[data-wu]").forEach((b) =>
      b.addEventListener("click", () => {
        weightUnit = b.dataset.wu;
        render();
      })
    );
    const r = document.getElementById("f-weight");
    const wd = document.getElementById("weight-disp");
    const update = () => {
      const v = +r.value;
      data.weight_kg = weightUnit === "kg" ? v : kgFrom(v);
      if (wd) wd.textContent = `${v}${weightUnit === "kg" ? " kg" : " lb"}`;
    };
    r.addEventListener("input", update);
  }
  if (step === 6) {
    const r = document.getElementById("f-height");
    const disp = document.getElementById("height-disp");
    const sync = () => {
      data.height_cm = +r.value;
      disp.textContent = `${data.height_cm} cm`;
    };
    r.addEventListener("input", sync);
    sync();
  }
  if (step === 7) {
    document.getElementById("age-minus").addEventListener("click", () => {
      data.age = Math.max(14, data.age - 1);
      document.getElementById("age-val").textContent = data.age;
    });
    document.getElementById("age-plus").addEventListener("click", () => {
      data.age = Math.min(90, data.age + 1);
      document.getElementById("age-val").textContent = data.age;
    });
  }
  if (step === 8) {
    root.querySelectorAll("[data-s]").forEach((b) =>
      b.addEventListener("click", () => {
        data.sex = b.dataset.s;
        root.querySelectorAll("[data-s]").forEach((x) => x.classList.toggle("selected", x.dataset.s === data.sex));
      })
    );
  }
  if (step === 9) {
    root.querySelectorAll("[data-a]").forEach((b) =>
      b.addEventListener("click", () => {
        data.activityLevel = b.dataset.a;
        root.querySelectorAll("[data-a]").forEach((x) => x.classList.toggle("selected", x.dataset.a === data.activityLevel));
      })
    );
  }
  if (step === 10) {
    root.querySelectorAll("[data-td]").forEach((b) =>
      b.addEventListener("click", () => {
        data.trainingDays = +b.dataset.td;
        root.querySelectorAll("[data-td]").forEach((x) => x.classList.toggle("selected", +x.dataset.td === data.trainingDays));
      })
    );
  }
  if (step === 11) {
    root.querySelectorAll("[data-d]").forEach((b) =>
      b.addEventListener("click", () => {
        data.dietType = b.dataset.d;
        root.querySelectorAll("[data-d]").forEach((x) => x.classList.toggle("selected", x.dataset.d === data.dietType));
      })
    );
  }
  if (step === 12) {
    root.querySelectorAll("[data-p]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = b.dataset.p;
        if (data.foodPrefs.includes(p)) data.foodPrefs = data.foodPrefs.filter((x) => x !== p);
        else data.foodPrefs.push(p);
        b.classList.toggle("selected", data.foodPrefs.includes(p));
      })
    );
  }
  if (step === 13) {
    root.querySelectorAll("[data-supp]").forEach((b) =>
      b.addEventListener("click", () => {
        const s = b.dataset.supp;
        if (s === "none") {
          data.supplements = ["none"];
          root.querySelectorAll("[data-supp]").forEach((x) => x.classList.toggle("selected", x.dataset.supp === "none"));
        } else {
          data.supplements = data.supplements.filter((x) => x !== "none");
          if (data.supplements.includes(s)) data.supplements = data.supplements.filter((x) => x !== s);
          else data.supplements.push(s);
          b.classList.toggle("selected", data.supplements.includes(s));
        }
      })
    );
  }

  const next = document.getElementById("onb-next");
  if (next) {
    next.addEventListener("click", () => advance());
  }
  const skip = document.getElementById("onb-skip");
  if (skip) skip.addEventListener("click", () => advance(true));

  if (step === 15) {
    const bar = document.getElementById("load-bar");
    let p = 5;
    const id = setInterval(() => {
      p += 12;
      if (bar) bar.style.width = `${Math.min(p, 100)}%`;
      if (p >= 100) {
        clearInterval(id);
        finish();
      }
    }, 280);
  }
}

function advance(skipCity) {
  if (step === 1) {
    step += 1;
    render();
    return;
  }
  if (step === 2) {
    const n = document.getElementById("f-name")?.value.trim();
    if (!n) return;
    data.name = n;
  }
  if (step === 4) {
    const c = document.getElementById("f-custom-w");
    if (c && c.value) {
      const w = Math.min(104, Math.max(1, +c.value));
      if (!Number.isNaN(w)) data.durationWeeks = w;
    }
  }
  if (step === 5) {
    const r = document.getElementById("f-weight");
    if (r) {
      const v = +r.value;
      data.weight_kg = weightUnit === "kg" ? v : kgFrom(v);
    }
  }
  if (step === 6) {
    const r = document.getElementById("f-height");
    if (r) data.height_cm = +r.value;
  }
  if (step === 14) {
    if (!skipCity) {
      const c = document.getElementById("f-city")?.value.trim() || "";
      data.city = c;
    }
  }
  if (step === 13 && !data.supplements.length) data.supplements = ["none"];

  step += 1;
  render();
}

function finish() {
  const profile = {
    name: data.name,
    goal: data.goal,
    durationWeeks: data.durationWeeks,
    weight_kg: data.weight_kg,
    height_cm: data.height_cm,
    age: data.age,
    sex: data.sex,
    activityLevel: data.activityLevel,
    trainingDays: data.trainingDays,
    dietType: data.dietType,
    foodPrefs: data.foodPrefs,
    supplements: data.supplements,
    city: data.city,
  };
  setProfile(profile);
  setPlan(generatePlan(profile));
  window.location.href = "app.html";
}

function initOnboarding() {
  if (!localStorage.getItem("np_lang")) step = 0;
  else step = 1;
  render();
}

document.getElementById("onb-back")?.addEventListener("click", () => {
  if (step > 0 && step < 15) {
    step -= 1;
    render();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

initOnboarding();
