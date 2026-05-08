/** Plan0 §11 — Grocery templates + autocomplete keywords. */

export const GROCERY_TEMPLATES = [
  {
    id: "hp-weekly",
    name: "High-Protein Basics",
    items: [
      { name: "Chicken breast", qty: 1.5, unit: "kg", category: "protein" },
      { name: "Ground turkey", qty: 500, unit: "g", category: "protein" },
      { name: "Salmon fillets", qty: 6, unit: "pcs", category: "protein" },
      { name: "Tuna cans", qty: 2, unit: "cans", category: "protein" },
      { name: "Large eggs", qty: 18, unit: "pcs", category: "dairy" },
      { name: "Greek yogurt", qty: 500, unit: "g", category: "dairy" },
      { name: "Cottage cheese", qty: 500, unit: "g", category: "dairy" },
      { name: "Rolled oats", qty: 500, unit: "g", category: "carbs" },
      { name: "Brown rice", qty: 1, unit: "kg", category: "carbs" },
      { name: "Sweet potato", qty: 500, unit: "g", category: "veg" },
      { name: "Broccoli", qty: 1, unit: "bunch", category: "veg" },
      { name: "Spinach bags", qty: 2, unit: "bags", category: "veg" },
      { name: "Bell peppers", qty: 3, unit: "pcs", category: "veg" },
      { name: "Avocados", qty: 2, unit: "pcs", category: "veg" },
      { name: "Almonds", qty: 100, unit: "g", category: "pantry" },
      { name: "Extra virgin olive oil", qty: 1, unit: "L", category: "pantry" },
      { name: "Whey protein", qty: 1, unit: "tub", category: "pantry" },
    ],
  },
  {
    id: "keto-run",
    name: "Keto Grocery Run",
    items: [
      { name: "Bacon", qty: 500, unit: "g", category: "protein" },
      { name: "Eggs", qty: 12, unit: "pcs", category: "dairy" },
      { name: "Ground beef", qty: 500, unit: "g", category: "protein" },
      { name: "Ribeye steaks", qty: 4, unit: "pcs", category: "protein" },
      { name: "Cheddar", qty: 200, unit: "g", category: "dairy" },
      { name: "Heavy cream", qty: 500, unit: "ml", category: "dairy" },
      { name: "Butter", qty: 250, unit: "g", category: "dairy" },
      { name: "Mixed greens", qty: 2, unit: "bags", category: "veg" },
      { name: "Broccoli", qty: 2, unit: "heads", category: "veg" },
      { name: "Macadamia nuts", qty: 100, unit: "g", category: "pantry" },
    ],
  },
  {
    id: "meal-prep-sun",
    name: "Meal Prep Sunday",
    items: [
      { name: "Chicken breast", qty: 1.5, unit: "kg", category: "protein" },
      { name: "Ground turkey", qty: 500, unit: "g", category: "protein" },
      { name: "Brown rice dry", qty: 500, unit: "g", category: "carbs" },
      { name: "Broccoli", qty: 2, unit: "heads", category: "veg" },
      { name: "Bell peppers", qty: 4, unit: "pcs", category: "veg" },
      { name: "Eggs", qty: 12, unit: "pcs", category: "dairy" },
      { name: "Greek yogurt", qty: 500, unit: "g", category: "dairy" },
      { name: "Salsa", qty: 1, unit: "jar", category: "pantry" },
      { name: "Teriyaki sauce", qty: 1, unit: "bottle", category: "pantry" },
    ],
  },
  {
    id: "veg-weekly",
    name: "Vegetarian Weekly",
    items: [
      { name: "Firm tofu", qty: 400, unit: "g", category: "protein" },
      { name: "Paneer", qty: 400, unit: "g", category: "protein" },
      { name: "Chickpeas cans", qty: 4, unit: "cans", category: "pantry" },
      { name: "Lentils cans", qty: 3, unit: "cans", category: "pantry" },
      { name: "Quinoa", qty: 500, unit: "g", category: "carbs" },
      { name: "Greek yogurt", qty: 500, unit: "g", category: "dairy" },
      { name: "Eggs", qty: 12, unit: "pcs", category: "dairy" },
      { name: "Feta", qty: 250, unit: "g", category: "dairy" },
      { name: "Walnuts", qty: 100, unit: "g", category: "pantry" },
      { name: "Spinach", qty: 1, unit: "bag", category: "veg" },
      { name: "Crushed tomatoes", qty: 2, unit: "cans", category: "pantry" },
    ],
  },
];

const KEYWORDS = [
  "spinach", "kale", "romaine", "broccoli", "cauliflower", "bell pepper", "carrot", "sweet potato",
  "chicken breast", "chicken thigh", "turkey breast", "ground turkey", "lean beef", "salmon", "tilapia", "tuna", "shrimp",
  "eggs", "greek yogurt", "cottage cheese", "almond milk", "oats", "brown rice", "quinoa", "pasta",
  "olive oil", "rice cakes", "almonds", "walnuts", "peanut butter", "honey", "berries", "banana", "apple",
  "whey protein", "creatine", "lentils", "chickpeas", "black beans", "tofu", "tempeh", "paneer",
];

export const GROCERY_AUTOCOMPLETE = [
  ...new Set([
    ...KEYWORDS,
    ...GROCERY_TEMPLATES.flatMap((t) => t.items.map((i) => i.name.toLowerCase())),
  ]),
].sort();
