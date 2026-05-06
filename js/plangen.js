/**
 * Plan generation — TDEE, phases, meals, grocery, prep hints
 */
import { mealName } from "./i18n.js";

const ACTIVITY_MULT = { sedentary: 1.2, light: 1.375, moderate: 1.55, high: 1.725 };

const SLOTS = ["breakfast", "lunch", "snack", "pre", "dinner"];
const SLOT_SHARE = { breakfast: 0.22, lunch: 0.28, snack: 0.12, pre: 0.08, dinner: 0.3 };

function dietTemplateKey(profile) {
  const d = profile.dietType;
  if (d === "nonveg") return "nonveg";
  if (d === "vegan") return "vegan";
  return "veg";
}

function bmrKg(profile) {
  const w = profile.weight_kg;
  const h = profile.height_cm;
  const a = profile.age;
  const s = profile.sex;
  const male = 10 * w + 6.25 * h - 5 * a + 5;
  const female = 10 * w + 6.25 * h - 5 * a - 161;
  if (s === "male") return male;
  if (s === "female") return female;
  return (male + female) / 2;
}

function tdee(profile) {
  const mult = ACTIVITY_MULT[profile.activityLevel] || 1.2;
  return bmrKg(profile) * mult;
}

function calorieTarget(profile) {
  const base = tdee(profile);
  if (profile.goal === "cut") return Math.round(base - 400);
  if (profile.goal === "build") return Math.round(base + 200);
  return Math.round(base - 150);
}

function macros(profile, calories) {
  const w = profile.weight_kg;
  const protein = Math.round(w * (profile.goal === "cut" ? 2.2 : 2.0));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { protein, fat, carbs: Math.max(0, carbs) };
}

function buildPhases(profile) {
  const w = profile.durationWeeks;
  const goal = profile.goal;
  const baseKcal = calorieTarget(profile);
  const delta = goal === "build" ? 150 : 100;
  const phases = [];

  if (w <= 4) {
    phases.push({
      index: 1,
      weeks: w,
      calories: baseKcal,
      focus: "Habits + consistency",
      rotation: "Keep protein steady; rotate carb sources weekly.",
    });
  } else if (w <= 8) {
    phases.push({ index: 1, weeks: 4, calories: baseKcal, focus: "Foundation", rotation: "Master meal prep rhythm." });
    phases.push({
      index: 2,
      weeks: 4,
      calories: baseKcal + delta,
      focus: "Adaptation",
      rotation: "Swap similar proteins (chicken ↔ fish or paneer ↔ tofu).",
    });
  } else if (w <= 12) {
    phases.push({ index: 1, weeks: 4, calories: baseKcal, focus: "Foundation", rotation: "Dial in steps & sleep." });
    phases.push({ index: 2, weeks: 4, calories: baseKcal + delta, focus: "Build", rotation: "Add volume slowly on big lifts." });
    phases.push({
      index: 3,
      weeks: 4,
      calories: baseKcal + delta * 2,
      focus: "Burn",
      rotation: "Tighter portions on rest days if hunger is low.",
    });
  } else if (w <= 16) {
    const labels = ["Foundation", "Build", "Peak", "Taper"];
    const tips = ["Whole foods first", "Progressive overload", "Intensity focus", "Deload flavour swaps"];
    for (let i = 0; i < 4; i++) {
      phases.push({
        index: i + 1,
        weeks: 4,
        calories: baseKcal + delta * i - (i === 3 ? 50 : 0),
        focus: labels[i],
        rotation: tips[i],
      });
    }
  } else if (w <= 24) {
    for (let i = 0; i < 3; i++) {
      phases.push({
        index: i + 1,
        weeks: 4,
        calories: baseKcal + delta * i,
        focus: ["Foundation", "Build", "Peak"][i],
        rotation: "Indian staples rotate by day — see Meals tab.",
      });
    }
    phases.push({
      index: 4,
      weeks: w - 12,
      calories: baseKcal + delta * 2 - 60,
      focus: "Long runway",
      rotation: "Maintenance-style swaps; keep protein high.",
    });
  } else {
    const labels = ["Foundation", "Build", "Peak", "Year-end taper"];
    for (let i = 0; i < 4; i++) {
      const weeks = i < 3 ? 4 : Math.max(4, w - 12);
      phases.push({
        index: i + 1,
        weeks,
        calories: baseKcal + delta * i - (i === 3 ? 70 : 0),
        focus: labels[i],
        rotation: i === 3 ? "Two gentle re-run cycles after week 16." : "Weekly rotation keeps flavours fresh.",
      });
    }
    phases[3].note = "Year plan: repeat habits block twice in second half.";
  }

  phases.forEach((p) => {
    p.macro = macros(profile, p.calories);
  });
  let weekCursor = 1;
  for (const p of phases) {
    p.startWeek = weekCursor;
    p.endWeek = weekCursor + (p.weeks || 0) - 1;
    weekCursor = p.endWeek + 1;
  }
  return phases;
}

