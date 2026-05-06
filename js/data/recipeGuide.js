/**
 * Quick recipe and prep guide for common ingredients in the meal plan.
 *
 * Each recipe entry:
 *   id         unique string
 *   ingredient primary ingredient name (matches GROCERY_ITEMS keys where possible)
 *   title      display title
 *   yield      how much it makes
 *   prepMins   hands-on preparation time
 *   cookMins   oven/stovetop/wait time
 *   difficulty easy | medium | hard
 *   dietTags   compatible diet types
 *   macrosPer100g  approx finished dish macros
 *   steps      ordered array of instruction strings
 *   tips       array of coaching tips
 *   variations array of quick swap ideas
 */

export const RECIPES = [
  /* ─── CHICKEN ─── */
  {
    id: "chicken_meal_prep_bake",
    ingredient: "chicken_breast",
    title: "Oven-Baked Chicken Breast (Meal Prep, 4–6 portions)",
    yield: "4–6 × 200g servings",
    prepMins: 10,
    cookMins: 28,
    difficulty: "easy",
    dietTags: ["nonveg"],
    macrosPer100g: { kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
    steps: [
      "Preheat oven to 200°C / 400°F.",
      "In a bowl, mix: 2 tbsp olive oil, 1 tsp garlic powder, 1 tsp paprika, 1 tsp cumin, ½ tsp black pepper, 1 tsp salt.",
      "Place 1–1.5 kg chicken breasts in a large baking dish. Coat both sides with the spice mix.",
      "Optional: pound breasts to even 2 cm thickness with a rolling pin — ensures even cooking.",
      "Bake 22–26 min depending on thickness. Internal temp must reach 74°C / 165°F.",
      "Rest 5 min before slicing — keeps juices in the meat.",
      "Slice, cool, portion 200g per container. Refrigerate up to 4 days or freeze 3 months.",
    ],
    tips: [
      "Pound to even thickness — the single biggest improvement for not-dry chicken.",
      "Don't open the oven mid-cook. Letting moisture escape dries it out.",
      "Add a splash of water or chicken broth to the baking dish to create steam — keeps it moist.",
      "Marinate overnight for deeper flavour. Even 30 min makes a difference.",
      "Reheat with a drizzle of water covered in microwave — prevents drying on reheat.",
    ],
    variations: [
      "Lemon herb: swap paprika for dried oregano + lemon zest",
      "Indian style: use garam masala + coriander powder + ginger-garlic paste",
      "Tikka style: marinate in yogurt + tandoori masala overnight, then bake",
    ],
  },

  {
    id: "chicken_curry_quick",
    ingredient: "chicken_breast",
    title: "Weeknight Chicken Curry (30 min)",
    yield: "3–4 servings",
    prepMins: 8,
    cookMins: 22,
    difficulty: "easy",
    dietTags: ["nonveg"],
    macrosPer100g: { kcal: 145, protein: 16, carbs: 5, fat: 7 },
    steps: [
      "Dice 600g chicken into 3 cm cubes.",
      "Heat 1 tbsp oil in wide pan over high heat. Add chicken — don't stir for 2 min to get colour. Then stir-fry 3 min until mostly cooked. Remove and set aside.",
      "In same pan, add 1 tbsp oil. Sauté 1 large onion (diced) until golden, 6–7 min.",
      "Add 1 tsp ginger-garlic paste. Cook 1 min.",
      "Add 2 medium tomatoes (chopped) + 1 tsp cumin + 1 tsp coriander + ½ tsp turmeric + 1 tsp red chilli. Cook 5 min until tomatoes dissolve.",
      "Return chicken. Add 100 ml water. Simmer 8 min covered.",
      "Finish with garam masala + fresh coriander. Adjust salt.",
    ],
    tips: [
      "High heat at start gives better colour on chicken — don't crowd the pan.",
      "Cook onions until truly golden (not just translucent) — this is the base of flavour.",
      "Tomatoes must fully dissolve into a thick paste before adding chicken back.",
      "Batch this 2× — freezes perfectly for 3 months.",
    ],
    variations: [
      "Add 100g yogurt at the end, off heat, for creamy butter-chicken style",
      "Swap chicken for paneer (add at last 3 min only — don't overcook)",
      "Add spinach leaves in final 2 min for palak chicken",
    ],
  },

  /* ─── EGGS ─── */
  {
    id: "eggs_hard_boiled_batch",
    ingredient: "eggs",
    title: "Batch Hard-Boiled Eggs (Perfect Every Time)",
    yield: "12 eggs",
    prepMins: 2,
    cookMins: 12,
    difficulty: "easy",
    dietTags: ["nonveg", "eggetarian"],
    macrosPer100g: { kcal: 143, protein: 13, carbs: 1, fat: 10 },
    steps: [
      "Bring a pot of water to a full rolling boil.",
      "Gently lower eggs with a spoon — room temperature eggs crack less.",
      "Cook exactly 11–12 min for firm yolk (not grey), 9–10 min for jammy yolk.",
      "Transfer immediately to ice water bath — stop cooking and make peeling easy.",
      "Peel once cool, or refrigerate unpeeled up to 7 days.",
      "Peeled eggs: store in water-filled container in fridge, 5 days. Change water daily.",
    ],
    tips: [
      "Ice bath is non-negotiable — without it, the yolk turns grey-green at the edges.",
      "Slightly older eggs peel more easily than fresh eggs (gas under shell increases with age).",
      "Never boil from cold water — timing varies too much with stove power. Always start from boiling.",
      "Season with salt + hot sauce for a quick snack in seconds.",
    ],
    variations: [
      "Soft-boiled (6.5 min) + soy sauce for a Japanese-style protein snack",
      "Devilled eggs: mash yolks with Greek yogurt + mustard + paprika",
      "Quick egg curry: halve and add to prepared onion-tomato masala for 10-min meal",
    ],
  },

  {
    id: "eggs_scrambled_high_protein",
    ingredient: "eggs",
    title: "High-Protein Scrambled Eggs (3 Eggs + Whites)",
    yield: "1 serving",
    prepMins: 2,
    cookMins: 6,
    difficulty: "easy",
    dietTags: ["nonveg", "eggetarian"],
    macrosPer100g: { kcal: 130, protein: 15, carbs: 1, fat: 7 },
    steps: [
      "Crack 2 whole eggs + 2 egg whites into a bowl. Whisk with a fork until fully combined.",
      "Heat pan over medium-low heat. Add ½ tsp butter or oil.",
      "Pour in eggs. Wait 20 seconds, then begin folding gently with a spatula from edges inward.",
      "Remove from heat when eggs are still slightly glossy — residual heat finishes cooking.",
      "Season with salt + pepper AFTER cooking (salt before toughens proteins).",
    ],
    tips: [
      "Low and slow is the key — medium-low heat creates creamy curds, not rubbery chunks.",
      "Remove slightly underdone — they continue cooking for 30 sec off heat.",
      "Adding 1 tbsp Greek yogurt or cottage cheese to the eggs before cooking adds protein and creaminess.",
    ],
    variations: [
      "Masala scramble: add chopped green chilli + onion + tomato, cook onion first",
      "Protein boost: stir in 1 tbsp cottage cheese before cooking",
      "Mexican: add salsa, cumin, top with avocado (adds good fat)",
    ],
  },

  /* ─── PANEER ─── */
  {
    id: "paneer_bhurji",
    ingredient: "paneer",
    title: "Paneer Bhurji (High-Protein Veg Scramble)",
    yield: "2 servings",
    prepMins: 5,
    cookMins: 12,
    difficulty: "easy",
    dietTags: ["veg", "eggetarian"],
    macrosPer100g: { kcal: 220, protein: 15, carbs: 5, fat: 16 },
    steps: [
      "Crumble 300g paneer finely with hands — no large chunks.",
      "Heat 1 tbsp oil in pan over medium heat.",
      "Add 1 tsp cumin seeds. When they splutter, add 1 medium onion finely diced.",
      "Sauté onion until golden, 5–6 min. Add 1 tsp ginger-garlic paste, cook 1 min.",
      "Add 1 tomato diced + ½ tsp turmeric + ½ tsp coriander powder + ½ tsp chilli powder. Cook until tomato breaks down, 4 min.",
      "Add crumbled paneer. Toss well to coat. Cook 3–4 min on medium, folding occasionally.",
      "Add garam masala + salt. Garnish with coriander. Serve immediately or refrigerate.",
    ],
    tips: [
      "Finely crumbled paneer is essential — large chunks don't absorb masala well.",
      "Don't overcook paneer after adding — 3–4 min max. Overcooked paneer becomes chewy and dry.",
      "Squeeze ½ lemon over finished bhurji — brightens all flavours.",
      "Tastes better day 2 — make double batch, refrigerate, reheat in 2 min.",
    ],
    variations: [
      "Egg + paneer bhurji: add 2 scrambled eggs for extra protein (eggetarian)",
      "Spinach bhurji: add 1 cup chopped spinach with the tomato",
      "Capsicum-corn bhurji: add diced capsicum + frozen corn for extra volume",
    ],
  },

  {
    id: "paneer_tikka_oven",
    ingredient: "paneer",
    title: "Oven Paneer Tikka (No Tandoor Needed)",
    yield: "2 servings",
    prepMins: 10,
    cookMins: 20,
    difficulty: "easy",
    dietTags: ["veg", "eggetarian"],
    macrosPer100g: { kcal: 245, protein: 17, carbs: 6, fat: 17 },
    steps: [
      "Cut 250g paneer into 3 cm cubes.",
      "Marinade: mix 150g thick curd + 1 tsp ginger-garlic paste + 1 tsp red chilli + 1 tsp garam masala + ½ tsp turmeric + 1 tsp kasuri methi (dried fenugreek) + salt + 1 tsp oil.",
      "Coat paneer cubes well. Marinate minimum 30 min, up to overnight.",
      "Preheat oven to 220°C. Line baking tray with foil, grease lightly.",
      "Spread paneer in single layer. Bake 15 min. Switch to broil/grill for last 4–5 min for charred edges.",
      "Serve with onion rings, lemon, and green chutney.",
    ],
    tips: [
      "Thick curd is key — hang regular curd in muslin 30 min or use Greek yogurt.",
      "High oven temperature + broil at end mimics tandoor char.",
      "Don't skip kasuri methi — gives authentic tikka flavour.",
    ],
    variations: [
      "Veggie tikka: add chunks of capsicum, onion, mushroom to same marinade",
      "Tofu tikka (vegan): use same marinade on pressed tofu",
      "Tikka wraps: stuff into whole wheat roti with onion, chutney, and lemon",
    ],
  },

  /* ─── TOFU ─── */
  {
    id: "tofu_baked_crispy",
    ingredient: "tofu_firm",
    title: "Crispy Oven-Baked Tofu",
    yield: "2–3 servings",
    prepMins: 35,
    cookMins: 28,
    difficulty: "easy",
    dietTags: ["veg", "vegan"],
    macrosPer100g: { kcal: 120, protein: 12, carbs: 4, fat: 6 },
    steps: [
      "Drain 400g firm tofu. Wrap in 3 layers of paper towels and place on a plate. Put a heavy pan on top. Press 30 min minimum (longer = crispier).",
      "Preheat oven to 205°C / 400°F.",
      "Cut pressed tofu into 2 cm cubes.",
      "Toss with: 1 tbsp soy sauce + 1 tsp sesame oil + 1 tsp cornstarch (optional, helps crispiness) + ½ tsp garlic powder.",
      "Spread in a single layer on parchment-lined baking tray — no touching.",
      "Bake 25–28 min, flipping halfway, until golden and slightly crisp on all sides.",
    ],
    tips: [
      "Pressing is 80 % of the result — skip it and you get soggy tofu.",
      "Cornstarch coating makes a huge crispiness difference — even ½ tsp helps.",
      "Space the cubes out — crowding creates steam and prevents crisping.",
      "Freezing tofu overnight then fully thawing before pressing creates a chewier, more 'meaty' texture.",
    ],
    variations: [
      "Indian masala tofu: toss in garam masala + chilli + cumin before baking",
      "Sesame teriyaki: coat in teriyaki sauce last 5 min of baking",
      "Air fryer: 200°C, 15 min, shake halfway — faster and even crispier",
    ],
  },

  /* ─── DAL (LENTILS) ─── */
  {
    id: "dal_tadka",
    ingredient: "lentils_dry",
    title: "Dal Tadka (Pressure Cooker Batch)",
    yield: "4–5 servings",
    prepMins: 5,
    cookMins: 30,
    difficulty: "easy",
    dietTags: ["veg", "vegan", "eggetarian"],
    macrosPer100g: { kcal: 120, protein: 6, carbs: 16, fat: 3.5 },
    steps: [
      "Rinse 300g toor dal in multiple changes of water until clear.",
      "Pressure cooker: add rinsed dal + 900 ml water + ½ tsp turmeric + salt. Cook 5 whistles on medium. Rest 10 min before opening.",
      "Whisk cooked dal to smooth consistency. Add water if too thick.",
      "Tadka: heat 1.5 tbsp ghee in small pan. Add 1 tsp cumin seeds — let splutter 30 sec. Add 3 crushed garlic cloves — fry golden, 1 min. Add 2 dried red chillies. Pour over dal immediately.",
      "Stir gently. Finish with squeeze of lemon and fresh coriander.",
    ],
    tips: [
      "Let pressure drop naturally — don't quick-release. Dal continues cooking and becomes silkier.",
      "Tadka goes on LAST — adding hot ghee+garlic over finished dal preserves the fresh aroma.",
      "Dal thickens when refrigerated — thin with water when reheating.",
      "Make double batch — freezes well in portioned containers up to 3 months.",
    ],
    variations: [
      "Masoor dal: faster (15 min, no soaking needed), similar nutrition",
      "Moong dal: lightest, fastest (10–12 min), ideal if digestion is sensitive",
      "Dal makhani: add soaked urad dal + rajma + cream for richer version (higher fat)",
    ],
  },

  /* ─── RICE ─── */
  {
    id: "rice_batch_stovetop",
    ingredient: "basmati_rice",
    title: "Perfect Batch-Cooked Basmati Rice",
    yield: "~8 × 200g cooked portions",
    prepMins: 5,
    cookMins: 20,
    difficulty: "easy",
    dietTags: ["veg", "vegan", "nonveg", "eggetarian"],
    macrosPer100g: { kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    steps: [
      "Measure 700g dry basmati. Rinse in cold water 3–4 times until water runs clear — removes excess starch.",
      "Soak rinsed rice in cold water 20 min (optional but helps fluffy texture).",
      "In large pot: bring 1050 ml water to boil (1:1.5 ratio). Add 1 tsp salt.",
      "Drain soaked rice, add to boiling water. Stir once. Bring back to boil.",
      "Reduce to lowest heat. Cover with tight lid. Cook 12 min exactly — no peeking.",
      "Remove from heat. Rest covered 5 min. Fluff with fork.",
      "Spread on tray to cool before portioning — prevents clumping in containers.",
      "Portion 200g per container. Refrigerate 5 days or freeze 3 months.",
    ],
    tips: [
      "Rinsing is the most important step — removes surface starch that makes rice sticky.",
      "Never lift the lid during cooking — steam is the cooking mechanism.",
      "Cool completely before refrigerating — warm rice creates condensation that makes it soggy.",
      "Reheat: add 1 tbsp water per 200g, cover, microwave 90 sec.",
    ],
    variations: [
      "Jeera rice: fry 1 tsp cumin seeds in 1 tsp ghee before adding water",
      "Lemon rice: toss cooked cooled rice with lemon juice + mustard seed tadka + curry leaves",
      "Brown rice: use 1:2 ratio (rice:water), cook 35–40 min",
    ],
  },

  /* ─── OATS ─── */
  {
    id: "overnight_oats_batch",
    ingredient: "rolled_oats",
    title: "Overnight Oat Jars — 5-Day Batch",
    yield: "5 jars (5 breakfasts)",
    prepMins: 15,
    cookMins: 0,
    difficulty: "easy",
    dietTags: ["veg", "eggetarian"],
    macrosPer100g: { kcal: 120, protein: 8, carbs: 18, fat: 3 },
    steps: [
      "Line up 5 mason jars (500 ml each) on your counter.",
      "Per jar: add 80g rolled oats, 150g Greek yogurt (0–2 %), 80 ml milk or water, 1 tsp honey or maple syrup.",
      "Stir well inside each jar — oats should be fully submerged in liquid.",
      "Seal and refrigerate overnight minimum. Fine for up to 4 days.",
      "Morning: stir, top with sliced banana + 15g chopped almonds.",
      "Eat cold or microwave 60 sec if preferred warm.",
    ],
    tips: [
      "Use old-fashioned rolled oats, not quick oats — better texture after soaking.",
      "Don't add fruit until morning — berries bleed colour into oats; bananas brown.",
      "For higher protein: stir in 30g whey or pea protein powder before refrigerating.",
      "Vegan version: swap yogurt for coconut yogurt, milk for oat milk.",
    ],
    variations: [
      "Chocolate PB: add 1 tbsp cocoa powder + 1 tbsp peanut butter per jar",
      "Mango chia: swap fruit for frozen mango chunks + 1 tbsp chia seeds",
      "Protein oats: add 1 scoop vanilla protein per jar (~+25g protein)",
    ],
  },

  /* ─── CHICKPEAS / CHANA ─── */
  {
    id: "chana_masala_batch",
    ingredient: "chickpeas_dry",
    title: "Chana Masala (Pressure Cooker Batch)",
    yield: "5–6 servings",
    prepMins: 10,
    cookMins: 35,
    difficulty: "medium",
    dietTags: ["veg", "vegan"],
    macrosPer100g: { kcal: 140, protein: 7, carbs: 18, fat: 4.5 },
    steps: [
      "Soak 300g dry chana (white chickpeas) in water 8–12 hrs. Drain and rinse.",
      "Pressure cook drained chana: add 600 ml water + ½ tsp salt + 1 bay leaf. 8–10 whistles. Rest naturally.",
      "Masala base: heat 2 tbsp oil. Sauté 2 large onions until deep golden brown (10–12 min — don't rush this).",
      "Add 2 tsp ginger-garlic paste. Cook 2 min. Add 3 tomatoes pureed. Cook until oil separates, 8–10 min.",
      "Add spices: 1 tsp chana masala powder + 1 tsp coriander + ½ tsp cumin + ½ tsp turmeric + 1 tsp red chilli.",
      "Add cooked chickpeas + 150 ml reserved cooking liquid. Simmer 15 min until gravy thickens.",
      "Finish: garam masala + lemon juice + fresh coriander.",
    ],
    tips: [
      "Golden-brown (not just transparent) onions are non-negotiable — this is what makes chana masala rich.",
      "Oil separating from masala after adding tomatoes = masala is cooked. Don't skip this.",
      "Reserved cooking liquid adds flavour — use it instead of plain water.",
      "Batch: this recipe makes 5–6 portions. Freeze half in zip-locks — lasts 3 months.",
    ],
    variations: [
      "Black chana: more fibre and slightly nuttier. Same recipe.",
      "Canned chickpeas: skip pressure cooking, add drained cans at masala stage — 25 min total",
      "Chana palak: add 2 cups blanched spinach at the end",
    ],
  },

  /* ─── SWEET POTATO ─── */
  {
    id: "sweet_potato_batch_bake",
    ingredient: "sweet_potato",
    title: "Batch-Baked Sweet Potatoes",
    yield: "5–6 portions (~200g each)",
    prepMins: 3,
    cookMins: 50,
    difficulty: "easy",
    dietTags: ["veg", "vegan", "nonveg", "eggetarian"],
    macrosPer100g: { kcal: 86, protein: 1.6, carbs: 20, fat: 0.1 },
    steps: [
      "Preheat oven to 200°C / 400°F.",
      "Scrub 1–1.2 kg sweet potatoes. Pierce each 6–8 times with fork (prevents steam buildup).",
      "Place directly on oven rack or baking sheet. No oil needed.",
      "Bake 45–55 min depending on size. Done when a fork slides in with no resistance.",
      "Cool to room temperature. Refrigerate whole or halved in containers.",
      "Reheat: microwave 90 sec for half a potato. Top with salt, pepper, optional sprinkle of cinnamon.",
    ],
    tips: [
      "Bigger potatoes need longer — check at 45 min then every 5 min.",
      "The skin caramelises during baking — eat it for extra fibre.",
      "For post-workout, use white rice for faster glycogen replenishment. Save sweet potato for dinner.",
    ],
    variations: [
      "Wedge fries: slice thin, toss in 1 tsp oil + paprika, bake 30 min at 210°C",
      "Mashed: scoop flesh, mix with salt + a little milk — better texture than regular potato",
      "Stuffed: bake whole, stuff with cottage cheese + chilli + lemon",
    ],
  },

  /* ─── WHEY SHAKES ─── */
  {
    id: "whey_shake_post_workout",
    ingredient: "whey_protein",
    title: "Post-Workout Whey + Creatine Shake",
    yield: "1 serving",
    prepMins: 2,
    cookMins: 0,
    difficulty: "easy",
    dietTags: ["nonveg", "veg", "eggetarian"],
    macrosPer100g: { kcal: 140, protein: 28, carbs: 10, fat: 2 },
    steps: [
      "Add to shaker: 1–1.5 scoops whey protein (25–35g protein).",
      "Add 300 ml cold water (lighter) or skim milk (more protein + carbs).",
      "Add 5g creatine monohydrate (stirs in — no taste).",
      "Shake 20 seconds. Drink immediately.",
    ],
    tips: [
      "Water shakes: lower calorie, digests fastest — good on a cut.",
      "Milk shakes: extra 10g protein (casein) — better for building or if training depleted.",
      "Cold water mixes cleaner than room temperature.",
      "On rest days: still take creatine — add to any drink or food.",
    ],
    variations: [
      "Banana shake: blend with 1 frozen banana + 200 ml milk for post-workout carbs",
      "Oat shake: blend with 40g rolled oats + 250 ml milk for sustained energy",
      "Chocolate peanut butter: add 1 tbsp PB + cocoa powder — higher calorie build shake",
    ],
  },

  /* ─── MOONG DAL CHILLA ─── */
  {
    id: "moong_dal_chilla",
    ingredient: "lentils_dry",
    title: "Moong Dal Chilla (High-Protein Pancakes)",
    yield: "6–8 chillas (3–4 servings)",
    prepMins: 10,
    cookMins: 20,
    difficulty: "easy",
    dietTags: ["veg", "vegan"],
    macrosPer100g: { kcal: 180, protein: 12, carbs: 24, fat: 5 },
    steps: [
      "Soak 200g yellow moong dal in water 4–6 hrs (or overnight). Drain.",
      "Blend soaked dal with 100 ml water until smooth batter. Add more water for thin, crepe-like result.",
      "Mix in: ½ tsp salt, ½ tsp cumin, 1 green chilli (finely chopped), 1 tbsp coriander leaves.",
      "Heat non-stick pan on medium. Add ½ tsp oil, spread with paper towel.",
      "Pour one ladle of batter, spread to thin round (like a dosa). Cook 2–3 min until edges lift.",
      "Flip carefully, cook 90 sec other side. Repeat.",
      "Batter stores in fridge 2 days. Cooked chillas: refrigerate 3 days.",
    ],
    tips: [
      "Thinner batter = crispier chilla. Thick batter = doughy in centre.",
      "Keep heat medium, not high — too hot burns before inside sets.",
      "Make 6–8 at once Sunday. Reheat in pan or microwave.",
      "Pair with curd + green chutney for a complete high-protein meal.",
    ],
    variations: [
      "Add grated paneer or cottage cheese to batter — doubles protein",
      "Stuffed: spread green chutney + grated carrot inside before folding",
      "Vegan: same recipe is already vegan. Use oil instead of ghee.",
    ],
  },

  /* ─── RAJMA ─── */
  {
    id: "rajma_batch",
    ingredient: "rajma",
    title: "Rajma Masala (Batch Freezer Meal)",
    yield: "5–6 servings",
    prepMins: 10,
    cookMins: 50,
    difficulty: "medium",
    dietTags: ["veg", "vegan"],
    macrosPer100g: { kcal: 127, protein: 8.7, carbs: 23, fat: 0.5 },
    steps: [
      "CRITICAL: Soak 300g raw rajma minimum 8 hours. Discard soaking water.",
      "Pressure cook soaked rajma: fresh water + 1 tsp salt + bay leaf. 12–15 whistles or until completely soft. Reserve cooking liquid.",
      "Masala base: heat 2 tbsp oil. Add 2 onions finely diced. Cook 12 min until deep brown.",
      "Add ginger-garlic paste 2 min. Add 2 tomatoes pureed. Cook until oil separates, 10 min.",
      "Add: 1 tsp cumin + 1 tsp coriander + ½ tsp turmeric + 1 tsp red chilli + 1 tsp rajma masala.",
      "Add cooked beans + 200 ml cooking liquid. Mash ~20 % of beans with back of spoon — thickens gravy.",
      "Simmer 15–20 min. Finish: garam masala + lemon + coriander.",
    ],
    tips: [
      "RAW OR UNDERCOOKED kidney beans contain phytohaemagglutinin — toxic. Must be thoroughly cooked.",
      "Always start with fresh cold water for pressure cooking, not soaking water.",
      "More time = better flavour — 20 min simmer in masala vs 5 min makes a big difference.",
      "Rajma improves overnight. Always better day 2.",
    ],
    variations: [
      "Rajma rice bowl: serve over basmati with chopped onion + lemon squeeze",
      "Rajma taco: in corn tortilla with curd, salsa, coriander",
      "Add black beans 50/50 for variation — same recipe",
    ],
  },
];

/**
 * Ingredient-to-recipe lookup. Returns all recipes for a given ingredient id.
 * @param {string} ingredientId
 * @returns {Array}
 */
export function getRecipesForIngredient(ingredientId) {
  return RECIPES.filter((r) => r.ingredient === ingredientId);
}

/**
 * Returns a flat list of tips for batch cooking on Sunday,
 * filtered to a specific diet type.
 * @param {string} dietType  nonveg | veg | vegan | eggetarian
 * @returns {string[]}
 */
export function getSundayBatchTips(dietType) {
  const relevant = RECIPES.filter(
    (r) => r.dietTags.includes(dietType) && ["chicken_meal_prep_bake", "eggs_hard_boiled_batch", "rice_batch_stovetop", "overnight_oats_batch", "dal_tadka", "chana_masala_batch", "sweet_potato_batch_bake", "tofu_baked_crispy"].includes(r.id)
  );
  return relevant.map((r) => `${r.title} — ${r.prepMins + r.cookMins} min total, yields ${r.yield}`);
}
