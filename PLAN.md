# NutriPal PWA — Full Implementation Plan v2

> **Status**: Plan only. No code written yet.
> **Your manual tasks**: Create mascot images (prompts in Section 8). Everything else is for the build agent.

---

## What We Are Building

A mobile-first **Progressive Web App** (PWA) — no server, no login, works offline, installs to iPhone/Android home screen like a real app.

**Core flow:**
1. User picks their language (English / Hinglish / Gujlish)
2. Mascot-guided step-by-step quiz collects their stats and preferences
3. App generates a fully personalised plan — correct duration, correct meals for their diet type, correct language
4. They tap "Add to Home Screen" — it lives on their phone like a native app
5. Everything stored on device, nothing sent anywhere

**Mascot:** Axo the Axolotl — prehistoric, pink, chubby, big round eyes, feathery gills. Gender-neutral, universally lovable. Duolingo-level charm.

---

## File Structure

```
/
├── index.html              ← Language picker + onboarding wizard
├── app.html                ← Main plan app (all 6 pages)
├── manifest.json           ← PWA install config
├── sw.js                   ← Service worker (offline)
├── css/
│   ├── tokens.css          ← Design tokens
│   ├── components.css      ← Shared UI
│   ├── onboarding.css      ← Quiz styles
│   └── app.css             ← Main app styles
├── js/
│   ├── store.js            ← localStorage helper
│   ├── i18n.js             ← All 3 language strings
│   ├── onboarding.js       ← Quiz logic
│   ├── plangen.js          ← Plan generation engine
│   ├── app.js              ← Router + bottom nav
│   └── pages/
│       ├── home.js
│       ├── phases.js
│       ├── meals.js
│       ├── prep.js
│       ├── grocery.js
│       └── supps.js
└── assets/
    ├── axo/
    │   ├── axo-wave.png    ← YOU create (prompt below)
    │   ├── axo-think.png   ← YOU create
    │   ├── axo-flex.png    ← YOU create
    │   └── axo-eat.png     ← YOU create
    └── icons/
        ├── icon-192.png    ← YOU create
        └── icon-512.png    ← YOU create
```

---

## Section 1 — Language System

### Three Languages Supported

| Code | Name | Description |
|------|------|-------------|
| `en` | English | Standard English throughout |
| `hi` | Hinglish | Hindi + English mixed, like how people actually talk — "Bhai, aaj ka meal yeh hai..." |
| `gu` | Gujlish | Gujarati + English mixed — "Kem cho! Aaje nu meal plan joiye..." |

### Language Picker Screen

This is the very first screen — before anything else. Three big cards, one per language, each with a sample phrase so the user knows what they're picking.

```
┌─────────────────────────────┐
│  English                    │
│  "Let's build your plan."   │
└─────────────────────────────┘
┌─────────────────────────────┐
│  Hinglish  हिंग्लिश           │
│  "Tera plan banate hain."   │
└─────────────────────────────┘
┌─────────────────────────────┐
│  Gujlish   ગુજ્લિશ             │
│  "Tara plan baniye."        │
└─────────────────────────────┘
```

Once picked, all text in the entire app switches to that language. Stored in `localStorage` as `lang`. User can change it from Settings (gear icon top-right on home page).

### i18n File: `js/i18n.js`

All text lives here. Structure:

```js
const STRINGS = {
  en: {
    welcome: "Let's build your plan.",
    q_name: "First, what's your name?",
    q_goal: "What's your main goal?",
    goal_cut: "Lose fat",
    goal_build: "Build muscle",
    goal_recomp: "Both",
    // ... all strings
    meals: {
      breakfast: "Breakfast",
      lunch: "Lunch",
      // ...
    }
  },
  hi: {
    welcome: "Tera plan banate hain. 💪",
    q_name: "Pehle bata, tera naam kya hai?",
    q_goal: "Tera main goal kya hai?",
    goal_cut: "Fat lose karna hai",
    goal_build: "Muscle banana hai",
    goal_recomp: "Dono chahiye",
    meals: {
      breakfast: "Subah ka khaana",
      lunch: "Dopahar ka khaana",
    }
    // ...
  },
  gu: {
    welcome: "Tara plan baniye. 💪",
    q_name: "Pehla, taru naam shu chhe?",
    q_goal: "Taro main goal shu chhe?",
    goal_cut: "Fat ghumavvu chhe",
    goal_build: "Muscle banana chhe",
    goal_recomp: "Be-u joiye chhe",
    meals: {
      breakfast: "Savaar nu jaman",
      lunch: "Bapor nu jaman",
    }
    // ...
  }
}

function t(key) {
  const lang = localStorage.getItem('lang') || 'en';
  // supports dot notation: t('meals.breakfast')
  return key.split('.').reduce((o,k) => o?.[k], STRINGS[lang]) || STRINGS.en[key] || key;
}
```

