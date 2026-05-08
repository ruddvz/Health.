/**
 * Plan0 unified app state — persisted under np_health_state (included in np_* backup export).
 * Coexists with legacy np_profile / np_plan / per-day food logs.
 */

const HEALTH_KEY = "np_health_state";

const defaultState = {
  version: 1,
  meals: {
    favorites: [],
    savedPlans: [],
    activeTemplateId: null,
  },
  grocery: {
    lists: [],
    activeListId: null,
    /** User-added lines (e.g. from templates) merged into Current list */
    manualItems: [],
  },
  workout: {
    log: [],
    programs: [],
    activeProgramId: null,
    customExercises: [],
    /** Active timer session (ephemeral; not always persisted) */
    draftSession: null,
  },
  habits: {
    habits: [],
  },
  stats: {
    photos: [],
  },
  settings: {
    waterGoal: 8,
    cupMl: 250,
    calorieGoal: null,
    theme: "auto",
    units: "metric",
    weekStart: "monday",
    notificationsEnabled: false,
  },
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(base, patch) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(patch)) {
    const pv = patch[k];
    const bv = out[k];
    if (pv && typeof pv === "object" && !Array.isArray(pv) && bv && typeof bv === "object" && !Array.isArray(bv)) {
      out[k] = deepMerge(bv, pv);
    } else {
      out[k] = pv;
    }
  }
  return out;
}

function getRaw() {
  try {
    const raw = localStorage.getItem(HEALTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getHealthState() {
  const raw = getRaw();
  if (!raw) return deepClone(defaultState);
  return deepMerge(deepClone(defaultState), raw);
}

export function setHealthState(next) {
  const merged = deepMerge(deepClone(defaultState), next);
  merged.version = defaultState.version;
  localStorage.setItem(HEALTH_KEY, JSON.stringify(merged));
  return merged;
}

/** Dot-path update e.g. "meals.favorites" */
export function updateHealth(path, value) {
  const state = getHealthState();
  const keys = path.split(".").filter(Boolean);
  let ref = state;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (ref[k] == null || typeof ref[k] !== "object") ref[k] = {};
    ref = ref[k];
  }
  ref[keys[keys.length - 1]] = value;
  setHealthState(state);
  return getHealthState();
}

export function initHealthState() {
  if (getRaw()) return getHealthState();
  return setHealthState({});
}

export { HEALTH_KEY, defaultState };
