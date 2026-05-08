import { t } from "../i18n.js";
import { todayKey } from "../foodLog.js";
import { getHealthState, setHealthState } from "../healthStore.js";
import { filterExercises } from "../data/exercises.js";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultPrograms() {
  return [
    {
      id: "p-fullbody",
      name: "Full Body (3x)",
      type: "strength",
      days: [
        {
          label: "Day A",
          exercises: [
            { name: "Squat", sets: 3, reps: 8, weight: "" },
            { name: "Bench Press", sets: 3, reps: 8, weight: "" },
            { name: "Barbell Row", sets: 3, reps: 10, weight: "" },
          ],
        },
        {
          label: "Day B",
          exercises: [
            { name: "Romanian Deadlift", sets: 3, reps: 8, weight: "" },
            { name: "Overhead Press", sets: 3, reps: 8, weight: "" },
            { name: "Lat Pulldown", sets: 3, reps: 10, weight: "" },
          ],
        },
        {
          label: "Day C",
          exercises: [
            { name: "Leg Press", sets: 4, reps: 12, weight: "" },
            { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: "" },
            { name: "Cable Row", sets: 3, reps: 12, weight: "" },
          ],
        },
      ],
    },
    {
      id: "p-hiit",
      name: "HIIT Circuit",
      type: "cardio",
      days: [
        {
          label: "Circuit",
          exercises: [
            { name: "Burpees", sets: 4, reps: 12, weight: "" },
            { name: "Kettlebell Swing", sets: 4, reps: 15, weight: "" },
            { name: "Mountain Climbers", sets: 4, reps: 30, weight: "sec" },
          ],
        },
      ],
    },
  ];
}

function ensureWorkoutDefaults() {
  const s = getHealthState();
  if (s.workout.programs && s.workout.programs.length) return;
  const programs = defaultPrograms();
  s.workout.programs = programs;
  s.workout.activeProgramId = programs[0].id;
  setHealthState(s);
}

function activeProgram(state) {
  const id = state.workout.activeProgramId;
  return state.workout.programs.find((p) => p.id === id) || state.workout.programs[0];
}