Every piece of visible text in the entire app calls `t('key')` — never hardcodes strings directly.

---

## Section 2 — Onboarding Quiz (14 Steps)

Axo appears at the top of every step. Progress bar at top shows how far through they are.

| # | Screen | Question | Input | Notes |
|---|--------|----------|-------|-------|
| 0 | Language | Pick your language | 3 cards | First screen, no back button |
| 1 | Splash | "Let's build your plan." | Tap to begin | Axo waves, user's name not known yet |
| 2 | Name | "What's your name?" | Text field | Used everywhere after this |
| 3 | Goal | "Main goal?" | 3 big buttons: Cut / Build / Recomp | |
| 4 | Duration | "How long do you want your plan?" | Option grid: 4 weeks / 8 weeks / 12 weeks / 16 weeks / 6 months / 1 year | Custom option too |
| 5 | Weight | "Current weight?" | Slider + kg/lbs toggle | |
| 6 | Height | "How tall are you?" | Slider + cm/ft toggle | |
| 7 | Age | "How old are you?" | Number picker | |
| 8 | Sex | "Biological sex?" | Male / Female / Prefer not to say | Affects BMR formula |
| 9 | Activity | "How active outside the gym?" | 4 cards with icons | Sedentary → Very active |
| 10 | Training days | "How many days/week do you train?" | 1–7 tap grid | |
| 11 | Diet type | "Are you veg or non-veg?" | Veg / Non-veg / Eggetarian / Vegan | **Critical — drives entire meal plan** |
| 12 | Food preferences | "Any other preferences?" | Multi-select chips | No dairy / No gluten / No pork / Jain (no root veg) / Halal only |
| 13 | Supplements | "Which supplements do you have?" | Multi-select chips | Creatine / Whey / Pre-workout / Omega-3 / Multivitamin / Magnesium / Ashwagandha / None |
| 14 | City | "City or region?" | Text field, skippable | For grocery store tips |
| 15 | Loading | "Building your plan…" | Axo animated + progress → redirect | 2–3 sec fake progress, then to app.html |

---

## Section 3 — Diet Types & Meal Plans

This is the core of personalisation. Every meal is chosen based on diet type. Meals rotate by weekday so there is no repetition. 7 unique daily templates per diet type.

### Diet Type: Non-Veg

Protein sources: chicken breast, chicken thighs, eggs, tuna, Greek yogurt, whey

**Weekday rotation:**

| Day | Breakfast | Lunch | Snack | Pre-workout | Dinner |
|-----|-----------|-------|-------|-------------|--------|
| Mon | Eggs + toast + banana | Chicken breast + rice + broccoli | Greek yogurt + whey + nuts | Banana + oats | Whey + sweet potato |
| Tue | Omelette (3 eggs) + wheat roti | Chicken thighs + rice + salad | Cottage cheese + apple | Banana + oats | Eggs + lentils + roti |
| Wed | Boiled eggs + oats + milk | Tuna wrap in wheat roti + salad | Whey shake + nuts | Banana + oats | Chicken + rajma/kidney beans + rice |
| Thu | Egg bhurji + toast | Chicken + quinoa/brown rice + spinach | Greek yogurt + fruit | Banana + oats | Tuna + sweet potato + vegetables |
| Fri | Scrambled eggs + paratha (light oil) | Chicken + rice + dal | Whey + apple | Banana + oats | Omelette + chickpeas + roti |
| Sat | Egg white omelette + banana + nuts | Chicken + rice + mixed veg | Cottage cheese + nuts | Banana + oats | Chicken thighs + lentil soup + roti |
| Sun | Boiled eggs + poha | Tuna + rice + cucumber salad | Whey + banana | Rest day — no pre-workout | Chicken + dal tadka + rice |

---

### Diet Type: Veg

Protein sources: paneer, tofu, lentils, dal, rajma, chickpeas, eggs (if Eggetarian), Greek yogurt, whey (if they have it), cottage cheese

**Weekday rotation:**

