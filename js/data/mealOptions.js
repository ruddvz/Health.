/**
 * Extended meal option library.
 *
 * Structure per entry:
 *   id          unique string
 *   name        display name (matches meal plan card title)
 *   slot        breakfast | lunch | snack | pre | dinner
 *   dietTypes   array of compatible diet types: nonveg | veg | vegan | eggetarian
 *   goal        array of compatible goals: cut | build | maintain  (empty = all)
 *   kcal        approximate total kcal
 *   macro       { protein, carbs, fat }  in grams
 *   prepMins    hands-on prep time in minutes
 *   cookMins    cook/wait time in minutes
 *   tags        array: batch | quick | no_cook | indian | high_fiber | low_carb | high_protein
 *   ingredients array of { name, grams, note? }
 *   tips        string — 1–2 sentence cooking or prep tip
 */

export const MEAL_OPTIONS = [
  /* ───────────── BREAKFAST ───────────── */

  {
    id: "bk_eggs_toast_nonveg",
    name: "Scrambled Eggs & Whole Wheat Toast",
    slot: "breakfast",
    dietTypes: ["nonveg", "eggetarian"],
    goal: [],
    kcal: 520,
    macro: { protein: 36, carbs: 42, fat: 18 },
    prepMins: 5,
    cookMins: 8,
    tags: ["quick", "high_protein"],
    ingredients: [
      { name: "Whole eggs", grams: 200, note: "3 large eggs" },
      { name: "Whole wheat bread", grams: 80, note: "2 slices" },
      { name: "Olive oil or butter", grams: 10 },
      { name: "Banana", grams: 120 },
    ],
    tips:
      "Cook eggs low and slow over medium-low heat for creamier texture. Salt after removing from heat to keep eggs fluffy.",
  },

  {
    id: "bk_omelette_veg",
    name: "3-Egg Veggie Omelette",
    slot: "breakfast",
    dietTypes: ["eggetarian", "veg"],
    goal: [],
    kcal: 480,
    macro: { protein: 30, carbs: 28, fat: 22 },
    prepMins: 5,
    cookMins: 10,
    tags: ["quick", "high_protein", "low_carb"],
    ingredients: [
      { name: "Whole eggs", grams: 180, note: "3 eggs" },
      { name: "Onion + tomato + capsicum", grams: 100, note: "finely chopped" },
      { name: "Olive oil", grams: 10 },
      { name: "Whole wheat roti or toast", grams: 60 },
    ],
    tips: "Use a non-stick pan. Pour eggs over veg and fold once — don't scramble. Cover for 60 seconds for fully set inside.",
  },

  {
    id: "bk_overnight_oats_veg",
    name: "Overnight Oats with Banana & Nuts",
    slot: "breakfast",
    dietTypes: ["veg", "eggetarian"],
    goal: [],
    kcal: 540,
    macro: { protein: 22, carbs: 72, fat: 16 },
    prepMins: 5,
    cookMins: 0,
    tags: ["no_cook", "batch", "high_fiber"],
    ingredients: [
      { name: "Rolled oats", grams: 80 },
      { name: "Greek yogurt", grams: 150, note: "or low-fat curd" },
      { name: "Banana", grams: 100 },
      { name: "Almonds", grams: 20 },
      { name: "Honey", grams: 15 },
    ],
    tips:
      "Mix oats + yogurt + 50 ml water, cover, refrigerate overnight. Slice banana and add nuts in the morning. Prep 3–4 jars Sunday for the week.",
  },

  {
    id: "bk_oat_protein_shake",
    name: "Oat Protein Shake",
    slot: "breakfast",
    dietTypes: ["nonveg", "veg", "eggetarian"],
    goal: ["build"],
    kcal: 560,
    macro: { protein: 42, carbs: 68, fat: 9 },
    prepMins: 3,
    cookMins: 0,
    tags: ["no_cook", "quick", "high_protein"],
    ingredients: [
      { name: "Rolled oats (dry)", grams: 60 },
      { name: "Whey protein", grams: 35, note: "1.2 scoops vanilla or unflavoured" },
      { name: "Banana", grams: 100 },
      { name: "Whole milk", grams: 250 },
      { name: "Honey", grams: 10 },
    ],
    tips:
      "Blend all together 60 seconds. For extra thickness, microwave oats 90 sec with the milk first, let cool, then blend — creates a thicker 'oatmeal shake.'",
  },

  {
    id: "bk_moong_dal_chilla",
    name: "Moong Dal Chilla with Curd",
    slot: "breakfast",
    dietTypes: ["veg", "vegan"],
    goal: [],
    kcal: 490,
    macro: { protein: 28, carbs: 58, fat: 12 },
    prepMins: 10,
    cookMins: 15,
    tags: ["indian", "high_protein", "batch"],
    ingredients: [
      { name: "Moong dal (yellow, soaked 4 hr)", grams: 100, note: "dry weight" },
      { name: "Onion + green chilli + ginger paste", grams: 60 },
      { name: "Cooking oil", grams: 15 },
      { name: "Curd / dahi", grams: 150 },
    ],
    tips:
      "Grind soaked dal to thick batter with minimal water. Pour ladle-sized discs on hot non-stick. Batter keeps 2 days in fridge. Cook 6 at a time for batch prep.",
  },

  {
    id: "bk_poha_peanuts",
    name: "Poha with Peanuts & Sprouts",
    slot: "breakfast",
    dietTypes: ["veg", "vegan"],
    goal: [],
    kcal: 460,
    macro: { protein: 16, carbs: 68, fat: 14 },
    prepMins: 5,
    cookMins: 10,
    tags: ["indian", "quick"],
    ingredients: [
      { name: "Flattened rice (poha)", grams: 80, note: "thick variety" },
      { name: "Roasted peanuts", grams: 30 },
      { name: "Mixed sprouts", grams: 50 },
      { name: "Mustard seeds, curry leaves, oil", grams: 15 },
      { name: "Lemon juice", grams: 10 },
    ],
    tips:
      "Rinse poha in a strainer until just soft — don't over-soak. Temper mustard seeds first, add onion, then poha. Sprouts added raw at end for crunch and extra protein.",
  },

  {
    id: "bk_vegan_smoothie_bowl",
    name: "Pea Protein Smoothie Bowl",
    slot: "breakfast",
    dietTypes: ["vegan"],
    goal: [],
    kcal: 510,
    macro: { protein: 30, carbs: 65, fat: 12 },
    prepMins: 8,
    cookMins: 0,
    tags: ["no_cook", "vegan", "high_protein"],
    ingredients: [
      { name: "Pea protein powder", grams: 35, note: "1 scoop vanilla" },
      { name: "Frozen banana", grams: 150 },
      { name: "Oat milk", grams: 200 },
      { name: "Chia seeds", grams: 15 },
      { name: "Blueberries", grams: 80 },
      { name: "Almond butter", grams: 20 },
    ],
    tips:
      "Blend protein + banana + milk until smooth. Pour into bowl, top with chia, berries, almond butter. Freeze banana chunks ahead for thick, ice-cream consistency.",
  },

  {
    id: "bk_idli_sambar",
    name: "Idli with Sambar & Coconut Chutney",
    slot: "breakfast",
    dietTypes: ["veg", "vegan", "eggetarian"],
    goal: [],
    kcal: 430,
    macro: { protein: 14, carbs: 78, fat: 8 },
    prepMins: 5,
    cookMins: 15,
    tags: ["indian", "batch"],
    ingredients: [
      { name: "Plain idli", grams: 240, note: "4 medium idlis" },
      { name: "Sambar", grams: 200 },
      { name: "Coconut chutney", grams: 40 },
    ],
    tips:
      "Batch steam 12–16 idlis at once — keep 2 days in fridge, steam reheat in 5 min. Sambar made with toor dal and mixed veg adds significant protein and fiber.",
  },

  /* ───────────── LUNCH ───────────── */

  {
    id: "lu_chicken_rice_veg",
    name: "Grilled Chicken, Rice & Broccoli",
    slot: "lunch",
    dietTypes: ["nonveg"],
    goal: [],
    kcal: 640,
    macro: { protein: 55, carbs: 60, fat: 14 },
    prepMins: 10,
    cookMins: 25,
    tags: ["high_protein", "batch"],
    ingredients: [
      { name: "Chicken breast (raw)", grams: 220, note: "marinaded in lemon + spices" },
      { name: "Cooked basmati rice", grams: 200 },
      { name: "Broccoli (steamed)", grams: 150 },
      { name: "Olive oil", grams: 10 },
    ],
    tips:
      "Marinate 8 chicken breasts Sunday, grill in batches. Keeps 4 days refrigerated. Portion into containers with rice and pre-steamed broccoli for grab-and-go lunches.",
  },

  {
    id: "lu_fish_quinoa",
    name: "Baked Fish with Quinoa & Salad",
    slot: "lunch",
    dietTypes: ["nonveg"],
    goal: [],
    kcal: 590,
    macro: { protein: 48, carbs: 52, fat: 16 },
    prepMins: 8,
    cookMins: 20,
    tags: ["high_protein"],
    ingredients: [
      { name: "White fish fillet (tilapia / cod)", grams: 250 },
      { name: "Cooked quinoa", grams: 150 },
      { name: "Mixed salad greens", grams: 100 },
      { name: "Olive oil + lemon", grams: 15 },
    ],
    tips:
      "Season fish with paprika, garlic powder, salt. Bake at 200°C for 15–18 min. Quinoa cooks in 15 min — batch a week's worth and refrigerate.",
  },

  {
    id: "lu_paneer_dal_rice",
    name: "Paneer Bhurji, Dal & Brown Rice",
    slot: "lunch",
    dietTypes: ["veg", "eggetarian"],
    goal: [],
    kcal: 660,
    macro: { protein: 38, carbs: 68, fat: 24 },
    prepMins: 10,
    cookMins: 20,
    tags: ["indian", "high_protein"],
    ingredients: [
      { name: "Paneer (crumbled)", grams: 180 },
      { name: "Cooked toor dal", grams: 150 },
      { name: "Cooked brown rice", grams: 180 },
      { name: "Onion + tomato + spices", grams: 80 },
      { name: "Ghee or oil", grams: 12 },
    ],
    tips:
      "Crumble paneer finely for bhurji — cook with onion-tomato masala 8 min. Batch dal in pressure cooker (5 whistles) for the week. Store paneer raw; crumble when cooking.",
  },

  {
    id: "lu_chana_roti",
    name: "Chana Masala with 3 Rotis",
    slot: "lunch",
    dietTypes: ["veg", "vegan"],
    goal: [],
    kcal: 580,
    macro: { protein: 24, carbs: 88, fat: 12 },
    prepMins: 10,
    cookMins: 30,
    tags: ["indian", "batch", "high_fiber"],
    ingredients: [
      { name: "Cooked chickpeas", grams: 250 },
      { name: "Whole wheat roti", grams: 150, note: "3 medium rotis" },
      { name: "Onion-tomato masala base", grams: 100 },
      { name: "Cooking oil", grams: 12 },
    ],
    tips:
      "Use canned chickpeas for speed — drain and rinse, add straight to masala. Batch cook 3× the recipe and freeze in portions. Pressure cooker: dry chickpeas soaked overnight, 8 whistles.",
  },

  {
    id: "lu_tofu_stirfry_rice",
    name: "Tofu Stir-Fry with Brown Rice",
    slot: "lunch",
    dietTypes: ["vegan"],
    goal: [],
    kcal: 600,
    macro: { protein: 32, carbs: 68, fat: 20 },
    prepMins: 10,
    cookMins: 15,
    tags: ["vegan", "high_protein"],
    ingredients: [
      { name: "Firm tofu (pressed)", grams: 250 },
      { name: "Cooked brown rice", grams: 180 },
      { name: "Broccoli + capsicum + carrot", grams: 200 },
      { name: "Soy sauce + sesame oil + ginger", grams: 20 },
      { name: "Sesame oil", grams: 10 },
    ],
    tips:
      "Press tofu 30 min under a heavy pan — removes moisture for better browning. Pan-fry cubed tofu in small oil until golden on all sides before adding veg.",
  },

  {
    id: "lu_seitan_curry_rice",
    name: "Seitan / Soy Curls Curry & Rice",
    slot: "lunch",
    dietTypes: ["vegan"],
    goal: ["build"],
    kcal: 640,
    macro: { protein: 38, carbs: 72, fat: 16 },
    prepMins: 10,
    cookMins: 25,
    tags: ["vegan", "high_protein", "indian"],
    ingredients: [
      { name: "Seitan or soy curls (dry)", grams: 100, note: "soaked if using soy curls" },
      { name: "Cooked basmati rice", grams: 200 },
      { name: "Onion-tomato-cashew gravy", grams: 120 },
      { name: "Coconut cream", grams: 40 },
    ],
    tips:
      "Soy curls rehydrate in warm water in 10 min — squeeze out excess. Pan-fry until slightly crisp before adding to gravy for better texture.",
  },

  {
    id: "lu_egg_curry_rice",
    name: "Egg Curry with Rice",
    slot: "lunch",
    dietTypes: ["eggetarian"],
    goal: [],
    kcal: 620,
    macro: { protein: 30, carbs: 65, fat: 24 },
    prepMins: 5,
    cookMins: 20,
    tags: ["indian", "batch"],
    ingredients: [
      { name: "Hard-boiled eggs", grams: 200, note: "4 eggs" },
      { name: "Cooked rice", grams: 200 },
      { name: "Onion-tomato masala + spices", grams: 100 },
      { name: "Cooking oil", grams: 15 },
    ],
    tips:
      "Boil a dozen eggs at once. Score eggs before adding to gravy — allows masala to penetrate. Curry improves overnight — make a double batch.",
  },

  /* ───────────── SNACK ───────────── */

  {
    id: "sn_greek_yogurt_fruit",
    name: "Greek Yogurt with Berries & Almonds",
    slot: "snack",
    dietTypes: ["nonveg", "veg", "eggetarian"],
    goal: [],
    kcal: 280,
    macro: { protein: 22, carbs: 24, fat: 10 },
    prepMins: 2,
    cookMins: 0,
    tags: ["no_cook", "quick", "high_protein"],
    ingredients: [
      { name: "Greek yogurt (plain)", grams: 200 },
      { name: "Blueberries or mixed berries", grams: 80 },
      { name: "Almonds", grams: 20 },
    ],
    tips:
      "Pre-portion yogurt + berries in 3 containers Sunday. Add almonds fresh (they go soft when stored with yogurt). 10 min total prep for 3 snacks.",
  },

  {
    id: "sn_whey_shake_banana",
    name: "Whey Shake with Banana",
    slot: "snack",
    dietTypes: ["nonveg", "veg", "eggetarian"],
    goal: [],
    kcal: 300,
    macro: { protein: 28, carbs: 34, fat: 3 },
    prepMins: 2,
    cookMins: 0,
    tags: ["no_cook", "quick", "high_protein"],
    ingredients: [
      { name: "Whey protein", grams: 30, note: "1 scoop" },
      { name: "Banana", grams: 100 },
      { name: "Water or skim milk", grams: 250 },
    ],
    tips:
      "In water = lower calorie, faster to digest. In milk = extra protein + casein = slower release, better for if gap to dinner is 4+ hours.",
  },

  {
    id: "sn_cottage_cheese_rice_cakes",
    name: "Cottage Cheese & Rice Cakes",
    slot: "snack",
    dietTypes: ["nonveg", "veg", "eggetarian"],
    goal: ["cut"],
    kcal: 230,
    macro: { protein: 24, carbs: 22, fat: 4 },
    prepMins: 2,
    cookMins: 0,
    tags: ["no_cook", "quick", "high_protein", "low_carb"],
    ingredients: [
      { name: "Cottage cheese (low fat)", grams: 200 },
      { name: "Rice cakes (plain)", grams: 40, note: "3–4 cakes" },
      { name: "Black pepper + hot sauce", grams: 5 },
    ],
    tips:
      "Season cottage cheese aggressively — it's bland otherwise. Top rice cakes with a spoonful + hot sauce. Very filling for the calorie cost.",
  },

  {
    id: "sn_roasted_chana_paneer",
    name: "Roasted Chana & Paneer Cubes",
    slot: "snack",
    dietTypes: ["veg", "eggetarian"],
    goal: [],
    kcal: 300,
    macro: { protein: 24, carbs: 22, fat: 14 },
    prepMins: 3,
    cookMins: 0,
    tags: ["no_cook", "quick", "indian", "high_protein"],
    ingredients: [
      { name: "Roasted chana (Bengal gram)", grams: 50 },
      { name: "Paneer cubes", grams: 80 },
      { name: "Chaat masala + lemon", grams: 5 },
    ],
    tips:
      "Cube paneer raw — no cooking required. Toss with chaat masala. Pack in small container for office snack. Roasted chana available at any Indian grocery in bulk.",
  },

  {
    id: "sn_boiled_eggs_fruit",
    name: "Hard-Boiled Eggs & Apple",
    slot: "snack",
    dietTypes: ["nonveg", "eggetarian"],
    goal: [],
    kcal: 260,
    macro: { protein: 18, carbs: 22, fat: 10 },
    prepMins: 1,
    cookMins: 12,
    tags: ["batch", "high_protein"],
    ingredients: [
      { name: "Hard-boiled eggs", grams: 150, note: "2–3 eggs" },
      { name: "Apple", grams: 150 },
    ],
    tips:
      "Batch boil 12 eggs on Sunday. Peel and store in fridge 5 days. Add a pinch of salt and a banana instead of apple on training days for extra fast carbs.",
  },

  {
    id: "sn_pea_protein_almond_vegan",
    name: "Pea Protein Shake & Almonds",
    slot: "snack",
    dietTypes: ["vegan"],
    goal: [],
    kcal: 310,
    macro: { protein: 26, carbs: 18, fat: 14 },
    prepMins: 2,
    cookMins: 0,
    tags: ["no_cook", "quick", "vegan", "high_protein"],
    ingredients: [
      { name: "Pea protein powder", grams: 35, note: "1 scoop" },
      { name: "Oat milk", grams: 250 },
      { name: "Almonds", grams: 25 },
    ],
    tips:
      "Pea protein has a strong flavour — vanilla or chocolate flavours help significantly. Blend with frozen banana for better texture.",
  },

  {
    id: "sn_makhana_curd",
    name: "Roasted Makhana & Curd",
    slot: "snack",
    dietTypes: ["veg", "eggetarian"],
    goal: [],
    kcal: 240,
    macro: { protein: 14, carbs: 30, fat: 8 },
    prepMins: 5,
    cookMins: 5,
    tags: ["indian", "quick"],
    ingredients: [
      { name: "Fox nuts / makhana", grams: 40 },
      { name: "Ghee", grams: 5 },
      { name: "Curd / dahi", grams: 150 },
      { name: "Salt + cumin powder", grams: 2 },
    ],
    tips:
      "Roast makhana in 1 tsp ghee on low heat 4–5 min until crisp. Season with salt and roasted cumin. Eat alongside curd or stir into curd. High in calcium, low in fat.",
  },

  /* ───────────── PRE-WORKOUT ───────────── */

  {
    id: "pre_banana_oats",
    name: "Banana & Oat Pre-Workout",
    slot: "pre",
    dietTypes: ["nonveg", "veg", "vegan", "eggetarian"],
    goal: [],
    kcal: 280,
    macro: { protein: 6, carbs: 56, fat: 4 },
    prepMins: 2,
    cookMins: 3,
    tags: ["quick"],
    ingredients: [
      { name: "Banana", grams: 120 },
      { name: "Rolled oats (microwaved)", grams: 40 },
      { name: "Honey", grams: 10 },
    ],
    tips:
      "Microwave oats 90 seconds with 80 ml water. Top with sliced banana and honey. Eat 45–60 min before training — full, not bloated. No fat or fibre that slows digestion.",
  },

  {
    id: "pre_dates_rice_cakes",
    name: "Dates & Rice Cakes",
    slot: "pre",
    dietTypes: ["nonveg", "veg", "vegan", "eggetarian"],
    goal: [],
    kcal: 240,
    macro: { protein: 4, carbs: 52, fat: 2 },
    prepMins: 1,
    cookMins: 0,
    tags: ["no_cook", "quick"],
    ingredients: [
      { name: "Medjool dates", grams: 60, note: "3–4 dates, pitted" },
      { name: "Rice cakes (plain)", grams: 40, note: "3 cakes" },
    ],
    tips:
      "Quick-release carbs with minimal prep. Dates provide fast sugar + potassium (electrolyte for muscle contraction). Ideal 30–45 min before session.",
  },

  {
    id: "pre_white_rice_small",
    name: "Small Portion White Rice + Pickle",
    slot: "pre",
    dietTypes: ["veg", "vegan", "eggetarian", "nonveg"],
    goal: ["build"],
    kcal: 260,
    macro: { protein: 4, carbs: 58, fat: 1 },
    prepMins: 2,
    cookMins: 0,
    tags: ["indian", "quick"],
    ingredients: [
      { name: "Cooked white rice (chilled from batch)", grams: 200 },
      { name: "Pickle (mango or lime, small)", grams: 10 },
    ],
    tips:
      "White rice over brown pre-workout — digests faster, less fibre bulk. Already from your batch-cooked container. Literally a 2-min meal.",
  },

  /* ───────────── DINNER ───────────── */

  {
    id: "di_chicken_curry_rice",
    name: "Chicken Curry with Basmati Rice",
    slot: "dinner",
    dietTypes: ["nonveg"],
    goal: [],
    kcal: 680,
    macro: { protein: 52, carbs: 62, fat: 22 },
    prepMins: 10,
    cookMins: 30,
    tags: ["indian", "batch", "high_protein"],
    ingredients: [
      { name: "Chicken thighs or breast", grams: 250 },
      { name: "Cooked basmati rice", grams: 200 },
      { name: "Onion-tomato-spice gravy", grams: 120 },
      { name: "Cooking oil", grams: 15 },
    ],
    tips:
      "Bone-in thighs add more flavour to curry than breast. Batch double the gravy base — use half for chicken tonight, rest for tomorrow's dal or egg curry.",
  },

  {
    id: "di_fish_veg_mash",
    name: "Pan-Seared Fish with Sweet Potato Mash",
    slot: "dinner",
    dietTypes: ["nonveg"],
    goal: ["cut"],
    kcal: 580,
    macro: { protein: 48, carbs: 50, fat: 16 },
    prepMins: 10,
    cookMins: 25,
    tags: ["high_protein", "low_carb"],
    ingredients: [
      { name: "Salmon or tilapia fillet", grams: 250 },
      { name: "Sweet potato (steamed)", grams: 200 },
      { name: "Broccoli (steamed)", grams: 150 },
      { name: "Olive oil + garlic", grams: 15 },
    ],
    tips:
      "Pat fish completely dry before cooking — moisture prevents searing. Cook skin-side down 70 % of the time in hot pan before flipping for crispy skin.",
  },

  {
    id: "di_dal_rice_veg",
    name: "Dal Tadka with Rice & Sabzi",
    slot: "dinner",
    dietTypes: ["veg", "eggetarian", "vegan"],
    goal: [],
    kcal: 580,
    macro: { protein: 22, carbs: 88, fat: 14 },
    prepMins: 10,
    cookMins: 25,
    tags: ["indian", "batch", "high_fiber"],
    ingredients: [
      { name: "Toor or moong dal (cooked)", grams: 200 },
      { name: "Cooked rice", grams: 180 },
      { name: "Seasonal sabzi (any veg)", grams: 150 },
      { name: "Ghee or oil", grams: 12 },
      { name: "Tadka (cumin, garlic, dried chilli)", grams: 8 },
    ],
    tips:
      "Dal protein is incomplete — eating with rice creates a complete amino acid profile (combining legume + grain). Standard Indian meal is nutritionally smart by default.",
  },

  {
    id: "di_rajma_roti",
    name: "Rajma with 2 Rotis",
    slot: "dinner",
    dietTypes: ["veg", "vegan"],
    goal: [],
    kcal: 620,
    macro: { protein: 26, carbs: 90, fat: 14 },
    prepMins: 10,
    cookMins: 35,
    tags: ["indian", "batch", "high_fiber"],
    ingredients: [
      { name: "Cooked kidney beans (rajma)", grams: 250 },
      { name: "Whole wheat roti", grams: 120, note: "2 medium" },
      { name: "Onion-tomato masala", grams: 100 },
      { name: "Cooking oil", grams: 12 },
    ],
    tips:
      "Pressure cook soaked rajma 10–12 whistles for soft beans. Batch cook 500 g dry — freeze half. The leftover masala from rajma works well with chana or black beans too.",
  },

  {
    id: "di_palak_paneer_roti",
    name: "Palak Paneer with Roti",
    slot: "dinner",
    dietTypes: ["veg", "eggetarian"],
    goal: [],
    kcal: 640,
    macro: { protein: 32, carbs: 58, fat: 28 },
    prepMins: 10,
    cookMins: 20,
    tags: ["indian", "high_protein"],
    ingredients: [
      { name: "Paneer", grams: 150 },
      { name: "Spinach (blanched + pureed)", grams: 200 },
      { name: "Whole wheat roti", grams: 120 },
      { name: "Cream or milk", grams: 30 },
      { name: "Onion + garlic + ginger + spices", grams: 60 },
      { name: "Oil or ghee", grams: 12 },
    ],
    tips:
      "Blanch spinach 90 sec then transfer to ice water — preserves bright green colour. Add paneer at the very end, just heat through — overcooking makes it rubbery.",
  },

  {
    id: "di_tofu_lentil_vegan",
    name: "Tofu & Red Lentil Bowl",
    slot: "dinner",
    dietTypes: ["vegan"],
    goal: [],
    kcal: 580,
    macro: { protein: 36, carbs: 60, fat: 18 },
    prepMins: 10,
    cookMins: 20,
    tags: ["vegan", "high_protein", "batch"],
    ingredients: [
      { name: "Firm tofu (baked)", grams: 200 },
      { name: "Red lentils (masoor dal, cooked)", grams: 150 },
      { name: "Cooked rice or quinoa", grams: 150 },
      { name: "Coconut milk + turmeric + cumin", grams: 60 },
    ],
    tips:
      "Bake cubed tofu 25 min at 200°C — no oil needed; oven-baking makes it chewy and protein-dense tasting. Red lentils cook in 15 min without soaking.",
  },

  {
    id: "di_biryani_raita",
    name: "Chicken Biryani with Raita",
    slot: "dinner",
    dietTypes: ["nonveg"],
    goal: ["build"],
    kcal: 720,
    macro: { protein: 42, carbs: 80, fat: 22 },
    prepMins: 15,
    cookMins: 45,
    tags: ["indian", "batch"],
    ingredients: [
      { name: "Chicken (bone-in pieces)", grams: 250 },
      { name: "Basmati rice", grams: 150, note: "dry, cooked separately" },
      { name: "Curd marinade + whole spices", grams: 80 },
      { name: "Onion fried (birista)", grams: 30 },
      { name: "Raita (curd + cucumber)", grams: 150 },
    ],
    tips:
      "Marinate chicken in curd + biryani masala overnight for maximum flavour. Dum cook: layer rice over chicken in pot, seal with foil, lowest heat 20 min.",
  },
];

