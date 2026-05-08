import { t } from "./i18n.js";
import { setLang, setProfile, setPlan, getProfile, getPlan } from "./store.js";
import { generatePlan } from "./plangen.js";
import { initHealthState } from "./healthStore.js";
import { applyThemeFromHealthStore } from "./themeApply.js";

initHealthState();
applyThemeFromHealthStore();

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

  // ── Step 0: Language picker ──────────────────────────
  if (step === 0) {
    root.innerHTML = `
      <div class="page-enter">
        <p class="app-brand" style="margin-bottom:24px">Health</p>
        <h1 class="step-title">${t("lang.pick")}</h1>
        <p class="step-sub">Your language. Your plan.</p>
        <div class="lang-grid">
          <button type="button" class="glass lang-card" data-lang="en">
            <div class="lang-card-flag">🇺🇸</div>
            <div class="lang-card-name">${t("lang.en")}</div>
            <p class="lang-card-sample">"${t("lang.sample_en")}"</p>
            <span class="lang-card-arrow">›</span>
          </button>
          <button type="button" class="glass lang-card" data-lang="hi">
            <div class="lang-card-flag">🇮🇳</div>
            <div class="lang-card-name">${t("lang.hi")} <span style="font-size:0.9rem;opacity:0.6">हिंग्लिश</span></div>
            <p class="lang-card-sample">"${t("lang.sample_hi")}"</p>
            <span class="lang-card-arrow">›</span>
          </button>
          <button type="button" class="glass lang-card" data-lang="gu">
            <div class="lang-card-flag">🇮🇳</div>
            <div class="lang-card-name">${t("lang.gu")} <span style="font-size:0.9rem;opacity:0.6">ગુજ્લિશ</span></div>
            <p class="lang-card-sample">"${t("lang.sample_gu")}"</p>
            <span class="lang-card-arrow">›</span>
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

  // ── Step 1: Splash ───────────────────────────────────
  if (step === 1) {
    const lang = localStorage.getItem("np_lang") || "en";
    root.innerHTML = `
      <div class="page-enter splash-wrap">
        <div>
          <div class="splash-brand">Health.</div>
          <h1 class="splash-headline">${t("lang.sample_" + lang)}</h1>
          <p class="splash-sub">Built around your body, your goal, and your life. Not a generic plan — yours.</p>
        </div>
        <div class="splash-tap">
          <button type="button" class="btn btn-primary" id="splash-go" style="font-size:1.05rem">
            ${t("onb.next")} →
          </button>
        </div>
      </div>`;
    document.getElementById("splash-go").addEventListener("click", () => advance());
    return;
  }

  // ── Steps 2–14: Form steps ───────────────────────────
  let body = "";

  if (step === 2) {
    body = `
      <div class="step-eyebrow">Step 1 / 13</div>
      <h1 class="step-title">${t("onb.q_name")}</h1>
      <p class="step-sub">This is how we'll address you throughout your plan.</p>
      <input class="field" id="f-name" placeholder="Your name" value="${data.name.replace(/"/g, "&quot;")}" autocomplete="given-name" autofocus>`;

  } else if (step === 3) {
    body = `
      <div class="step-eyebrow">Step 2 / 13</div>
      <h1 class="step-title">${t("onb.q_goal")}</h1>
      <p class="step-sub">This shapes everything — calories, macros, phase structure.</p>
      <div class="option-grid cols-3" style="margin-top:20px">
        <button type="button" class="option-big ${data.goal === "cut" ? "selected" : ""}" data-g="cut">
          <span class="option-icon">🔥</span>
          ${t("onb.goal_cut")}
          <span class="option-desc">Lose fat</span>
        </button>
        <button type="button" class="option-big ${data.goal === "build" ? "selected" : ""}" data-g="build">
          <span class="option-icon">💪</span>
          ${t("onb.goal_build")}
          <span class="option-desc">Gain muscle</span>
        </button>
        <button type="button" class="option-big ${data.goal === "recomp" ? "selected" : ""}" data-g="recomp">
          <span class="option-icon">⚡</span>
          ${t("onb.goal_recomp")}
          <span class="option-desc">Both at once</span>
        </button>
      </div>`;

  } else if (step === 4) {
    const opts = [
      [4, "w4"], [8, "w8"], [12, "w12"],
      [16, "w16"], [24, "w24"], [52, "w52"],
    ];
    body = `
      <div class="step-eyebrow">Step 3 / 13</div>
      <h1 class="step-title">${t("onb.q_duration")}</h1>
      <p class="step-sub">Longer plans build deeper habits. Shorter ones are great for testing.</p>
      <div class="option-grid" style="margin-top:20px">
        ${opts.map(([w, key]) =>
          `<button type="button" class="option-big ${data.durationWeeks === w ? "selected" : ""}" data-w="${w}">${t("onb." + key)}</button>`
        ).join("")}
      </div>
      <div style="margin-top:16px">
        <label class="label">Custom (weeks)</label>
        <input class="field" type="number" min="1" max="104" id="f-custom-w" placeholder="e.g. 20" value="${data.durationWeeks}">
      </div>`;

  } else if (step === 5) {
    const disp = weightUnit === "kg" ? data.weight_kg : lbsFrom(data.weight_kg);
    body = `
      <div class="step-eyebrow">Step 4 / 13</div>
      <h1 class="step-title">${t("onb.q_weight")}</h1>
      <p class="step-sub">Used to calculate your calorie target and protein goal.</p>
      <div class="big-number-display">
        <span class="big-number-val" id="weight-disp">${disp}</span><span class="big-number-unit">${weightUnit === "kg" ? "kg" : "lb"}</span>
      </div>
      <div class="slider-header" style="margin-top:8px">
        <span class="label" style="margin:0">Drag to adjust</span>
        <div class="toggle">
          <button type="button" class="${weightUnit === "kg" ? "active" : ""}" data-wu="kg">kg</button>
          <button type="button" class="${weightUnit === "lbs" ? "active" : ""}" data-wu="lbs">lb</button>
        </div>
      </div>
      <input type="range" id="f-weight" min="${weightUnit === "kg" ? 40 : 88}" max="${weightUnit === "kg" ? 180 : 400}" step="1" value="${disp}" style="margin-top:16px">`;

  } else if (step === 6) {
    body = `
      <div class="step-eyebrow">Step 5 / 13</div>
      <h1 class="step-title">${t("onb.q_height")}</h1>
      <p class="step-sub">Height + weight together give us your BMR baseline.</p>
      <div class="big-number-display">
        <span class="big-number-val" id="height-disp">${data.height_cm}</span><span class="big-number-unit">cm</span>
      </div>
      <label class="label" style="margin-top:16px">Drag to adjust</label>
      <input type="range" id="f-height" min="140" max="220" step="1" value="${data.height_cm}">`;

  } else if (step === 7) {
    body = `
      <div class="step-eyebrow">Step 6 / 13</div>
      <h1 class="step-title">${t("onb.q_age")}</h1>
      <p class="step-sub">Affects your metabolism calculation.</p>
      <div class="number-stepper">
        <button type="button" id="age-minus">−</button>
        <div class="value" id="age-val">${data.age}</div>
        <button type="button" id="age-plus">+</button>
      </div>`;

  } else if (step === 8) {
    body = `
      <div class="step-eyebrow">Step 7 / 13</div>
      <h1 class="step-title">${t("onb.q_sex")}</h1>
      <p class="step-sub">Biological sex determines which BMR formula we use.</p>
      <div class="option-grid cols-3" style="margin-top:20px">
        ${[["male","m"],["female","f"],["other","x"]].map(([val, key]) =>
          `<button type="button" class="option-big ${data.sex === val ? "selected" : ""}" data-s="${val}">${t("onb.sex_" + key)}</button>`
        ).join("")}
      </div>`;

  } else if (step === 9) {
    const actMap = {
      sedentary: { icon: "🛋️", label: "Sedentary", desc: "Desk job, little movement" },
      light:     { icon: "🚶", label: "Light",     desc: "Some walking each day" },
      moderate:  { icon: "🏃", label: "Moderate",  desc: "Active most days" },
      high:      { icon: "🏋️", label: "Very active", desc: "Physical job or sport" },
    };
    body = `
      <div class="step-eyebrow">Step 8 / 13</div>
      <h1 class="step-title">${t("onb.q_activity")}</h1>
      <p class="step-sub">Activity outside the gym. This multiplies your BMR into a real TDEE.</p>
      <div class="option-grid" style="margin-top:20px">
        ${Object.entries(actMap).map(([val, m]) =>
          `<button type="button" class="option-big ${data.activityLevel === val ? "selected" : ""}" data-a="${val}">
            <span class="option-icon">${m.icon}</span>
            ${m.label}
            <span class="option-desc">${m.desc}</span>
          </button>`
        ).join("")}
      </div>`;

  } else if (step === 10) {
    body = `
      <div class="step-eyebrow">Step 9 / 13</div>
      <h1 class="step-title">${t("onb.q_train")}</h1>
      <p class="step-sub">How many days per week do you train or plan to train?</p>
      <div class="option-grid cols-3" style="margin-top:20px">
        ${[1,2,3,4,5,6,7].map(n =>
          `<button type="button" class="option-big ${data.trainingDays === n ? "selected" : ""}" data-td="${n}">${n}<span class="option-desc">${n === 1 ? "day" : "days"}</span></button>`
        ).join("")}
      </div>`;

  } else if (step === 11) {
    const dietMap = {
      nonveg: { icon: "🍗", label: "Non-Veg", desc: "Includes chicken, fish, eggs" },
      veg:    { icon: "🥗", label: "Vegetarian", desc: "No meat or fish" },
      eggetarian: { icon: "🥚", label: "Eggetarian", desc: "Veg + eggs" },
      vegan:  { icon: "🌱", label: "Vegan", desc: "No animal products" },
    };
    body = `
      <div class="step-eyebrow">Step 10 / 13</div>
      <h1 class="step-title">${t("onb.q_diet")}</h1>
      <p class="step-sub">This drives your entire meal plan. Every meal will be built for your diet.</p>
      <div class="option-grid" style="margin-top:20px">
        ${Object.entries(dietMap).map(([val, m]) =>
          `<button type="button" class="option-big ${data.dietType === val ? "selected" : ""}" data-d="${val}">
            <span class="option-icon">${m.icon}</span>
            ${m.label}
            <span class="option-desc">${m.desc}</span>
          </button>`
        ).join("")}
      </div>`;

  } else if (step === 12) {
    const prefs = ["nodairy","nogluten","nopork","jain","halal"];
    body = `
      <div class="step-eyebrow">Step 11 / 13</div>
      <h1 class="step-title">${t("onb.q_prefs")}</h1>
      <p class="step-sub">Select anything that applies. Skip if none do.</p>
      <div class="chip-grid">
        ${prefs.map(p =>
          `<button type="button" class="chip ${data.foodPrefs.includes(p) ? "selected" : ""}" data-p="${p}">${t("onb.pref_" + p)}</button>`
        ).join("")}
      </div>`;

  } else if (step === 13) {
    const catalog = ["creatine", "whey", "pre", "omega", "multi", "mag", "ash"];
    const selected = (data.supplements || []).filter((s) => s !== "none");
    body = `
      <div class="step-eyebrow">Step 12 / 13</div>
      <h1 class="step-title">${t("onb.q_supps")}</h1>
      <p class="step-sub">${t("onb.supp_hint")}</p>
      <label class="label" for="supp-dropdown">${t("onb.supp_pick")}</label>
      <select id="supp-dropdown" class="field supp-dropdown">
        <option value="">${t("onb.supp_placeholder")}</option>
        ${catalog.map((id) => `<option value="${id}">${t("onb.supp_" + id)}</option>`).join("")}
      </select>
      <div class="supp-selected-list">
        ${
          selected.length
            ? selected
                .map(
                  (id) => `
          <span class="supp-pill glass">
            ${t("onb.supp_" + id)}
            <button type="button" class="supp-remove" data-id="${id}" aria-label="Remove">×</button>
          </span>`
                )
                .join("")
            : `<p class="supp-empty">${t("onb.supp_empty")}</p>`
        }
      </div>
      <button type="button" class="btn btn-ghost supp-clear-btn" id="supp-clear-none">${t("onb.supp_none_clear")}</button>`;

  } else if (step === 14) {
    body = `
      <div class="step-eyebrow">Step 13 / 13</div>
      <h1 class="step-title">${t("onb.q_city")}</h1>
      <p class="step-sub">Optional. Used for local grocery store tips in your area.</p>
      <input class="field" id="f-city" placeholder="${t("onb.city_ph")}" value="${data.city.replace(/"/g, "&quot;")}">`;

  } else if (step === 15) {
    body = `
      <div class="loading-wrap">
        <h1 class="loading-title" id="load-title">Building your plan, ${data.name || "you"}…</h1>
        <p class="loading-sub">Calculating calories, macros, meals, and schedule.</p>
        <div class="progress-track">
          <div class="progress-fill" id="load-bar" style="width:5%"></div>
        </div>
        <div class="loading-stats" id="load-stats">
          <div class="stat-reveal" id="sr-1">
            <span class="stat-reveal-check">✓</span>
            <span>Daily target: <strong id="sr-kcal">—</strong></span>
          </div>
          <div class="stat-reveal" id="sr-2">
            <span class="stat-reveal-check">✓</span>
            <span>Protein goal: <strong id="sr-protein">—</strong></span>
          </div>
          <div class="stat-reveal" id="sr-3">
            <span class="stat-reveal-check">✓</span>
            <span>Plan length: <strong id="sr-weeks">—</strong></span>
          </div>
          <div class="stat-reveal" id="sr-4">
            <span class="stat-reveal-check">✓</span>
            <span>Diet type: <strong id="sr-diet">—</strong></span>
          </div>
        </div>
      </div>`;
  }

  root.innerHTML = `<div class="page-enter">${body}${
    step >= 2 && step < 15
      ? `<div class="footer-actions">
           <button type="button" class="btn btn-primary" id="onb-next">${t("onb.next")} →</button>
           ${step === 14
             ? `<button type="button" class="btn btn-ghost" id="onb-skip" style="color:var(--text-muted)">${t("onb.skip")}</button>`
             : ""}
         </div>`
      : ""
  }</div>`;

  wireStep();
}