| Day | Breakfast | Lunch | Snack | Pre-workout | Dinner |
|-----|-----------|-------|-------|-------------|--------|
| Mon | Besan chilla (chickpea pancake) + yogurt | Paneer bhurji + rice + salad | Greek yogurt + whey + nuts | Banana + oats | Dal tadka + rice + vegetables |
| Tue | Oats + milk + banana + nuts | Tofu scramble + roti | Cottage cheese + apple | Banana + oats | Rajma chawal (kidney beans + rice) |
| Wed | Moong dal chilla + green chutney | Paneer tikka + rice + salad | Whey shake + fruit | Banana + oats | Chana masala + roti |
| Thu | Poha (flattened rice) + peanuts | Soya chunks + rice + salad | Greek yogurt + nuts | Banana + oats | Palak tofu + roti + salad |
| Fri | Dalia (broken wheat) + milk | Paneer + quinoa + salad | Whey + banana | Banana + oats | Dal makhani (light) + rice |
| Sat | Idli (2–3) + sambar + coconut chutney | Soya bhurji + rice + vegetables | Cottage cheese + apple | Banana + oats | Mixed dal + roti + cucumber raita |
| Sun | Besan omelette + toast | Chhole (chickpeas) + rice | Whey + nuts | Rest day | Tofu curry + brown rice |

---

### Diet Type: Eggetarian

Same as Veg but eggs are available. Egg dishes replace tofu/soya when convenient.

---

### Diet Type: Vegan

No dairy, no eggs. Greek yogurt → coconut yogurt. Paneer/cottage cheese → tofu/tempeh. Whey → pea protein (if they have it) or hemp protein. Milk → oat milk / soy milk.

**Weekday rotation:**

| Day | Breakfast | Lunch | Snack | Pre-workout | Dinner |
|-----|-----------|-------|-------|-------------|--------|
| Mon | Oats + oat milk + banana + chia seeds | Tofu bhurji + rice + salad | Pea protein shake + nuts | Banana + oats | Dal tadka + rice |
| Tue | Smoothie (banana, oat milk, pea protein, nuts) | Tempeh + rice + vegetables | Coconut yogurt + fruit | Banana + oats | Rajma + roti |
| Wed | Besan chilla + green chutney | Soya chunks + rice + salad | Pea protein + banana | Banana + oats | Chana masala + rice |
| Thu | Poha + peanuts | Tofu tikka + quinoa + salad | Nuts + apple | Banana + oats | Palak tofu + roti |
| Fri | Dalia + oat milk | Soya bhurji + roti + salad | Pea protein shake | Banana + oats | Mixed dal + rice |
| Sat | Idli + sambar | Tempeh curry + rice | Coconut yogurt + nuts | Banana + oats | Chhole + roti |
| Sun | Banana pancakes (oat flour + oat milk + banana) | Chana pulao | Pea protein + fruit | Rest day | Tofu curry + brown rice |

---

### Jain Modifier

If user selects Jain (no root vegetables): remove onion, garlic, potato, carrot, beetroot from all meals. Replacement: use ginger (in moderation), asafoetida (hing), green chillies for flavour. Flag clearly in the meal plan.

---

## Section 4 — Flexible Duration System

User picks their plan length. The plan generator adapts.

| Duration | Phases | Phase length | Notes |
|----------|--------|--------------|-------|
| 4 weeks | 1 phase | 4 weeks | Single phase, establish habits, base calories |
| 8 weeks | 2 phases | 4 weeks each | Foundation + Adaptation |
| 12 weeks | 3 phases | 4 weeks each | Foundation + Build + Burn |
| 16 weeks | 4 phases | 4 weeks each | Full program (reference HTML) |
| 6 months (~24 wks) | 4 phases | Phase 4 extended | Phases 1–3 stay 4 wks each, Phase 4 = 12 wks |
| 1 year | 4 phases + 2 cycles | First 16 wks standard, then 2 re-run cycles | Maintenance cycle built in |

**Calorie progression logic** (scales with goal):

- Phase 1 always = base target calories
- Each subsequent phase = +100 kcal (cut/recomp) or +150 kcal (build)
- Final phase = slight pullback (−50 to −75 kcal) to strip last layer

**The app shows the right number of phase cards based on duration.** If 4 weeks → 1 card. If 1 year → explains the cycling structure.

---

## Section 5 — Plan Generation Engine (`js/plangen.js`)

### TDEE Calculation

```
BMR (Male)   = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
BMR (Female) = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
BMR (Other)  = average of male and female formulas

Activity multipliers:
  Sedentary        = BMR × 1.20
  Lightly active   = BMR × 1.375
  Active           = BMR × 1.55
  Very active      = BMR × 1.725

TDEE = BMR × multiplier
```

### Calorie Target

```
Cut:    TDEE − 400
Build:  TDEE + 200
Recomp: TDEE − 150
```

