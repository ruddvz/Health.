/**
 * localStorage helpers — contract from PLAN.md Section 11
 */
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
  const raw = localStorage.getItem(KEYS.profile);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setProfile(profile) {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

function getPlan() {
  const raw = localStorage.getItem(KEYS.plan);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setPlan(plan) {
  localStorage.setItem(KEYS.plan, JSON.stringify(plan));
}

function clearAll() {
  localStorage.removeItem(KEYS.lang);
  localStorage.removeItem(KEYS.profile);
  localStorage.removeItem(KEYS.plan);
}

export { KEYS, getLang, setLang, getProfile, setProfile, getPlan, setPlan, clearAll };
