/**
 * Nutrition lookup — expanded list with category filters (Tools tab).
 * `cat`: protein | carbs | veg | fruit | dairy | indian | pantry
 */
export const FOODS = [
  // Protein
  { name: "Chicken breast (cooked)", kcal: 165, protein: 31, carbs: 0, fat: 3.6, basis: "100g", cat: "protein" },
  { name: "Chicken thigh (skinless, cooked)", kcal: 209, protein: 26, carbs: 0, fat: 11, basis: "100g", cat: "protein" },
  { name: "Turkey breast (cooked)", kcal: 135, protein: 30, carbs: 0, fat: 1, basis: "100g", cat: "protein" },
  { name: "Eggs (whole)", kcal: 143, protein: 13, carbs: 1, fat: 10, basis: "100g", cat: "protein" },
  { name: "Egg whites", kcal: 52, protein: 11, carbs: 0.7, fat: 0.2, basis: "100g", cat: "protein" },
  { name: "Tuna canned (in water)", kcal: 116, protein: 26, carbs: 0, fat: 1, basis: "100g", cat: "protein" },
  { name: "Salmon (cooked)", kcal: 206, protein: 22, carbs: 0, fat: 12, basis: "100g", cat: "protein" },
  { name: "Shrimp (cooked)", kcal: 99, protein: 24, carbs: 0.2, fat: 0.3, basis: "100g", cat: "protein" },
  { name: "Paneer", kcal: 265, protein: 18, carbs: 1.2, fat: 20, basis: "100g", cat: "protein" },
  { name: "Greek yogurt (plain)", kcal: 59, protein: 10, carbs: 3.6, fat: 0.4, basis: "100g", cat: "dairy" },
  { name: "Cottage cheese (low fat)", kcal: 72, protein: 12, carbs: 3, fat: 1, basis: "100g", cat: "dairy" },
  { name: "Whey protein (1 scoop ~30g)", kcal: 120, protein: 24, carbs: 3, fat: 1.5, basis: "~1 scoop", cat: "protein" },
  { name: "Tofu (firm)", kcal: 76, protein: 8, carbs: 1.9, fat: 4.8, basis: "100g", cat: "protein" },
  { name: "Tempeh", kcal: 193, protein: 19, carbs: 9, fat: 11, basis: "100g", cat: "protein" },
  { name: "Cooked lentils (dal)", kcal: 116, protein: 9, carbs: 20, fat: 0.4, basis: "100g", cat: "indian" },
  { name: "Cooked chickpeas", kcal: 164, protein: 8.9, carbs: 27, fat: 2.6, basis: "100g", cat: "indian" },
  { name: "Cooked black beans", kcal: 132, protein: 8.9, carbs: 24, fat: 0.5, basis: "100g", cat: "pantry" },
  { name: "Edamame (shelled)", kcal: 122, protein: 11, carbs: 10, fat: 5.2, basis: "100g", cat: "protein" },

  // Carbs / grains
  { name: "Basmati rice (cooked)", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, basis: "100g", cat: "carbs" },
  { name: "Brown rice (cooked)", kcal: 112, protein: 2.6, carbs: 24, fat: 0.9, basis: "100g", cat: "carbs" },
  { name: "Whole wheat roti (approx)", kcal: 297, protein: 11, carbs: 46, fat: 7.5, basis: "100g", cat: "indian" },
  { name: "Whole wheat bread", kcal: 247, protein: 13, carbs: 41, fat: 4.2, basis: "100g", cat: "carbs" },
  { name: "Rolled oats (dry)", kcal: 389, protein: 17, carbs: 66, fat: 7, basis: "100g", cat: "carbs" },
  { name: "Quinoa (cooked)", kcal: 120, protein: 4.4, carbs: 21, fat: 1.9, basis: "100g", cat: "carbs" },
  { name: "Sweet potato (baked)", kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, basis: "100g", cat: "veg" },
  { name: "Potato (boiled)", kcal: 87, protein: 1.9, carbs: 20, fat: 0.1, basis: "100g", cat: "veg" },
  { name: "Idli (plain)", kcal: 149, protein: 4.5, carbs: 29, fat: 1.5, basis: "100g", cat: "indian" },
  { name: "Dosa (plain)", kcal: 168, protein: 4.7, carbs: 29, fat: 3.8, basis: "100g", cat: "indian" },
  { name: "Poha (flattened rice, dry)", kcal: 346, protein: 6.7, carbs: 76, fat: 1.2, basis: "100g", cat: "indian" },
  { name: "Upma (semolina, cooked avg)", kcal: 120, protein: 3.5, carbs: 18, fat: 3.5, basis: "100g", cat: "indian" },

  // Veg & fruit
  { name: "Broccoli (steamed)", kcal: 35, protein: 2.4, carbs: 7, fat: 0.4, basis: "100g", cat: "veg" },
  { name: "Spinach (raw)", kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, basis: "100g", cat: "veg" },
  { name: "Mixed salad greens", kcal: 17, protein: 1.3, carbs: 3.3, fat: 0.2, basis: "100g", cat: "veg" },
  { name: "Tomato", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, basis: "100g", cat: "veg" },
  { name: "Cucumber", kcal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, basis: "100g", cat: "veg" },
  { name: "Banana", kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, basis: "100g", cat: "fruit" },
  { name: "Apple", kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, basis: "100g", cat: "fruit" },
  { name: "Blueberries", kcal: 57, protein: 0.7, carbs: 14, fat: 0.3, basis: "100g", cat: "fruit" },
  { name: "Mango", kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, basis: "100g", cat: "fruit" },
  { name: "Orange", kcal: 47, protein: 0.9, carbs: 12, fat: 0.1, basis: "100g", cat: "fruit" },

  // Dairy & fats
  { name: "Skim milk", kcal: 34, protein: 3.4, carbs: 5, fat: 0.1, basis: "100ml", cat: "dairy" },
  { name: "Whole milk", kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, basis: "100ml", cat: "dairy" },
  { name: "Curd / dahi", kcal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, basis: "100g", cat: "dairy" },
  { name: "Butter", kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, basis: "100g", cat: "dairy" },
  { name: "Olive oil", kcal: 884, protein: 0, carbs: 0, fat: 100, basis: "100g", cat: "pantry" },
  { name: "Ghee", kcal: 900, protein: 0, carbs: 0, fat: 100, basis: "100g", cat: "indian" },
  { name: "Peanut butter", kcal: 588, protein: 25, carbs: 20, fat: 50, basis: "100g", cat: "pantry" },
  { name: "Almonds", kcal: 579, protein: 21, carbs: 22, fat: 50, basis: "100g", cat: "pantry" },

  // Indian staples & dishes (approx)
  { name: "Dal tadka (avg)", kcal: 120, protein: 6, carbs: 16, fat: 3.5, basis: "100g", cat: "indian" },
  { name: "Rajma (cooked)", kcal: 127, protein: 8.7, carbs: 23, fat: 0.5, basis: "100g", cat: "indian" },
  { name: "Chana masala (avg)", kcal: 140, protein: 7, carbs: 18, fat: 4.5, basis: "100g", cat: "indian" },
  { name: "Palak paneer (avg)", kcal: 150, protein: 9, carbs: 8, fat: 10, basis: "100g", cat: "indian" },
  { name: "Chicken curry (home-style avg)", kcal: 145, protein: 16, carbs: 5, fat: 7, basis: "100g", cat: "indian" },
  { name: "Fish curry (avg)", kcal: 125, protein: 14, carbs: 4, fat: 6, basis: "100g", cat: "indian" },
  { name: "Biryani (veg, avg)", kcal: 160, protein: 4.5, carbs: 28, fat: 3.8, basis: "100g", cat: "indian" },
  { name: "Biryani (chicken, avg)", kcal: 175, protein: 12, carbs: 22, fat: 6, basis: "100g", cat: "indian" },
  { name: "Sambar", kcal: 55, protein: 2.5, carbs: 8, fat: 1.2, basis: "100g", cat: "indian" },
  { name: "Rasam", kcal: 25, protein: 1, carbs: 4, fat: 0.5, basis: "100g", cat: "indian" },
  { name: "Besan (gram flour)", kcal: 387, protein: 22, carbs: 58, fat: 6.7, basis: "100g", cat: "indian" },

  // Pantry / misc
  { name: "Honey", kcal: 304, protein: 0.3, carbs: 82, fat: 0, basis: "100g", cat: "pantry" },
  { name: "Dark chocolate 70%", kcal: 598, protein: 7.8, carbs: 46, fat: 43, basis: "100g", cat: "pantry" },
  { name: "Protein bar (avg)", kcal: 400, protein: 25, carbs: 40, fat: 14, basis: "100g", cat: "protein" },
];
