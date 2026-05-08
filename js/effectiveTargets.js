/**
 * Resolves calorie / macro targets: plan defaults with optional healthStore overrides.
 */
import { getHealthState } from "./healthStore.js";

export function effectiveCalorieGoal(plan) {
  const s = getHealthState().settings || {};
  if (s.calorieGoal != null && Number(s.calorieGoal) > 0) return Number(s.calorieGoal);
  return plan?.targetCalories ?? 0;
}

export function effectiveMacros(plan) {
  const m = plan?.macro || {};
  const o = getHealthState().settings?.macroOverride || {};
  const pick = (v, fallback) =>
    v != null && v !== "" && Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : fallback;
  return {
    protein: pick(o.protein, m.protein ?? 0),
    carbs: pick(o.carbs, m.carbs ?? 0),
    fat: pick(o.fat, m.fat ?? 0),
  };
}
