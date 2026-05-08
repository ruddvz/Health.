/** Plan0 §9 — Meal plan templates (preview / library). */
export const MEAL_PLAN_TEMPLATES = [
  {
    id: "high-protein-cut",
    name: "High-Protein Fat Loss",
    targetKcal: 1800,
    days: [
      { breakfast: "Eggs + spinach (~270)", lunch: "Chicken + rice + salad (~480)", snack: "Greek yogurt + nuts (~220)", dinner: "Salmon + broccoli (~420)", extra: "Whey (~120)" },
      { breakfast: "Protein oats (~380)", lunch: "Turkey wrap (~460)", snack: "Cottage cheese + berries (~200)", dinner: "Lean beef + veg (~420)", extra: "—" },
      { breakfast: "Omelette + feta (~320)", lunch: "Tuna salad (~440)", snack: "Whey + banana (~210)", dinner: "Fish + quinoa (~480)", extra: "—" },
    ],
  },
  {
    id: "clean-bulk",
    name: "Clean Bulk",
    targetKcal: 2800,
    days: [
      { breakfast: "Eggs + oats + banana (~680)", lunch: "Chicken + potato (~620)", snack: "Whey + rice cakes (~320)", dinner: "Beef + pasta (~780)", extra: "Yogurt + granola (~360)" },
    ],
  },
  {
    id: "vegetarian-2k",
    name: "Vegetarian",
    targetKcal: 2000,
    days: [
      { breakfast: "Tofu scramble (~280)", lunch: "Lentil soup + bread (~480)", snack: "Nuts + apple (~220)", dinner: "Paneer + rice (~640)", extra: "Edamame (~180)" },
    ],
  },
  {
    id: "keto-lowcarb",
    name: "Keto / Low-Carb",
    targetKcal: 1800,
    days: [
      { breakfast: "Eggs + bacon + avocado (~480)", lunch: "Caesar chicken (~420)", snack: "Macadamia + cheese (~280)", dinner: "Steak + veg (~580)", extra: "—" },
    ],
  },
  {
    id: "meal-prep-5day",
    name: "5-Day Meal Prep",
    targetKcal: 2200,
    days: [
      { breakfast: "Prep breakfast", lunch: "Chicken + rice + sauces rotation", snack: "Yogurt / fruit", dinner: "Turkey bowls", extra: "Sunday batch cook" },
    ],
  },
  {
    id: "anti-inflammatory",
    name: "Anti-Inflammatory",
    targetKcal: 2000,
    days: [
      { breakfast: "Smoothie + flax (~320)", lunch: "Salmon + quinoa (~520)", snack: "Walnuts + tea (~200)", dinner: "Fish + beets (~480)", extra: "—" },
    ],
  },
  {
    id: "if-168",
    name: "IF 16:8",
    targetKcal: 2100,
    days: [
      { breakfast: "Fast", lunch: "12pm: protein + carbs", snack: "Shake + fruit", dinner: "8pm: large balanced meal", extra: "Water during fast" },
    ],
  },
];
