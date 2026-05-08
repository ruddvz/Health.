/**
 * localStorage helpers — profile/plan are stored inside np_health_state (see healthStore.js).
 */
import { getHealthState, setHealthState } from "./healthStore.js";

const KEYS = {
  lang: "np_lang",
  profile: "np_profile",
  plan: "np_plan",
};

function getLang() {
  return localStorage.getItem(KEYS.lang) || "en";
}

function setLang(code) {
  localStorage.setItem(KEYS.lang, code);
}

function getProfile() {
  return getHealthState().profile ?? null;
}

function setProfile(profile) {
  const s = getHealthState();
  s.profile = profile;
  setHealthState(s);
}

function getPlan() {
  return getHealthState().plan ?? null;
}

function setPlan(plan) {
  const s = getHealthState();
  s.plan = plan;
  setHealthState(s);
}

function clearAll() {
  localStorage.removeItem(KEYS.lang);
  const s = getHealthState();
  s.profile = null;
  s.plan = null;
  setHealthState(s);
  localStorage.removeItem(KEYS.profile);
  localStorage.removeItem(KEYS.plan);
}

/** Export every `np_*` key (full device backup). */
function exportLocalBackup() {
  const keys = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("np_")) keys[k] = localStorage.getItem(k);
  }
  return JSON.stringify(
    {
      version: 1,
      app: "health-pwa-export",
      exportedAt: new Date().toISOString(),
      keys,
    },
    null,
    2
  );
}

/**
 * Restore backup from `exportLocalBackup` output, or a flat `{ "np_key": "value" }` object.
 * @returns {boolean}
 */
function importLocalBackup(jsonStr) {
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    return false;
  }
  const blob = parsed && typeof parsed === "object" ? parsed.keys || parsed : null;
  if (!blob || typeof blob !== "object") return false;
  let n = 0;
  for (const [k, v] of Object.entries(blob)) {
    if (typeof k === "string" && k.startsWith("np_") && typeof v === "string") {
      localStorage.setItem(k, v);
      n++;
    }
  }
  return n > 0;
}

/** Remove all `np_*` keys (full reset). */
function clearAllAppStorage() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("np_")) toRemove.push(k);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
}

export {
  KEYS,
  getLang,
  setLang,
  getProfile,
  setProfile,
  getPlan,
  setPlan,
  clearAll,
  exportLocalBackup,
  importLocalBackup,
  clearAllAppStorage,
};