### Macros

```
Protein (g) = weight_kg × 2.0   (×2.2 for Cut)
Fat (g)     = (calories × 0.25) ÷ 9
Carbs (g)   = (calories − (protein×4) − (fat×9)) ÷ 4
```

### Meal Portion Scaling

Every meal has a "base portion" defined per ingredient (e.g. chicken = 200g base). The scaler multiplies by `(target_meal_kcal / base_meal_kcal)`. Rounded to nearest 25g for clean numbers.

```js
function scaleMeal(meal, targetKcal) {
  const factor = targetKcal / meal.baseKcal;
  return meal.ingredients.map(ing => ({
    ...ing,
    amount: Math.round((ing.baseAmount * factor) / 25) * 25
  }));
}
```

### Grocery List Generator

For each week:
- Loop through all 7 day meal templates for the active diet type
- Sum each ingredient across all meals
- Round up to purchase units (e.g. nearest 250g, nearest dozen for eggs)
- Group by category: Protein / Carbs / Veg & Fruit / Dairy & Fats / Pantry

### Supplement Schedule

- Read from `userProfile.supplements[]`
- Output only the supplements they have
- If `whey` not in list and diet is Veg/Vegan: show note in correct language about hitting protein from food
- Timing rules are fixed per supplement (same as reference HTML)

---

## Section 6 — App Design: iOS 26 Liquid Glass

### Fonts
```
Body:  -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif
Mono:  'SF Mono', 'Menlo', monospace
```

### Colours (dark mode, auto-adapts to light)
```
Background:       #000000
Surface (cards):  rgba(28, 28, 30, 0.72)   ← frosted glass
Nav:              rgba(18, 18, 20, 0.92)
Border:           rgba(255, 255, 255, 0.09)
Accent lime:      #d4f53c
Accent teal:      #3effc8
Accent orange:    #ff6030
Text:             #ffffff
Text dim:         rgba(255,255,255,0.60)
```

### Glass Effect
```css
backdrop-filter: blur(28px) saturate(180%);
-webkit-backdrop-filter: blur(28px) saturate(180%);
background: rgba(28, 28, 30, 0.72);
border: 1px solid rgba(255, 255, 255, 0.09);
```

### Border Radius (squircle)
```
Cards:     20px
Chips:     12px
Buttons:   14px
Full pill:  9999px
```

### Animations
- Page transitions: slide + fade, 300ms ease-out
- Axo mascot: gentle floating bob loop
- Button tap: scale 0.96 → spring back
- Progress bar: smooth width CSS transition

---

## Section 7 — Main App Pages

**Top bar**: shows `[Name].` only — e.g. `Rudra.` — in the SF Display font, large weight. No logo, no clutter.
**Bottom nav**: Home · Phases · Meals · Prep · Grocery · Supps

All text rendered via `t('key')` so it's in the user's chosen language.

### Home Page
- Greeting: `t('home.greeting')` → "Good morning, Rudra." / "Subah bakhair, Rudra." / "Saaru savarnu, Rudra."
- Today's schedule (rendered from generated plan)
- Stat bar: weight · duration · protein/day
- Quick-nav cards to all pages
- Progress tip info boxes

### Phases Page
- One card per phase (1–4 depending on duration)
- Each card: calorie target, macros, what to focus on, flavour rotation tip
- Phase length labels adapt: "4 weeks / 8 weeks / 12 weeks..."