function wireStep() {
  if (step === 3) {
    root.querySelectorAll("[data-g]").forEach(b =>
      b.addEventListener("click", () => {
        data.goal = b.dataset.g;
        root.querySelectorAll("[data-g]").forEach(x => x.classList.toggle("selected", x.dataset.g === data.goal));
      })
    );
  }
  if (step === 4) {
    root.querySelectorAll("[data-w]").forEach(b =>
      b.addEventListener("click", () => {
        data.durationWeeks = +b.dataset.w;
        root.querySelectorAll("[data-w]").forEach(x => x.classList.toggle("selected", +x.dataset.w === data.durationWeeks));
        const ci = document.getElementById("f-custom-w");
        if (ci) ci.value = data.durationWeeks;
      })
    );
  }
  if (step === 5) {
    root.querySelectorAll("[data-wu]").forEach(b =>
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
      if (wd) wd.textContent = v;
    };
    r.addEventListener("input", update);
  }
  if (step === 6) {
    const r = document.getElementById("f-height");
    const disp = document.getElementById("height-disp");
    const sync = () => {
      data.height_cm = +r.value;
      if (disp) disp.textContent = data.height_cm;
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
    root.querySelectorAll("[data-s]").forEach(b =>
      b.addEventListener("click", () => {
        data.sex = b.dataset.s;
        root.querySelectorAll("[data-s]").forEach(x => x.classList.toggle("selected", x.dataset.s === data.sex));
      })
    );
  }
  if (step === 9) {
    root.querySelectorAll("[data-a]").forEach(b =>
      b.addEventListener("click", () => {
        data.activityLevel = b.dataset.a;
        root.querySelectorAll("[data-a]").forEach(x => x.classList.toggle("selected", x.dataset.a === data.activityLevel));
      })
    );
  }
  if (step === 10) {
    root.querySelectorAll("[data-td]").forEach(b =>
      b.addEventListener("click", () => {
        data.trainingDays = +b.dataset.td;
        root.querySelectorAll("[data-td]").forEach(x => x.classList.toggle("selected", +x.dataset.td === data.trainingDays));
      })
    );
  }
  if (step === 11) {
    root.querySelectorAll("[data-d]").forEach(b =>
      b.addEventListener("click", () => {
        data.dietType = b.dataset.d;
        root.querySelectorAll("[data-d]").forEach(x => x.classList.toggle("selected", x.dataset.d === data.dietType));
      })
    );
  }
  if (step === 12) {
    root.querySelectorAll("[data-p]").forEach(b =>
      b.addEventListener("click", () => {
        const p = b.dataset.p;
        if (data.foodPrefs.includes(p)) data.foodPrefs = data.foodPrefs.filter(x => x !== p);
        else data.foodPrefs.push(p);
        b.classList.toggle("selected", data.foodPrefs.includes(p));
      })
    );
  }
  if (step === 13) {
    document.getElementById("supp-dropdown")?.addEventListener("change", (e) => {
      const sel = e.target;
      const v = sel?.value;
      if (!v) return;
      data.supplements = (data.supplements || []).filter((x) => x !== "none");
      if (!data.supplements.includes(v)) data.supplements.push(v);
      sel.value = "";
      render();
    });
    document.getElementById("supp-clear-none")?.addEventListener("click", () => {
      data.supplements = ["none"];
      render();
    });
    root.querySelectorAll(".supp-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        data.supplements = (data.supplements || []).filter((x) => x !== id);
        if (!data.supplements.length) data.supplements = ["none"];
        render();
      });
    });
  }

  const next = document.getElementById("onb-next");
  if (next) next.addEventListener("click", () => advance());
  const skip = document.getElementById("onb-skip");
  if (skip) skip.addEventListener("click", () => advance(true));

  if (step === 15) {
    // Pre-compute plan for stat reveals
    const previewProfile = { ...data };
    let previewPlan;
    try { previewPlan = generatePlan(previewProfile); } catch (_) { /* continue */ }

    const bar = document.getElementById("load-bar");
    const dietLabels = { nonveg: "Non-Veg 🍗", veg: "Vegetarian 🥗", eggetarian: "Eggetarian 🥚", vegan: "Vegan 🌱" };

    const milestones = [
      { pct: 28,  id: "sr-1", fill: () => {
        const el = document.getElementById("sr-kcal");
        if (el && previewPlan) el.textContent = `${previewPlan.targetCalories} kcal / day`;
      }},
      { pct: 55,  id: "sr-2", fill: () => {
        const el = document.getElementById("sr-protein");
        if (el && previewPlan) el.textContent = `${previewPlan.macro?.protein}g / day`;
      }},
      { pct: 78,  id: "sr-3", fill: () => {
        const el = document.getElementById("sr-weeks");
        if (el) el.textContent = `${data.durationWeeks} weeks`;
      }},
      { pct: 92,  id: "sr-4", fill: () => {
        const el = document.getElementById("sr-diet");
        if (el) el.textContent = dietLabels[data.dietType] || data.dietType;
      }},
    ];

    let p = 5;
    let milestoneDone = new Set();

    const id = setInterval(() => {
      p += 8;
      const capped = Math.min(p, 100);
      if (bar) bar.style.width = `${capped}%`;

      milestones.forEach(m => {
        if (p >= m.pct && !milestoneDone.has(m.id)) {
          milestoneDone.add(m.id);
          m.fill();
          const el = document.getElementById(m.id);
          if (el) el.classList.add("visible");
        }
      });

      if (p >= 100) {
        clearInterval(id);
        const title = document.getElementById("load-title");
        if (title) title.textContent = `Your plan is ready, ${data.name || ""}! 🎉`;
        setTimeout(finish, 700);
      }
    }, 180);
  }
}

function advance(skipCity) {
  if (step === 1) { step += 1; render(); return; }
  if (step === 2) {
    const n = document.getElementById("f-name")?.value.trim();
    if (!n) {
      document.getElementById("f-name")?.focus();
      return;
    }
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
  try {
    setProfile(profile);
    setPlan(generatePlan(profile));
  } catch (e) {
    // Save profile so app.html can regenerate the plan on load
    try { setProfile(profile); } catch (_) { /* ignore */ }
  }
  window.location.href = "app.html";
}

function initOnboarding() {
  // Already completed — go straight to the app.
  if (getProfile() && getPlan()) {
    window.location.replace("app.html");
    return;
  }
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
