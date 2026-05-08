/**
 * Plan0 unified app state — persisted under np_health_state (included in np_* backup export).
 * Profile and plan live here; legacy np_profile / np_plan are migrated once and removed.
 */

const HEALTH_KEY = "np_health_state";

export function defaultReminderTimes() {
  return {
    breakfast: "07:00",
    snack: "10:30",
    lunch: "13:00",
    pre: "16:00",
    dinner: "19:30",
    bedtime: "22:15",
    water: "20:00",
  };
}

const defaultState = {
  version: 2,
  /** Onboarding profile (migrated from np_profile) */
  profile: null,
  /** Generated plan (migrated from np_plan) */
  plan: null,
  meals: {
    favorites: [],
    savedPlans: [],
    activeTemplateId: null,
  },
  grocery: {
    lists: [],
    activeListId: null,
    manualItems: [],
  },
  workout: {
    log: [],
    programs: [],
    activeProgramId: null,
    customExercises: [],
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
    macroOverride: { protein: null, carbs: null, fat: null },
    theme: "auto",
    units: "metric",
    weekStart: "monday",
    notificationsEnabled: false,
    reminderTimes: defaultReminderTimes(),
    /** NONE | INR | USD | EUR | GBP — display for future cost fields */
    currencyCode: "NONE",
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

function tryParseJson(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
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

/** Pull np_profile / np_plan into this blob once, then drop legacy keys. */
function migrateLegacyProfilePlan() {
  const lp = localStorage.getItem("np_profile");
  const lpl = localStorage.getItem("np_plan");
  if (!lp && !lpl) return;

  const raw = tryParseJson(localStorage.getItem(HEALTH_KEY));
  let merged = deepMerge(deepClone(defaultState), raw || {});
  let changed = false;

  if (lp) {
    const parsed = tryParseJson(lp);
    if (parsed) {
      if (merged.profile == null) {
        merged.profile = parsed;
        changed = true;
      }
      localStorage.removeItem("np_profile");
    }
  }
  if (lpl) {
    const parsed = tryParseJson(lpl);
    if (parsed) {
      if (merged.plan == null) {
        merged.plan = parsed;
        changed = true;
      }
      localStorage.removeItem("np_plan");
    }
  }

  if (changed) {
    merged.version = defaultState.version;
    localStorage.setItem(HEALTH_KEY, JSON.stringify(merged));
  }
}

export function getHealthState() {
  migrateLegacyProfilePlan();
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
