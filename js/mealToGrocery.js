/**
 * Plan0 — Push today's meal ingredients into grocery manualItems (deduped + aggregated).
 */

import { buildDayMeals } from "./plangen.js";
import { getSwapOverride } from "./mealSwap.js";
import { getHealthState, setHealthState } from "./healthStore.js";
import { effectiveCalorieGoal } from "./effectiveTargets.js";

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

function normalizeIngredientKey(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^\d+(\.\d+)?\s*(g|kg|ml|l|oz|lb)\s+/i, "")
    .trim();
}

/** Parse leading quantity from display name e.g. "200 g chicken" or "1 cup oats". */
function parseLeadingAmount(name) {
  const s = String(name).trim();
  const m = s.match(/^(\d+(?:\.\d+)?)\s*(g|kg|ml|l|oz|lb)\b/i);
  if (!m) return { rest: s, grams: null };
  const n = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  let g = null;
  if (u === "g") g = n;
  else if (u === "kg") g = n * 1000;
  else if (u === "ml" || u === "l") g = u === "l" ? n * 1000 : n;
  else if (u === "oz") g = n * 28.35;
  else if (u === "lb") g = n * 453.6;
  const rest = s.slice(m[0].length).trim();
  return { rest, grams: g != null && Number.isFinite(g) ? Math.round(g) : null };
}

function inferCategory(name, planCat) {
  const c = String(planCat || "").toLowerCase();
  if (["protein", "carbs", "veg", "dairy", "pantry"].includes(c)) {
    if (c === "veg") return "veg";
    return c;
  }
  const n = String(name).toLowerCase();
  if (/(chicken|fish|salmon|tuna|beef|turkey|egg|prawn|shrimp|pork|lamb|steak|whey|protein|paneer|tofu|tempeh|yogurt|dahi|cottage|cheese|milk|curd|lentil|dal|chana|rajma)/.test(n))
    return "protein";
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
  const targetKcal = effectiveCalorieGoal(plan);
  const baseMeals = buildDayMeals(profile, day, targetKcal, { forceRest });
  const meals = baseMeals.map((bm) => {
    const sw = getSwapOverride(day, bm.slot);
    return { ...bm, name: sw || bm.name };
  });

  const s = getHealthState();
  const existing = new Set(
    [...(plan.grocery || []).map((g) => String(g.name || "").toLowerCase()), ...(s.grocery.manualItems || []).map((x) => String(x.name || "").toLowerCase())]
  );

  const acc = new Map();

  for (const meal of meals) {
    for (const ing of meal.ingredients || []) {
      const rawName = ing.name?.trim();
      if (!rawName) continue;
      let grams = ing.grams != null && Number.isFinite(Number(ing.grams)) ? Math.round(Number(ing.grams)) : null;
      let displayName = rawName;
      if (grams == null) {
        const parsed = parseLeadingAmount(rawName);
        if (parsed.grams != null) {
          grams = parsed.grams;
          displayName = parsed.rest || rawName;
        }
      }
      const key = normalizeIngredientKey(displayName);
      if (!key) continue;
      const cat = inferCategory(displayName, ing.category);
      const prev = acc.get(key);
      if (prev) {
        prev.grams = (prev.grams || 0) + (grams || 0);
        if (!prev.displayName && displayName) prev.displayName = displayName;
      } else {
        acc.set(key, { displayName: displayName || rawName, grams: grams || 0, category: cat });
      }
    }
  }

  const next = [...(s.grocery.manualItems || [])];
  let added = 0;

  for (const row of acc.values()) {
    const keyLower = normalizeIngredientKey(row.displayName);
    if (existing.has(keyLower)) continue;
    existing.add(keyLower);
    const g = row.grams > 0 ? Math.round(row.grams) : null;
    next.push({
      id: uid(),
      name: row.displayName,
      category: row.category,
      qty: g != null ? g : "",
      unit: g != null ? "g" : "",
    });
    added++;
  }

  s.grocery.manualItems = next;
  setHealthState(s);
  return added;
}