### Meals Page
- **Two tabs: Workout Day / Rest Day**
- **Weekday picker: Mon Tue Wed Thu Fri Sat Sun** — each day shows its unique meal rotation
- Meals filtered by diet type (no chicken shown to veg users)
- Portions scaled to user's calorie target
- Each meal card: time, name (in user's language), kcal, ingredients list, tags (High protein, etc.)

### Prep Page
- Sunday batch cook guide
- Steps adapt to diet type: veg users see paneer press + lentil boil steps instead of chicken
- Time estimates per step

### Grocery Page
- 5-tab list: Protein / Carbs / Veg & Fruit / Dairy & Fats / Pantry
- Items generated from the meal plan for that week
- Quantities shown
- Tap to check off
- Regional grocery tip (if city provided)
- All item names in user's language

### Supps Page
- Shows only supplements the user said they have
- Daily schedule
- Per-supplement card: why it works, timing, dosage
- Protein powder comparison section (if they don't have whey yet)

---

## Section 8 — Your Manual Tasks (Images)

### Mascot: Axo the Axolotl — 4 Poses

Use any AI image generator (Midjourney, DALL-E 3, Ideogram, Adobe Firefly). Export each as **PNG with transparent background**.

---

**`axo-wave.png`** — Welcome / splash screen
```
Cute axolotl character, pink and peach body, pink feathery gills on sides of head, big round black eyes, wide friendly smile, chubby chibi proportions, stubby arms and legs. Flat vector illustration style. Transparent background. The axolotl is waving one hand cheerfully with a huge happy grin. Clean minimal lines. Think Duolingo owl energy but an axolotl. No text, no shadows, no background.
```

---

**`axo-think.png`** — Quiz / question screens
```
Same cute chibi axolotl — pink body, feathery gills, big eyes. Flat vector illustration. Transparent background. Thinking pose: one stubby finger raised to chin, eyes glancing upward to the side with a curious squint, small smile. No text. No background.
```

---

**`axo-flex.png`** — Plan complete / results screen
```
Same cute chibi axolotl — pink body, feathery gills. Flat vector illustration. Transparent background. Victory / celebration pose: both stubby arms flexed up, eyes squeezed shut with the biggest smile, small sparkles and star shapes floating around it. Very energetic and happy. No text. No background.
```

---

**`axo-eat.png`** — Meals / food pages
```
Same cute chibi axolotl — pink body, feathery gills. Flat vector illustration. Transparent background. Holding a small round bowl of food in both hands, looking at it with wide excited eyes and a huge grin, tiny cute drool drop at corner of mouth. No text. No background.
```

---

### App Icon — 2 Sizes

**`icon-192.png`** (192×192 px) and **`icon-512.png`** (512×512 px):
```
Mobile app icon. Square with Apple squircle rounded corners (22.5% radius). Solid lime green background (#d4f53c). Centred: the cute pink chibi axolotl holding a small dumbbell in one hand and a fork in the other, grinning. Flat vector illustration. No text. Bold and readable at very small sizes.
```

---

## Section 9 — PWA Config

### manifest.json
```json
{
  "name": "NutriPal",
  "short_name": "NutriPal",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
  ]
}
```

### Service Worker
- Pre-cache all files on install
- Cache-first for CSS, JS, images
- Network-first with cache fallback for HTML
- Full offline support after first load

---

## Section 10 — Manual Steps to Test & Deploy

### Test Locally (Mac)
1. Put all files in one folder
2. Terminal → `cd` into that folder → `python3 -m http.server 8080`
3. Safari → `http://localhost:8080`
4. iPhone (same WiFi): Safari → `http://YOUR_MAC_IP:8080`
5. Share → Add to Home Screen → opens full-screen like an app

### Deploy Free (2 minutes)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the project folder onto the page
3. Get a live HTTPS link (required for PWA service worker on iOS)
4. Share that link — any phone can install it

---

## Section 11 — Instructions for the Build Agent

When you implement this plan:

1. **Implement all files** in the structure shown in the File Structure section
2. **Language first**: implement `i18n.js` with all three languages before building any UI. Every visible string must use `t('key')`
3. **Diet type drives everything**: the meal plan, grocery list, and prep guide must all branch on `userProfile.dietType`
4. **Duration drives phases**: phase count and length must be computed from `userProfile.durationWeeks` (4 / 8 / 12 / 16 / 24 / 52)
5. **Weekday meals**: Meals page must have a 7-day picker (Mon–Sun) — not just Workout/Rest tabs — each showing the unique rotation for that day
6. **Design system**: use the tokens in Section 6 exactly. iOS 26 Liquid Glass. Squircle radii. No flat corporate look.
7. **Axo images**: if `assets/axo/*.png` files are missing, render inline SVG placeholders (pink oval body, simple eyes) so the app still looks good
8. **LocalStorage contract**:
   ```js
   // Keys stored by onboarding:
   localStorage.setItem('np_lang', 'en'|'hi'|'gu');
   localStorage.setItem('np_profile', JSON.stringify({
     name, goal, durationWeeks, weight_kg, height_cm, age, sex,
     activityLevel, trainingDays, dietType, foodPrefs[], supplements[], city
   }));
   localStorage.setItem('np_plan', JSON.stringify(generatedPlan));
   // If np_profile is missing on app.html, redirect to index.html
   ```
9. **Test the full round trip**: fill onboarding → confirm `localStorage` has correct keys → confirm app.html shows correct name, correct meals for diet type, correct number of phases for duration, all in chosen language
10. **Commit, push, open PR**

---

*Plan v2 — updated May 2026 with language support, Indian meal plans, flexible duration, full diet type system.*