/**
 * Meal slot calorie distribution targets by goal.
 * Used to scale individual meal targets from total daily kcal.
 */
export const SLOT_DISTRIBUTION = {
  cut: {
    breakfast: 0.22,
    lunch: 0.28,
    snack: 0.10,
    pre: 0.07,
    dinner: 0.33,
  },
  build: {
    breakfast: 0.22,
    lunch: 0.30,
    snack: 0.12,
    pre: 0.09,
    dinner: 0.27,
  },
  maintain: {
    breakfast: 0.22,
    lunch: 0.28,
    snack: 0.11,
    pre: 0.08,
    dinner: 0.31,
  },
};

/**
 * Meal timing recommendations per slot.
 * Keyed by slot name.
 */
export const MEAL_TIMING = {
  breakfast: {
    window: "6:30 – 8:30 AM",
    note: "Eat within 60–90 min of waking. Skipping breakfast on a cut extends the overnight fast but often leads to overeating later.",
    maxGapToNextMeal: "3 hrs",
  },
  lunch: {
    window: "12:00 – 1:30 PM",
    note: "Largest calorie meal for most people. Load carbs here on training days — they'll fuel your afternoon/evening session.",
    maxGapToNextMeal: "3 hrs",
  },
  snack: {
    window: "3:00 – 4:00 PM",
    note: "Bridges the gap between lunch and dinner or pre-workout. On cut days keep this to protein + fruit.",
    maxGapToNextMeal: "2 hrs",
  },
  pre: {
    window: "45–90 min before training",
    note: "Simple carbs + minimal fat/fibre. Goal: full glycogen, not full stomach. No protein is needed here.",
    maxGapToNextMeal: "N/A",
  },
  dinner: {
    window: "7:00 – 9:00 PM",
    note: "Keep protein high, carbs moderate (rest day) to high (training day). Finish eating 2 hrs before sleep for better sleep quality.",
    maxGapToNextMeal: "N/A",
  },
};

/**
 * Quick lookup: which meal options are compatible with a given profile.
 * @param {string} slot
 * @param {string} dietType  nonveg | veg | vegan | eggetarian
 * @param {string} goal      cut | build | maintain
 * @returns {Array}
 */
export function getMealOptionsForSlot(slot, dietType, goal) {
  return MEAL_OPTIONS.filter((m) => {
    if (m.slot !== slot) return false;
    if (!m.dietTypes.includes(dietType)) return false;
    if (m.goal.length > 0 && !m.goal.includes(goal)) return false;
    return true;
  });
}
