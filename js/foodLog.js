/**
 * Daily food log — FEATURE_PLAN Feature 1 (np_food_log_YYYY-MM-DD)
 */
import { effectiveCalorieGoal, effectiveMacros } from "./effectiveTargets.js";

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function foodLogStorageKey() {
  return `np_food_log_${todayKey()}`;
}

export function mealMacrosFromPlan(mealKcal, plan) {
  const target = effectiveCalorieGoal(plan) || 1;
  const ratio = (mealKcal || 0) / target;
  const macro = effectiveMacros(plan);
  return {
    protein: Math.round(macro.protein * ratio * 10) / 10,
    carbs: Math.round(macro.carbs * ratio * 10) / 10,
    fat: Math.round(macro.fat * ratio * 10) / 10,
  };
}

export function getFoodLog() {
  try {
    return JSON.parse(localStorage.getItem(foodLogStorageKey()) || "[]");
  } catch {
    return [];
  }
}

export function setFoodLog(entries) {
  localStorage.setItem(foodLogStorageKey(), JSON.stringify(entries));
}

export function getFoodTotals() {
  return getFoodLog().reduce(
    (t, e) => ({
      kcal: t.kcal + (e.kcal || 0),
      protein: t.protein + (e.protein || 0),
      carbs: t.carbs + (e.carbs || 0),
      fat: t.fat + (e.fat || 0),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function buildMealLogEntry(slot, name, kcal, plan) {
  const m = mealMacrosFromPlan(kcal, plan);
  return { mealId: slot, name, kcal, protein: m.protein, carbs: m.carbs, fat: m.fat };
}

export function toggleMealEaten(slot, name, kcal, plan) {
  const log = getFoodLog();
  const idx = log.findIndex((e) => e.mealId === slot);
  if (idx >= 0) log.splice(idx, 1);
  else log.push(buildMealLogEntry(slot, name, kcal, plan));
  setFoodLog(log);
}

export function isMealEaten(slot) {
  return getFoodLog().some((e) => e.mealId === slot);
}

/** Free-form log line from Tools / food lookup (multiple entries allowed). */
export function appendCustomFoodToLog(name, kcal, protein, carbs, fat) {
  const log = getFoodLog();
  log.push({
    mealId: `food_${Date.now()}`,
    name,
    kcal: Math.round(kcal),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
  });
  setFoodLog(log);
}