const JAIN_STRIP = /onion|garlic|potato|carrot|beetroot|leek/i;

function jainCleanLine(line) {
  if (!line) return line;
  if (JAIN_STRIP.test(line)) {
    return `${line.replace(JAIN_STRIP, "").replace(/\s+/g, " ").trim()} (+ hing/ginger)`;
  }
  return line;
}

function baseIngredients(profile, dayIndex, slot) {
  const dk = dietTemplateKey(profile);
  const isVegan = dk === "vegan";
  const isNon = dk === "nonveg";

  const templates = {
    nonveg: {
      breakfast: [
        { en: "Whole eggs", g: 150, kcal: 215, cat: "protein" },
        { en: "Whole wheat bread", g: 80, kcal: 200, cat: "carbs" },
        { en: "Banana", g: 120, kcal: 105, cat: "veg" },
      ],
      lunch: [
        { en: "Chicken breast", g: 200, kcal: 330, cat: "protein" },
        { en: "Cooked rice", g: 200, kcal: 260, cat: "carbs" },
        { en: "Broccoli", g: 150, kcal: 50, cat: "veg" },
      ],
      snack: [
        { en: "Greek yogurt", g: 150, kcal: 90, cat: "dairy" },
        { en: "Whey protein", g: 30, kcal: 120, cat: "protein" },
        { en: "Mixed nuts", g: 30, kcal: 180, cat: "dairy" },
      ],
      pre: [
        { en: "Banana", g: 100, kcal: 90, cat: "veg" },
        { en: "Rolled oats", g: 50, kcal: 190, cat: "carbs" },
      ],
      dinner: [
        { en: "Whey protein", g: 30, kcal: 120, cat: "protein" },
        { en: "Sweet potato", g: 200, kcal: 180, cat: "carbs" },
        { en: "Mixed salad", g: 100, kcal: 40, cat: "veg" },
      ],
    },
    veg: {
      breakfast: [
        { en: "Besan flour", g: 80, kcal: 300, cat: "carbs" },
        { en: "Low-fat yogurt", g: 150, kcal: 85, cat: "dairy" },
        { en: "Cooking oil", g: 10, kcal: 90, cat: "dairy" },
      ],
      lunch: [
        { en: "Paneer", g: 180, kcal: 440, cat: "protein" },
        { en: "Cooked rice", g: 180, kcal: 235, cat: "carbs" },
        { en: "Mixed salad", g: 120, kcal: 45, cat: "veg" },
      ],
      snack: [
        { en: "Greek yogurt", g: 150, kcal: 90, cat: "dairy" },
        { en: "Whey protein", g: 30, kcal: 120, cat: "protein" },
        { en: "Mixed nuts", g: 25, kcal: 150, cat: "dairy" },
      ],
      pre: [
        { en: "Banana", g: 100, kcal: 90, cat: "veg" },
        { en: "Rolled oats", g: 50, kcal: 190, cat: "carbs" },
      ],
      dinner: [
        { en: "Mixed lentils (dal)", g: 120, kcal: 140, cat: "protein" },
        { en: "Cooked rice", g: 200, kcal: 260, cat: "carbs" },
        { en: "Seasonal vegetables", g: 200, kcal: 70, cat: "veg" },
      ],
    },
    vegan: {
      breakfast: [
        { en: "Rolled oats", g: 60, kcal: 225, cat: "carbs" },
        { en: "Oat milk", g: 200, kcal: 80, cat: "dairy" },
        { en: "Banana", g: 100, kcal: 90, cat: "veg" },
        { en: "Chia seeds", g: 15, kcal: 75, cat: "pantry" },
      ],
      lunch: [
        { en: "Tofu", g: 200, kcal: 360, cat: "protein" },
        { en: "Cooked rice", g: 200, kcal: 260, cat: "carbs" },
        { en: "Salad greens", g: 120, kcal: 30, cat: "veg" },
      ],
      snack: [
        { en: "Pea protein", g: 35, kcal: 130, cat: "protein" },
        { en: "Mixed nuts", g: 30, kcal: 180, cat: "dairy" },
      ],
      pre: [
        { en: "Banana", g: 100, kcal: 90, cat: "veg" },
        { en: "Rolled oats", g: 50, kcal: 190, cat: "carbs" },
      ],
      dinner: [
        { en: "Mixed lentils (dal)", g: 140, kcal: 165, cat: "protein" },
        { en: "Cooked rice", g: 200, kcal: 260, cat: "carbs" },
        { en: "Tomato masala base", g: 80, kcal: 60, cat: "pantry" },
      ],
    },
  };

  const base = templates[dk] || templates.veg;
  let list = base[slot] ? [...base[slot]] : [];

  if (slot === "snack" && !profile.supplements?.includes("whey")) {
    list = list.filter((x) => !/whey|pea protein/i.test(x.en));
    if (isNon) list.push({ en: "Boiled eggs", g: 100, kcal: 140, cat: "protein" });
    else if (isVegan) list.push({ en: "Roasted chana", g: 50, kcal: 180, cat: "protein" });
    else list.push({ en: "Paneer cubes", g: 80, kcal: 200, cat: "protein" });
  }

  if (profile.dietType === "eggetarian" && !isNon && slot === "breakfast") {
    list.push({ en: "Whole eggs", g: 100, kcal: 140, cat: "protein" });
  }

  if (profile.foodPrefs?.includes("nodairy")) {
    list = list.map((x) => {
      if (/yogurt|paneer|milk/i.test(x.en)) {
        return { ...x, en: "Fortified soy yogurt / tofu (dairy-free swap)", g: x.g };
      }
      return x;
    });
  }

  const mealKcal = list.reduce((s, x) => s + x.kcal, 0) || 400;
  return { ingredients: list, baseKcal: mealKcal };
}