function dayIndexMon0() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export function mountWorkout(root, profile, plan) {
  ensureWorkoutDefaults();
  let tab = "today";
  let muscle = "";
  let equipment = "";
  let exQ = "";
  let timerOpen = false;
  let restSec = 90;
  let restLeft = 0;
  let restHandle = null;
  let dayIdx = 0;

  function syncDayIdxFromCalendar() {
    const p = activeProgram(state());
    const n = p?.days?.length || 1;
    dayIdx = dayIndexMon0() % n;
  }

  syncDayIdxFromCalendar();

  function state() {
    return getHealthState();
  }

  function saveWorkout(s) {
    setHealthState(s);
  }

  function pushLog(entry) {
    const s = state();
    s.workout.log.unshift({
      id: uid(),
      date: todayKey(),
      ...entry,
    });
    s.workout.log = s.workout.log.slice(0, 120);
    saveWorkout(s);
  }

  function stopRest() {
    if (restHandle) clearInterval(restHandle);
    restHandle = null;
    restLeft = 0;
  }

  function startRest() {
    stopRest();
    restLeft = restSec;
    restHandle = setInterval(() => {
      restLeft -= 1;
      if (restLeft <= 0) stopRest();
      renderInner();
    }, 1000);
    renderInner();
  }

  function renderInner() {
    const s = state();
    const prog = activeProgram(s);
    const day = prog?.days[dayIdx % (prog.days.length || 1)] || { exercises: [], label: "Rest" };
    const log = s.workout.log || [];

    const exercises = filterExercises({ muscle: muscle || undefined, equipment: equipment || undefined, q: exQ });

    const timerOverlay =
      timerOpen && prog
        ? `
      <div class="workout-timer-overlay" id="wt-overlay">
        <div class="glass workout-timer-card">
          <div class="section-eyebrow">${t("workout.timer_title")}</div>
          <div class="workout-timer-rest">${restLeft > 0 ? `${restLeft}s rest` : t("workout.ready")}</div>
          <label class="label">${t("workout.rest_seconds")}</label>
          <input type="number" class="field" id="rest-input" min="15" max="300" step="5" value="${restSec}" />
          <div class="timer-actions">
            <button type="button" class="btn btn-outline" id="rest-start">${t("workout.start_rest")}</button>
            <button type="button" class="btn btn-ghost" id="timer-close">${t("workout.close_timer")}</button>
          </div>
          <p class="step-sub">${prog.name} · ${day.label}</p>
          <label class="label">${t("workout.duration_min")}</label>
          <input class="field" id="tw-min" type="number" min="5" max="240" value="45" />
          <ul class="wt-ex-list">
            ${(day.exercises || [])
              .map(
                (ex) => `
              <li class="wt-ex">
                <span>${ex.name}</span>
                <span class="wt-ex-meta">${ex.sets}×${ex.reps}${ex.weight ? ` @ ${ex.weight}` : ""}</span>
              </li>`
              )
              .join("")}
          </ul>
          <button type="button" class="btn btn-primary" id="finish-workout">${t("workout.finish")}</button>
        </div>
      </div>`
        : "";

    root.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="ph-eyebrow">// ${t("workout.eyebrow")}</div>
          <div class="ph-title">${t("workout.title")}</div>
          <div class="ph-desc">${t("workout.intro")}</div>
        </div>

        <div class="tabs">
          <button type="button" class="tab ${tab === "today" ? "active" : ""}" data-tab="today">${t("workout.tab_today")}</button>
          <button type="button" class="tab ${tab === "programs" ? "active" : ""}" data-tab="programs">${t("workout.tab_programs")}</button>
          <button type="button" class="tab ${tab === "history" ? "active" : ""}" data-tab="history">${t("workout.tab_history")}</button>
          <button type="button" class="tab ${tab === "exercises" ? "active" : ""}" data-tab="exercises">${t("workout.tab_exercises")}</button>
        </div>

        ${
          tab === "today"
            ? `
        <div class="glass" style="padding:16px;margin-bottom:12px">
          <div class="section-eyebrow" style="margin-top:0">${prog?.name || ""}</div>
          <div class="weekday-row" style="margin-bottom:12px">
            ${(prog?.days || []).map(
              (d, i) =>
                `<button type="button" class="day-pill ${i === dayIdx ? "active" : ""}" data-dayidx="${i}">${d.label}</button>`
            ).join("")}
          </div>
          ${(day.exercises || [])
            .map(
              (ex) => `
            <div class="prep-step" style="margin-bottom:8px">
              <div class="prep-step-num">${ex.sets}×${ex.reps}</div>
              <div>
                <div class="prep-step-title">${ex.name}</div>
                <div class="prep-step-body">${ex.weight ? t("workout.weight_hint") + " " + ex.weight : t("workout.log_weight_inline")}</div>
              </div>
            </div>`
            )
            .join("")}
          <button type="button" class="btn btn-primary" id="open-timer">${t("workout.start_timer")}</button>
        </div>
        <div class="glass" style="padding:16px">
          <div class="section-eyebrow" style="margin-top:0">${t("workout.quick_log")}</div>
          <label class="label">${t("workout.session_name")}</label>
          <input class="field" id="ql-name" placeholder="${t("workout.session_ph")}" />
          <label class="label">${t("workout.duration_min")}</label>
          <input class="field" id="ql-min" type="number" min="5" max="240" value="45" />
          <label class="label">${t("workout.notes")}</label>
          <textarea class="field" id="ql-notes" rows="2" placeholder="${t("workout.notes_ph")}"></textarea>
          <button type="button" class="btn btn-outline" id="ql-save">${t("workout.save_session")}</button>
        </div>`
            : ""
        }

        ${
          tab === "programs"
            ? `
        <div class="section-eyebrow">${t("workout.programs_pick")}</div>
        ${(s.workout.programs || [])
          .map(
            (p) => `
          <div class="glass" style="padding:14px 16px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div>
              <div style="font-weight:700">${p.name}</div>
              <div class="step-sub">${p.type} · ${p.days?.length || 0} ${t("workout.days")}</div>
            </div>
            <button type="button" class="btn btn-outline ${s.workout.activeProgramId === p.id ? "active" : ""}" data-set-prog="${p.id}">
              ${s.workout.activeProgramId === p.id ? t("workout.active") : t("workout.set_active")}
            </button>
          </div>`
          )
          .join("")}`
            : ""
        }

        ${
          tab === "history"
            ? `
        <div class="section-eyebrow">${t("workout.history_list")}</div>
        ${
          log.length
            ? log
                .map(
                  (row) => `
          <div class="glass" style="padding:12px 14px;margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;gap:8px">
              <strong>${row.name || t("workout.session")}</strong>
              <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">${row.date}</span>
            </div>
            <div class="step-sub">${row.durationMin || "?"} min · ${row.notes || "—"}</div>
          </div>`
                )
                .join("")
            : `<div class="empty-hint">${t("workout.history_empty")}</div>`
        }`
            : ""
        }

        ${
          tab === "exercises"
            ? `
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          <select class="field" id="ex-muscle" style="flex:1;min-width:120px">
            <option value="">${t("workout.all_muscles")}</option>
            ${["chest", "back", "legs", "shoulders", "arms", "core"]
              .map((m) => `<option value="${m}" ${muscle === m ? "selected" : ""}>${m}</option>`)
              .join("")}
          </select>
          <select class="field" id="ex-equip" style="flex:1;min-width:120px">
            <option value="">${t("workout.all_equipment")}</option>
            ${["barbell", "dumbbell", "cable", "bodyweight", "machine"]
              .map((m) => `<option value="${m}" ${equipment === m ? "selected" : ""}>${m}</option>`)
              .join("")}
          </select>
        </div>
        <input class="field" id="ex-q" placeholder="${t("workout.search_ex")}" />
        <div style="margin-top:12px;max-height:52vh;overflow:auto">
          ${exercises
            .slice(0, 80)
            .map(
              (e) => `
            <div class="glass" style="padding:10px 12px;margin-bottom:6px;font-size:0.85rem">
              <strong>${e.name}</strong>
              <span style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.68rem;margin-left:8px">${e.muscle} · ${e.equipment}</span>
            </div>`
            )
            .join("")}
        </div>`
            : ""
        }
      </div>
      ${timerOverlay}`;

    root.querySelectorAll("[data-tab]").forEach((b) => {
      b.addEventListener("click", () => {
        tab = b.dataset.tab;
        renderInner();
      });
    });

    root.querySelectorAll("[data-dayidx]").forEach((b) => {
      b.addEventListener("click", () => {
        dayIdx = +b.dataset.dayidx;
        renderInner();
      });
    });

    root.querySelector("#open-timer")?.addEventListener("click", () => {
      timerOpen = true;
      renderInner();
    });

    root.querySelector("#timer-close")?.addEventListener("click", () => {
      timerOpen = false;
      stopRest();
      renderInner();
    });

    root.querySelector("#rest-start")?.addEventListener("click", () => {
      const v = parseInt(root.querySelector("#rest-input")?.value || "90", 10);
      if (Number.isFinite(v) && v >= 15) restSec = v;
      startRest();
    });

    root.querySelector("#finish-workout")?.addEventListener("click", () => {
      const min = parseInt(root.querySelector("#tw-min")?.value || root.querySelector("#ql-min")?.value || "45", 10);
      pushLog({
        name: prog?.name + " · " + day.label,
        durationMin: Number.isFinite(min) ? min : 45,
        notes: t("workout.timer_completed"),
      });
      timerOpen = false;
      stopRest();
      renderInner();
    });

    root.querySelector("#ql-save")?.addEventListener("click", () => {
      const name = root.querySelector("#ql-name")?.value?.trim() || t("workout.session");
      const min = parseInt(root.querySelector("#ql-min")?.value || "0", 10);
      const notes = root.querySelector("#ql-notes")?.value?.trim() || "";
      pushLog({ name, durationMin: Number.isFinite(min) ? min : 0, notes });
      renderInner();
    });

    root.querySelectorAll("[data-set-prog]").forEach((b) => {
      b.addEventListener("click", () => {
        const ns = state();
        ns.workout.activeProgramId = b.dataset.setProg;
        saveWorkout(ns);
        syncDayIdxFromCalendar();
        renderInner();
      });
    });

    root.querySelector("#ex-muscle")?.addEventListener("change", (e) => {
      muscle = e.target.value;
      renderInner();
    });
    root.querySelector("#ex-equip")?.addEventListener("change", (e) => {
      equipment = e.target.value;
      renderInner();
    });
    let qTimer;
    root.querySelector("#ex-q")?.addEventListener("input", (e) => {
      clearTimeout(qTimer);
      qTimer = setTimeout(() => {
        exQ = e.target.value;
        renderInner();
      }, 200);
    });
  }

  renderInner();
}
