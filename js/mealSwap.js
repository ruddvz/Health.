/** Weekly meal name overrides — keys `${dayIndex}-${slot}` (Mon=0 … Sun=6). */
const KEY = "np_meal_swap_map";

export function swapKey(dayIdx, slot) {
  return `${dayIdx}-${slot}`;
}

export function getSwapMap() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function setSwapOverride(dayIdx, slot, displayName) {
  const m = getSwapMap();
  const k = swapKey(dayIdx, slot);
  if (displayName) m[k] = displayName;
  else delete m[k];
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function getSwapOverride(dayIdx, slot) {
  const v = getSwapMap()[swapKey(dayIdx, slot)];
  return v || null;
}