function scaleAmount(ing, factor) {
  return Math.max(0, Math.round((ing.g * factor) / 25) * 25);
}

/** Up to 3 alternative meal titles for this weekday slot (other weekdays' templates). */
export function getSwapAlternatives(profile, dayIndex, slot, currentName) {
  const dk = dietTemplateKey(profile);
  const out = [];
  const seen = new Set([currentName]);
  for (let d = 0; d < 7 && out.length < 3; d++) {
    if (d === dayIndex) continue;
    const n = mealName(dk, d, slot);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

function buildDayMeals(profile, dayIndex, targetKcal, options = {}) {
  const dk = dietTemplateKey(profile);
  const jain = profile.foodPrefs?.includes("jain");
  const td = Math.min(Math.max(profile.trainingDays || 4, 1), 7);
  const forceRest = options.forceRest === true;
  const isWorkoutDay = !forceRest && dayIndex < td;

  return SLOTS.map((slot) => {
    if (slot === "pre" && !isWorkoutDay) return null;

    const name = mealName(dk, dayIndex, slot);
    if (!name) return null;

    const { ingredients, baseKcal } = baseIngredients(profile, dayIndex, slot);
    const share = SLOT_SHARE[slot];
    const targetMeal = Math.round(targetKcal * share);
    const factor = targetMeal / baseKcal;

    const scaled = ingredients.map((ing) => ({
      name: jain ? jainCleanLine(ing.en) : ing.en,
      grams: scaleAmount(ing, factor),
      category: ing.cat,
    }));

    return {
      slot,
      name,
      kcal: targetMeal,
      tags: ["high_protein"],
      ingredients: scaled,
    };
  }).filter(Boolean);
}

function aggregateGrocery(profile, targetKcal) {
  const map = new Map();
  for (let d = 0; d < 7; d++) {
    const meals = buildDayMeals(profile, d, targetKcal);
    meals.forEach((m) => {
      m.ingredients.forEach((ing) => {
        const k = `${ing.category}|${ing.name}`;
        const prev = map.get(k) || { ...ing, grams: 0 };
        prev.grams += ing.grams;
        map.set(k, prev);
      });
    });
  }
  return [...map.values()].map((x) => ({
    ...x,
    grams: Math.ceil(x.grams / 50) * 50,
  }));
}

function prepSteps(profile) {
  const d = profile.dietType;
  const steps = [];
  if (d === "nonveg" || d === "eggetarian") {
    steps.push({ t: "Bake or grill 1 kg chicken in spice rub", m: 35 });
    steps.push({ t: "Boil a dozen eggs for snacks", m: 15 });
  } else {
    steps.push({ t: "Press paneer / drain tofu; cube and marinate", m: 20 });
    steps.push({ t: "Soak rajma/chana overnight if using dry", m: 5 });
  }
  steps.push({ t: "Cook 3–4 portions of rice or millets", m: 25 });
  steps.push({ t: "Wash and chop salad veg for 3 days", m: 20 });
  steps.push({ t: "Portion dal into containers", m: 15 });
  return steps;
}

const SUPP_META = {
  creatine: { dose: "3–5 g", time: "Any time; daily consistency matters", why: "More reps at same RPE over weeks." },
  whey: { dose: "25–35 g protein", time: "Post-workout or between meals", why: "Fast protein when whole food is inconvenient." },
  pre: { dose: "Per label (often 1 scoop)", time: "30 min pre-workout", why: "Caffeine + pump ingredients for focus." },
  omega: { dose: "1–2 g EPA+DHA", time: "With a meal containing fat", why: "Supports recovery and inflammation balance." },
  multi: { dose: "1 serving", time: "With breakfast", why: "Fills micronutrient gaps on busy days." },
  mag: { dose: "200–400 mg (form-dependent)", time: "Evening", why: "Sleep and muscle relaxation support." },
  ash: { dose: "300–600 mg extract", time: "Evening with food", why: "Stress adaptation; avoid mega-doses." },
};

function supplementSchedule(profile) {
  const ids = (profile.supplements || []).filter((x) => x !== "none");
  return ids.map((id) => ({ id, ...SUPP_META[id] })).filter((x) => x.why);
}

function generatePlan(profile, opts = {}) {
  const prev = opts.preserveMetaFrom;
  const kcal = calorieTarget(profile);
  const macro = macros(profile, kcal);
  const phases = buildPhases(profile);
  const grocery = aggregateGrocery(profile, kcal);
  const prep = prepSteps(profile);
  const supps = supplementSchedule(profile);
  const jain = profile.foodPrefs?.includes("jain");

  const totalWeeks = profile.durationWeeks || phases.reduce((s, p) => s + (p.weeks || 0), 0) || 16;

  return {
    generatedAt: prev?.generatedAt ?? Date.now(),
    startDate: prev?.startDate ?? new Date().toISOString().slice(0, 10),
    totalWeeks,
    tdee: Math.round(tdee(profile)),
    targetCalories: kcal,
    macro,
    phases,
    grocery,
    prep,
    supps,
    flags: { jain },
  };
}

export {
  generatePlan,
  buildDayMeals,
  getSwapAlternatives,
  dietTemplateKey,
  calorieTarget,
  macros,
  tdee,
  supplementSchedule,
};
