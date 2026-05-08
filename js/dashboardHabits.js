/**
 * Syncs home dashboard quick habits (workout / prep / supps / water) with
 * healthStore.habits and legacy np_checkin_YYYY-MM-DD for one release window.
 */

import { getHealthState, setHealthState } from "./healthStore.js";
import { todayKey } from "./foodLog.js";

export const BUILTIN_HABIT_IDS = ["workout", "prep", "supps", "water"];

function checkinStorageKey(d = todayKey()) {
  return `np_checkin_${d}`;
}

function getCheckinLegacy() {
  try {
    return JSON.parse(localStorage.getItem(checkinStorageKey()) || "{}");
  } catch {
    return {};
  }
}

function saveCheckinLegacy(obj) {
  localStorage.setItem(checkinStorageKey(), JSON.stringify(obj));
}

/** Ensure four dashboard rows exist in healthStore and merge legacy check-in once per day. */
export function ensureBuiltinHabitSlots(iconsById) {
  const s = getHealthState();
  const list = [...(s.habits.habits || [])];
  const map = new Map(list.map((h) => [h.id, h]));
  const d = todayKey();
  const legacy = getCheckinLegacy();

  for (const id of BUILTIN_HABIT_IDS) {
    if (!map.has(id)) {
      list.push({
        id,
        name: id,
        icon: iconsById[id] || "✓",
        completions: [],
      });
      map.set(id, list[list.length - 1]);
    }
    const h = map.get(id);
    if (legacy[id] && !(h.completions || []).includes(d)) {
      h.completions = [...(h.completions || []), d];
    }
  }

  s.habits.habits = list;
  setHealthState(s);
}

export function updateBuiltinHabitLabels(labelsById) {
  const s = getHealthState();
  for (const h of s.habits.habits || []) {
    if (labelsById[h.id]) h.name = labelsById[h.id];
  }
  setHealthState(s);
}

export function isBuiltinHabitDone(id) {
  if (!BUILTIN_HABIT_IDS.includes(id)) return false;
  const d = todayKey();
  const h = (getHealthState().habits.habits || []).find((x) => x.id === id);
  if (h?.completions?.includes(d)) return true;
  return !!getCheckinLegacy()[id];
}

/** Keep dashboard “water” habit aligned with glass count vs daily goal. */
export function syncWaterHabitFromGlasses(waterCount, glassGoal) {
  const d = todayKey();
  const goal = Math.max(1, Number(glassGoal) || 8);
  const wantDone = waterCount >= goal;

  const s = getHealthState();
  const habits = [...(s.habits.habits || [])];
  let h = habits.find((x) => x.id === "water");
  if (!h) {
    h = { id: "water", name: "Water", icon: "💧", completions: [] };
    habits.push(h);
  }
  const set = new Set(h.completions || []);
  if (wantDone) set.add(d);
  else set.delete(d);
  h.completions = [...set];
  s.habits.habits = habits;
  setHealthState(s);

  const cur = getCheckinLegacy();
  if (wantDone) cur.water = true;
  else delete cur.water;
  saveCheckinLegacy(cur);
}

export function toggleBuiltinHabit(id) {
  if (!BUILTIN_HABIT_IDS.includes(id)) return;
  const d = todayKey();
  const s = getHealthState();
  const habits = [...(s.habits.habits || [])];
  let h = habits.find((x) => x.id === id);
  if (!h) {
    h = { id, name: id, icon: "✓", completions: [] };
    habits.push(h);
  }
  const set = new Set(h.completions || []);
  if (set.has(d)) set.delete(d);
  else set.add(d);
  h.completions = [...set];
  s.habits.habits = habits;
  setHealthState(s);

  const cur = getCheckinLegacy();
  if (set.has(d)) cur[id] = true;
  else delete cur[id];
  saveCheckinLegacy(cur);
}
