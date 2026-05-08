/**
 * Plan0 §11 — Push today's meal ingredients into grocery manualItems (deduped).
 */

import { buildDayMeals } from "./plangen.js";
import { getSwapOverride } from "./mealSwap.js";
import { getHealthState, setHealthState } from "./healthStore.js";

function uid() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function mondayBasedDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function isWorkoutDay(profile) {
  const mon = mondayBasedDayIndex();
  const td = Math.min(Math.max(profile.trainingDays || 4, 1), 7);
  return mon < td;
}

function inferCategory(name) {
  const n = String(name).toLowerCase();
  if (/(chicken|fish|salmon|tuna|beef|turkey|egg|prawn|shrimp|pork|lamb|steak|whey|protein|paneer|tofu|tempeh|yogurt|dahi|cottage|cheese|milk|curd)/.test(n)) return "protein";
  if (/(rice|oats|pasta|quinoa|bread|roti|naan|potato|sweet|cereal|granola|honey|sugar)/.test(n)) return "carbs";
  if (/(spinach|broccoli|pepper|onion|garlic|tomato|salad|lettuce|cucumber|carrot|veg|greens|kale|mushroom|lime|lemon|fruit|banana|apple|berry)/.test(n)) return "veg";
  if (/(butter|cream|ghee|oil|olive|almond|nut|avocado)/.test(n)) return "dairy";
  return "pantry";
}

/**
 * Adds ingredient lines from today's plan meals into grocery.manualItems.
 * @returns {number} number of new lines added
 */
export function importTodayMealsToGrocery(profile, plan) {
  const day = mondayBasedDayIndex();
  const forceRest = !isWorkoutDay(profile);
  const baseMeals = buildDayMeals(profile, day, plan.targetCalories, { forceRest });
  const meals = baseMeals.map((bm) => {
    const sw = getSwapOverride(day, bm.slot);
    return { ...bm, name: sw || bm.name };
  });

  const s = getHealthState();
  const existing = new Set(
    [...(plan.grocery || []).map((g) => g.name.toLowerCase()), ...(s.grocery.manualItems || []).map((x) => x.name.toLowerCase())]
  );

  const next = [...(s.grocery.manualItems || [])];
  let added = 0;

  for (const meal of meals) {
    for (const ing of meal.ingredients || []) {
      const rawName = ing.name?.trim();
      if (!rawName) continue;
      const key = rawName.toLowerCase();
      if (existing.has(key)) continue;
      existing.add(key);
      const grams = ing.grams;
      next.push({
        id: uid(),
        name: rawName,
        category: inferCategory(rawName),
        qty: grams != null ? grams : "",
        unit: grams != null ? "g" : "",
      });
      added++;
    }
  }

  s.grocery.manualItems = next;
  setHealthState(s);
  return added;
}
