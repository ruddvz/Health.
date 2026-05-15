# Health App — Comprehensive Build Plan

> Version 4.0 — Complete pivot to intake → Claude prompt → JSON upload architecture.
> Written May 2026. This supersedes all previous PLAN.md, PLAN_V3.md, and UI_REDESIGN_PLAN.md files.

---

## 0. The Big Picture

The existing repo has a functional multi-file app (onboarding, plan generation, i18n, service worker) but it has two critical JavaScript bugs that prevent it from loading at all, plus a design system that doesn’t match the target vision.

**The new direction is fundamentally different in one key way:**

> The app does NOT generate the plan itself. Claude generates the plan. The app is the beautiful interface that collects user data, builds the perfect Claude prompt, and then renders the plan Claude gives back.

This shift means:

- The plan is infinitely more personalised (Claude reasons about the person’s specific inputs)
- The plan is far more detailed than any local JS generator could produce
- The app stays simple and focused on UI, not health logic
- Users get budget options AND premium options for every recommendation, because Claude can provide both

**The flow in one sentence:** Fill form → copy pre-built prompt → paste into Claude → download JSON → upload JSON → beautiful personalised app.

---

## 1. Repository State Today

### What exists and works

| File/Folder               | Status                                                | Keep?                              |
| ------------------------- | ----------------------------------------------------- | ---------------------------------- |
| `.nojekyll`               | Correct                                               | Yes                                |
| `.github/workflows/`      | Pages deploy action works                             | Yes                                |
| `manifest.json`           | Valid PWA manifest                                    | Update                             |
| `sw.js`                   | Correct strategy, minor bug (crashes on missing PNGs) | Fix                                |
| `css/tokens.css`          | Perfect design tokens                                 | No — replace with Apple tokens     |
| `css/components.css`      | Glass component system                                | No — replace                       |
| `js/i18n.js`              | 3 languages, working                                  | Defer to Phase 2                   |
| `js/store.js`             | localStorage contract, clean                          | Reuse concept                      |
| `js/plangen.js`           | TDEE + macro logic, correct                           | Discard — Claude does this now     |
| `js/onboarding.js`        | 16-step flow, BUG on line 69                          | Replace with new intake form       |
| `js/app.js`               | BUG: never calls render()                             | Replace                            |
| `js/pages/`               | 6 page renderers                                      | Replace with JSON-driven renderers |
| All .md plan files        | Superseded                                            | Delete                             |
| `claude-company-os 2.zip` | Unrelated                                             | Delete                             |
| `screenshots/`            | Old screenshots                                       | Delete                             |
| `scripts/`                | Build scripts                                         | Delete                             |
| `app.html`                | Duplicate of index.html                               | Delete                             |
| `offline.html`            | Keep as PWA offline fallback                          | Keep                               |

### The two critical bugs preventing any load today

1. `onboarding.js` line 69 — syntax error: `${t("lang.gu") ગુજ્લિશ` (missing closing paren). Crashes JS parser, entire app fails to load.
1. `app.js` ends without calling `setupSettings()` or `render()`. Even if onboarding completes, the main app shows a blank screen.

These bugs explain why `ruddvz.github.io/Health/` shows nothing.

---

## 2. Architecture Decision

### Old architecture (discard)

```
index.html (onboarding) → app.html (main app)
js/onboarding.js (16 steps) → js/plangen.js (generates plan locally)
```

### New architecture

```
index.html
  Screen 1: Intake Form (collects all user data)
  Screen 2: Generated Prompt (pre-filled Claude prompt, copy button)
  Screen 3: Health App (renders uploaded JSON plan)
```

Single file. No routing between pages. Three screens shown/hidden with CSS. Zero dependencies. Works on GitHub Pages with no build step.

### Why single file?

- GitHub Pages serves static files. Multi-file apps break when subpages are navigated directly (no server-side routing).
- A single `index.html` always loads correctly regardless of how the user arrives.
- All CSS and JS inline means zero 404 risk from missing asset files.
- The existing repo’s load failure is partly because `app.html` references external JS files that may have path issues.

---

## 3. Screen 1 — Intake Form

### Design philosophy

Looks and feels like an Apple Settings screen or the Calm/Headspace onboarding. Grouped sections with iOS-style inset card rows. White cards on `#F2F2F7` grouped background. Subtle separators. No dark mode for now — the original app’s lime-on-dark aesthetic was creative but too far from “polished health app” energy.

### Form sections and fields

#### Section A — About You

| Field                 | Type                 | Options/Notes                                       |
| --------------------- | -------------------- | --------------------------------------------------- |
| First name            | Text input           | Placeholder: “Your name”                            |
| Age                   | Number input         | Min 16, max 80                                      |
| Biological sex        | Segmented control    | Male / Female                                       |
| Current weight        | Number + unit toggle | kg or lbs                                           |
| Height                | Number + unit toggle | cm or ft/in                                         |
| Body fat % (optional) | Number input         | If they know it. Label: “Optional — skip if unsure” |

#### Section B — Your Goal

| Field                    | Type              | Options                                            |
| ------------------------ | ----------------- | -------------------------------------------------- |
| Primary goal             | Large tap cards   | Fat Loss / Muscle Gain / Body Recomp / Maintenance |
| Timeline                 | Segmented control | 8 Weeks / 12 Weeks / 16 Weeks / 20 Weeks           |
| Target weight (optional) | Number input      | What they want to reach                            |
| How urgent               | Segmented control | Sustainable (slow) / Balanced / Aggressive         |

#### Section C — Training

| Field                   | Type          | Options                                                         |
| ----------------------- | ------------- | --------------------------------------------------------------- |
| Training days per week  | Stepper (1–7) |                                                                 |
| Training location       | Tap cards     | Full gym / Home with equipment / Home bodyweight only           |
| Current fitness level   | Tap cards     | Beginner / Intermediate / Advanced                              |
| Injuries or limitations | Text area     | Placeholder: “E.g. bad knees, lower back pain — or leave blank” |

#### Section D — Diet

| Field                          | Type               | Options                                                     |
| ------------------------------ | ------------------ | ----------------------------------------------------------- |
| Dietary preference             | Tap cards          | Omnivore / Vegetarian / Vegan / Halal / Pescatarian         |
| Foods you dislike or can’t eat | Text area          | Placeholder: “E.g. I hate fish, no dairy, allergic to nuts” |
| Meals per day preference       | Segmented          | 3 meals / 4 meals / 5 meals / 6 meals                       |
| Cooking time available         | Segmented          | Under 20 min / 30–45 min / I enjoy cooking                  |
| Do you meal prep?              | Toggle             | Yes / No                                                    |
| Cooking equipment              | Multi-select chips | Instant Pot, Air Fryer, Stovetop, Oven, Microwave, BBQ      |

#### Section E — Supplements

| Field                         | Type               | Notes                                                                                                                                   |
| ----------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Supplements you already have  | Multi-select chips | Creatine, Whey Protein, Pre-Workout, Omega-3, Multivitamin, Vitamin D, Magnesium, Ashwagandha, ZMA, BCAAs, Casein, Caffeine Pills, None |
| Supplement budget             | Tap cards          | I have what I need / Budget ($20–40/mo) / Mid-range ($40–80/mo) / No limit                                                              |
| Other supplements (free text) | Text area          | Optional                                                                                                                                |

#### Section F — Location & Lifestyle

| Field                      | Type               | Notes                                                                                                  |
| -------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| Country                    | Dropdown           | Pre-filled list. Affects grocery store tips, supplement brand recommendations, currency.               |
| City/Region (optional)     | Text input         | For hyper-local grocery tips                                                                           |
| Daily activity outside gym | Tap cards          | Desk job (sedentary) / Light movement / Active job / Very active job                                   |
| Sleep hours per night      | Stepper (4–10)     |                                                                                                        |
| Stress level               | Segmented          | Low / Moderate / High / Very high                                                                      |
| Biggest challenge          | Multi-select chips | Staying consistent / Meal prep time / Cravings / Low energy / Plateauing / Motivation / Cooking skills |

### Form UX rules

- Every section has a header with a system SF symbol (inline SVG) and section title
- Required fields have no asterisk — they’re just all required except the “(optional)” labeled ones
- Validation fires on the Generate Prompt button tap, not inline (less annoying)
- If a required field is empty, smooth scroll to it and show inline error below the field
- The Generate Prompt button is sticky at the bottom of the screen, always visible
- Button is disabled (greyed) until minimum required fields are filled (name, age, sex, weight, height, goal)
- All selections are stored in `sessionStorage` so a page refresh doesn’t wipe progress
- A progress indicator at the top shows how many sections are complete (6 dots, filled as user progresses)

---

## 4. Screen 2 — Generated Prompt

### What happens when user taps “Generate My Plan”

1. All form data is assembled into a JSON object
1. That JSON is inserted into the master prompt template (see Section 6)
1. Screen 1 slides out, Screen 2 slides in
1. The fully assembled prompt is shown in a read-only text area
1. A large “Copy Prompt” button copies to clipboard
1. Below the prompt: step-by-step instructions with illustrations

### Instruction steps shown on Screen 2

```
Step 1  Open claude.ai in your browser (or the Claude app)
Step 2  Paste the prompt into a new conversation
Step 3  Hit send and wait — Claude will think for about 30 seconds
Step 4  Claude will reply with a JSON code block
Step 5  Copy everything inside the code block (starting with { )
Step 6  Paste it into a plain text editor and save as myplan.json
Step 7  Come back here and tap "Upload My Plan" below
```

### UI elements on Screen 2

- Back arrow (top left) to go back and edit the form
- The prompt box: scrollable, monospace font, read-only, with a subtle border
- “Copy Prompt” button — large, blue, primary CTA. Shows “Copied!” checkmark for 2 seconds after tap
- “Open Claude” button — secondary, opens `https://claude.ai` in a new tab
- Divider: “When you have your JSON ready:”
- “Upload My Plan” button — dashed border, secondary. Opens file picker filtered to `.json`
- File upload handler reads the JSON, validates the schema (checks for required top-level keys), then transitions to Screen 3

### Error handling for JSON upload

If the uploaded file is missing required keys, show an error card:

```
This JSON doesn't look right. Make sure you copied the entire response from
Claude including the opening { and closing }. Try again.
```

If valid, smooth transition to Screen 3.

---

## 5. Screen 3 — The Health App

### Navigation

Bottom tab bar, 6 tabs. iOS-style frosted glass bar. Tabs:

- Home (house icon)
- Phases (bar chart icon)
- Meals (fork and knife icon)
- Prep (clock icon)
- Grocery (basket icon)
- Supps (pill capsule icon)

All icons are inline SVG. No emoji. No external icon libraries.

Active tab: blue `#007AFF`. Inactive: `rgba(60,60,67,0.4)`.

### Tab: Home

Hero section:

- Greeting: “Good morning, [Name]” — large, 32px, weight 800, letter-spacing -0.03em
- Subline: “Week 1 of [N] · [Goal label]” in secondary label colour
- Photo reminder card (Week 1 only): lime green accent card — “Take your Week 1 progress photo today. Front, back, side. Same lighting.”

Stats row — 3 cards:

- Start weight
- Duration (weeks)
- Daily protein target (g)

Today’s schedule card:

- Lists every supplement and meal timing for today
- Workout day vs rest day auto-detected based on the user’s training days and what day of the week it is (from `new Date()`)

Quick navigation cards (2x2 grid + 1 full-width):

- Phases, Meals, Prep, Grocery, Supps

Motivation card at the bottom — pulled from `plan.tips` array in the JSON, rotates daily.

Water reminder banner: “3L of water today” — always visible on home.

### Tab: Phases

4 phase cards (or however many phases Claude generated based on their timeline). Each card:

- Phase number + name
- Week range badge
- Large calorie number in accent green: `2,000 kcal` at 36px weight 800
- Macro row: 3 chips — P 170g / C 180g / F 55g — each chip coloured (teal/lime/orange)
- Description paragraph (from JSON)
- Flavour rotation for this phase (what spices/marinades to use)

Flavour rotation box at the bottom — full 8-rotation schedule in a scrollable card.

### Tab: Meals

Day type toggle at top: “Workout Day” / “Rest Day” — segmented control.

Each meal card shows:

- Time badge (7:00 AM)
- Meal name
- Calorie badge (right-aligned, green)
- Description
- Ingredient list with category colour dots:
  - Protein source: teal dot
  - Carbs: lime dot
  - Vegetables: orange dot
  - Fats: yellow dot
  - Dairy: white/dim dot
- Tags (prep method, time)

Total calorie summary card at the bottom of each day.

Phase selector — pill tabs to see meals for each phase (since macros change, meal sizes change).

### Tab: Prep

Header: “Sunday Batch Cook” with estimated total time badge.

Each prep step is a checkable card:

- Large numbered badge (lime, 40x40px)
- Step name (bold)
- Detailed instructions
- Time estimate badge (teal)
- Tap to check off — strikethrough + dim
- Checked state persists in `localStorage` under key `health_prep_done`

“Wednesday top-up” section below the main steps — shorter set of steps for the mid-week restock.

“Clear all” button at bottom.

### Tab: Grocery

Category tabs: Protein / Carbs / Veg / Fats / Pantry

Each category shows a list of items. Each item:

- Checkbox (tap to check off)
- Item name
- Quantity
- Checked items are dimmed and struck through
- Checked state persists in `localStorage` under key `health_grocery_checked`

Store tip card at the bottom — pulled from the JSON, country-specific.

“Clear all checks” button.

Budget vs Premium toggle at the top — shows budget ingredient alternatives when toggled. This is sourced from `grocery.budget_swaps` in the JSON.

### Tab: Supps

Daily schedule card at top — 4 time slots (Morning / Pre-gym / Post-gym / Before bed) with what to take at each time.

Supplement detail cards — one per supplement. Each card:

- Coloured dot (each supp gets a colour)
- Name + “Have it” or “Need to buy” badge
- Why you take it — plain English explanation
- Dose
- Timing chips

Protein powder section — 3 options generated by Claude:

- Best overall pick (with price)
- Budget pick (with price)
- Premium/alternative pick (with price)
  Each has a rank badge and explanation paragraph.

“Don’t need” section — what NOT to buy and why. Important for saving money.

---

## 6. The Claude Prompt Template

This is the most critical piece of the entire system. The prompt must be precise enough that Claude always returns valid JSON in the exact schema the app expects, and detailed enough that the plan is genuinely excellent.

### Template structure

```
You are a certified sports nutritionist, personal trainer, and meal planning expert.
Your job is to create a complete, highly personalised health and fitness plan for a real person.

Read the person's profile carefully. Every recommendation must be specific to their data —
not generic advice. Account for their dietary restrictions, cooking equipment, location,
supplement budget, and schedule.

=== PERSON'S PROFILE ===
{FORM_DATA_JSON}

=== YOUR TASK ===

Generate a complete personalised plan and return it as a single JSON object.
The JSON must exactly match the schema below. Do not include any text before or after the JSON.
Do not use markdown formatting. Return only the raw JSON object starting with { and ending with }.

Important instructions:
- All calorie and macro calculations must be based on the person's actual TDEE
  (use Mifflin-St Jeor formula adjusted for their activity level)
- All meals must respect their dietary preference and avoid any listed dislikes
- Grocery lists must use items available in their country
- Supplement recommendations must fit within their stated budget
- Protein powder section must list 3 real products available in their country
  (Best / Budget / Premium) with real approximate prices in their local currency
- Grocery store tips must be specific to their city/country if provided
- Every meal must have real specific ingredients with gram amounts — not vague descriptions
- Flavour rotations must be actual spice combinations, not just labels
- The tips array must have at least 10 genuinely useful, specific tips
  (not generic fitness clichés)
- Phase descriptions must be motivational and honest — mention what they will
  actually feel and experience during that phase

=== JSON SCHEMA ===

{
  "meta": {
    "version": "1.0",
    "generated_for": "string — person's first name",
    "generated_date": "string — today's date YYYY-MM-DD",
    "goal_label": "string — e.g. Body Recomposition"
  },
  "user": {
    "name": "string",
    "age": number,
    "sex": "male" | "female",
    "weight_kg": number,
    "height_cm": number,
    "body_fat_pct": number | null,
    "goal": "fat_loss" | "muscle_gain" | "recomp" | "maintenance",
    "timeline_weeks": number,
    "target_weight_kg": number | null,
    "urgency": "sustainable" | "balanced" | "aggressive",
    "tdee": number,
    "bmr": number
  },
  "phases": [
    {
      "id": number,
      "name": "string",
      "weeks": "string — e.g. 1–4",
      "week_start": number,
      "week_end": number,
      "kcal_daily": number,
      "kcal_workout_day": number,
      "kcal_rest_day": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "description": "string — 3–4 sentences. What happens this phase, what to expect physically, what the key focus is.",
      "key_focus": "string — one sentence",
      "flavour_rotation": "string — specific spices and marinades for this phase",
      "training_note": "string — what to focus on in the gym this phase"
    }
  ],
  "meal_plan": {
    "meals_per_day": number,
    "workout_day": [
      {
        "slot": number,
        "time": "string — e.g. 7:00 AM",
        "name": "string",
        "kcal": number,
        "description": "string — 2–3 sentences of clear cooking instructions",
        "ingredients": [
          {
            "name": "string",
            "grams": number,
            "category": "protein" | "carbs" | "veg" | "fat" | "dairy" | "pantry"
          }
        ],
        "prep_method": "string — e.g. Instant Pot / Pan / No cook / Microwave",
        "prep_minutes": number,
        "tags": ["string"]
      }
    ],
    "rest_day": [
      {
        "slot": number,
        "time": "string",
        "name": "string",
        "kcal": number,
        "description": "string",
        "ingredients": [
          {
            "name": "string",
            "grams": number,
            "category": "protein" | "carbs" | "veg" | "fat" | "dairy" | "pantry"
          }
        ],
        "prep_method": "string",
        "prep_minutes": number,
        "tags": ["string"]
      }
    ],
    "daily_totals": {
      "workout_day_kcal": number,
      "rest_day_kcal": number,
      "workout_day_protein_g": number,
      "rest_day_protein_g": number
    }
  },
  "prep_guide": {
    "total_minutes": number,
    "sunday_steps": [
      {
        "step": number,
        "name": "string",
        "detail": "string — full step-by-step instructions, specific amounts, temperatures, times",
        "time_minutes": number,
        "equipment": "string — e.g. Instant Pot / 12-inch pan"
      }
    ],
    "wednesday_topup": [
      {
        "step": number,
        "name": "string",
        "detail": "string",
        "time_minutes": number
      }
    ],
    "tips": ["string — at least 5 meal prep tips specific to their setup"]
  },
  "grocery": {
    "protein": [
      { "name": "string", "qty": "string", "notes": "string | null" }
    ],
    "carbs": [
      { "name": "string", "qty": "string", "notes": "string | null" }
    ],
    "veg": [
      { "name": "string", "qty": "string", "notes": "string | null" }
    ],
    "fat": [
      { "name": "string", "qty": "string", "notes": "string | null" }
    ],
    "pantry": [
      { "name": "string", "qty": "string", "notes": "string | null" }
    ],
    "budget_swaps": [
      {
        "original": "string — the standard item",
        "swap": "string — cheaper alternative",
        "saving": "string — e.g. saves ~$8/week",
        "trade_off": "string — what you give up"
      }
    ],
    "store_tip": "string — specific store recommendation for their city/country with actual store names and what to buy where"
  },
  "supplements": {
    "daily_schedule": [
      {
        "time_slot": "morning" | "pre_gym" | "post_gym" | "bedtime" | "with_meal",
        "label": "string — e.g. Morning",
        "items": "string — what to take",
        "note": "string — why and how"
      }
    ],
    "stack": [
      {
        "name": "string",
        "status": "have" | "buy" | "optional" | "skip",
        "dose": "string — e.g. 5g",
        "timing": "string",
        "frequency": "daily" | "workout_days_only" | "as_needed",
        "why": "string — 3–4 sentences. Specific mechanism, realistic benefit for this person.",
        "brand_recommendation": "string | null — specific brand available in their country",
        "colour": "string — hex colour for the UI dot e.g. #34C759"
      }
    ],
    "protein_powder": [
      {
        "rank": "best" | "budget" | "premium",
        "rank_label": "string — e.g. Best Overall",
        "name": "string — full product name",
        "price_local": "string — e.g. CAD $129 / 5lb",
        "protein_per_scoop_g": number,
        "available_at": "string — where to buy in their location",
        "why": "string — 2–3 sentences"
      }
    ],
    "skip_list": [
      {
        "name": "string — supplement to avoid",
        "reason": "string — why it's a waste of money for this person"
      }
    ]
  },
  "flavour_rotations": [
    {
      "phase": number,
      "weeks": "string",
      "name": "string — e.g. Garlic Lemon Paprika",
      "recipe": "string — exact spice amounts and method e.g. 2 tsp paprika, 1 tsp garlic powder, juice of 1 lemon, pinch of cayenne"
    }
  ],
  "water_target_litres": number,
  "tips": [
    "string — at least 10 specific, actionable tips for this exact person. Not generic. Reference their specific goal, schedule, and situation."
  ],
  "weekly_check_in": {
    "what_to_track": ["string"],
    "expected_progress_week4": "string",
    "expected_progress_week8": "string",
    "expected_progress_week16": "string",
    "red_flags": ["string — signs something is wrong and they should adjust"]
  }
}
```

### How the form data is inserted

When the user taps “Generate My Plan,” the app runs this function:

```javascript
function buildPrompt(formData) {
	const profileJSON = JSON.stringify(
		{
			name: formData.name,
			age: formData.age,
			sex: formData.sex,
			weight: formData.weight + ' ' + formData.weightUnit,
			height: formData.height + ' ' + formData.heightUnit,
			body_fat_pct: formData.bodyFat || 'not provided',
			goal: formData.goal,
			timeline: formData.timeline + ' weeks',
			target_weight: formData.targetWeight || 'not specified',
			urgency: formData.urgency,
			training_days_per_week: formData.trainingDays,
			training_location: formData.trainingLocation,
			fitness_level: formData.fitnessLevel,
			injuries: formData.injuries || 'none',
			dietary_preference: formData.dietaryPreference,
			food_dislikes: formData.foodDislikes || 'none',
			meals_per_day: formData.mealsPerDay,
			cooking_time: formData.cookingTime,
			meal_prep: formData.mealPrep,
			cooking_equipment: formData.equipment,
			supplements_owned: formData.supplementsOwned,
			supplement_budget: formData.supplementBudget,
			other_supplements: formData.otherSupplements || 'none',
			country: formData.country,
			city: formData.city || 'not provided',
			activity_outside_gym: formData.activityLevel,
			sleep_hours: formData.sleepHours,
			stress_level: formData.stressLevel,
			biggest_challenges: formData.challenges
		},
		null,
		2
	);

	return PROMPT_TEMPLATE.replace('{FORM_DATA_JSON}', profileJSON);
}
```

The user never sees this assembly happen. They just tap Generate and see the complete, ready-to-paste prompt.

---

## 7. Design System — Apple HIG

### Colours

```css
:root {
	/* Backgrounds */
	--bg: #f2f2f7; /* iOS grouped table background */
	--bg2: #e5e5ea; /* Deeper background for contrast */
	--card: #ffffff; /* Card/cell surface */
	--card-pressed: #f9f9f9; /* Active/pressed state */

	/* Labels */
	--lbl1: #000000; /* Primary */
	--lbl2: rgba(60, 60, 67, 0.6); /* Secondary */
	--lbl3: rgba(60, 60, 67, 0.3); /* Tertiary */
	--lbl4: rgba(60, 60, 67, 0.18); /* Quaternary / separators */

	/* System colours */
	--blue: #007aff; /* Interactive, links, CTA */
	--green: #34c759; /* Success, goals, positive */
	--orange: #ff9500; /* Warnings, carbs */
	--red: #ff3b30; /* Errors, destructive */
	--purple: #af52de; /* Premium, special */
	--teal: #5ac8fa; /* Info, protein */
	--yellow: #ffcc00; /* Fat, optional */
	--indigo: #5856d6; /* Phases */

	/* Tinted backgrounds */
	--blue-bg: rgba(0, 122, 255, 0.1);
	--green-bg: rgba(52, 199, 89, 0.1);
	--orange-bg: rgba(255, 149, 0, 0.1);
	--red-bg: rgba(255, 59, 48, 0.1);
	--teal-bg: rgba(90, 200, 250, 0.1);
	--yellow-bg: rgba(255, 204, 0, 0.1);
	--indigo-bg: rgba(88, 86, 214, 0.1);

	/* Separators */
	--sep: rgba(60, 60, 67, 0.18);
	--sep2: rgba(60, 60, 67, 0.08);

	/* Radii */
	--r-card: 16px;
	--r-inner: 10px;
	--r-sm: 8px;
	--r-chip: 20px;

	/* Shadows */
	--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
	--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
	--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);

	/* Typography */
	--ff: -apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
	--mono: 'SF Mono', ui-monospace, 'Fira Code', monospace;
}
```

### Typography scale

| Style       | Size    | Weight  | Usage                 |
| ----------- | ------- | ------- | --------------------- |
| Large Title | 34px    | 700     | Screen heroes         |
| Title 1     | 28px    | 700     | Page titles           |
| Title 2     | 22px    | 700     | Section headers       |
| Title 3     | 20px    | 600     | Card titles           |
| Headline    | 17px    | 600     | Row labels            |
| Body        | 17px    | 400     | Default text          |
| Callout     | 16px    | 400     | Secondary content     |
| Subhead     | 15px    | 400     | Metadata              |
| Footnote    | 13px    | 400     | Captions, tips        |
| Caption     | 12px    | 400     | Smallest text         |
| Mono        | 13–15px | 400–600 | Times, values, badges |

### Spacing scale (4pt grid)

```
4px   — Micro gaps between inline elements
8px   — Between related elements
12px  — Inner card padding (compact)
16px  — Standard padding / row height padding
20px  — Section padding horizontal
24px  — Between sections
32px  — Major vertical spacing
48px  — Page-level breathing room
```

### Component patterns

**Grouped list section (iOS Settings style)**

```
Section header (12px, lbl2, uppercase, padded 20px left)
┌─────────────────────────────────────────────┐
│ Row item                           Detail  › │  ← 44px min height, 16px padding
├─────────────────────────────────────────────┤
│ Row item                           Detail  › │
└─────────────────────────────────────────────┘
Section footer (12px, lbl2, normal case, padded 20px sides)
```

**Segmented control**

- Background: `rgba(118,118,128,0.12)` (iOS standard)
- Selected: white background, `box-shadow: 0 1px 3px rgba(0,0,0,0.12)`
- 8px internal padding, border-radius matches container

**Selection card (large tap target)**

- 16px padding
- `border: 2px solid var(--sep)`
- Selected: `border-color: var(--blue)`, `background: var(--blue-bg)`
- Checkmark appears top-right when selected
- Scales `0.98` on press

**Primary button**

- Full width
- 56px height
- `background: var(--blue)`
- `border-radius: 14px`
- 17px semibold white text
- Active: `opacity: 0.75` + `scale(0.98)`

**Bottom tab bar**

- `background: rgba(255,255,255,0.85)`
- `backdrop-filter: blur(20px) saturate(180%)`
- `border-top: 0.5px solid rgba(0,0,0,0.15)`
- `padding-bottom: env(safe-area-inset-bottom)`
- Tab icon 24×24px SVG
- Tab label 10px, letter-spacing 0.2px
- Active: `--blue`
- Inactive: `rgba(60,60,67,0.4)`

---

## 8. JSON Schema Validation

When the user uploads their `.json` file, the app validates before rendering:

```javascript
function validatePlan(json) {
	const required = [
		'meta',
		'user',
		'phases',
		'meal_plan',
		'prep_guide',
		'grocery',
		'supplements',
		'tips'
	];
	const missing = required.filter((k) => !json[k]);
	if (missing.length > 0) {
		return { valid: false, error: `Missing sections: ${missing.join(', ')}` };
	}
	if (!Array.isArray(json.phases) || json.phases.length === 0) {
		return { valid: false, error: 'Phases array is empty or missing' };
	}
	if (!json.meal_plan.workout_day || !json.meal_plan.rest_day) {
		return { valid: false, error: 'Meal plan must have workout_day and rest_day' };
	}
	return { valid: true };
}
```

On validation failure: show a friendly error card with the specific problem and a “Try again” button that re-opens the file picker.

---

## 9. Local Storage Keys

| Key                      | Type        | Contents                                                          |
| ------------------------ | ----------- | ----------------------------------------------------------------- |
| `health_plan`            | JSON string | The complete uploaded plan JSON                                   |
| `health_form`            | JSON string | Saved form data (so user can come back and re-generate)           |
| `health_grocery_checked` | JSON string | Set of checked grocery item keys                                  |
| `health_prep_done`       | JSON string | Set of checked prep step keys                                     |
| `health_active_screen`   | string      | `form` / `prompt` / `app` — which screen to show on load          |
| `health_active_tab`      | string      | Last active tab in the app (home/phases/meals/prep/grocery/supps) |

---

## 10. PWA Configuration

### manifest.json (updated)

```json
{
	"name": "Health — Personalised Plan",
	"short_name": "Health",
	"description": "Your personalised nutrition and fitness plan",
	"start_url": "/Health/",
	"display": "standalone",
	"background_color": "#F2F2F7",
	"theme_color": "#F2F2F7",
	"orientation": "portrait",
	"icons": [
		{
			"src": "assets/icon-192.png",
			"sizes": "192x192",
			"type": "image/png",
			"purpose": "any maskable"
		},
		{
			"src": "assets/icon-512.png",
			"sizes": "512x512",
			"type": "image/png",
			"purpose": "any maskable"
		}
	]
}
```

Note: The icon PNGs must exist or the SW install fails. Create simple 192×192 and 512×512 green square PNGs with a white heart or leaf icon. Can be generated via Canvas in a build script, or uploaded manually.

### sw.js (fixed)

The critical fix from the existing code — wrap `addAll` in `Promise.allSettled` so missing assets don’t crash the install:

```javascript
const CACHE = 'health-v4';
const ASSETS = [
	'/Health/',
	'/Health/index.html',
	'/Health/manifest.json',
	'/Health/assets/icon-192.png',
	'/Health/assets/icon-512.png'
];

self.addEventListener('install', (e) => {
	e.waitUntil(
		caches
			.open(CACHE)
			.then((c) => Promise.allSettled(ASSETS.map((url) => c.add(url).catch(() => {}))))
	);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
	);
});
```

---

## 11. File Structure After Rebuild

```
/Health (repo root)
├── index.html              ← Entire app. All CSS + JS inline.
├── manifest.json           ← PWA manifest (updated)
├── sw.js                   ← Service worker (fixed)
├── offline.html            ← Offline fallback
├── .nojekyll               ← Prevents Jekyll processing
├── .github/
│   └── workflows/
│       └── deploy.yml      ← GitHub Pages deploy (keep as-is)
├── assets/
│   ├── icon-192.png        ← PWA icon (must exist)
│   └── icon-512.png        ← PWA icon (must exist)
└── README.md               ← Updated
```

Everything else is deleted:

- `app.html` (replaced by inline in `index.html`)
- `css/` folder (all CSS is inline in `index.html`)
- `js/` folder (all JS is inline in `index.html`)
- `icons/` folder
- `screenshots/` folder
- `scripts/` folder
- `*.md` plan files (this file is the plan)
- `claude-company-os 2.zip` (unrelated)

---

## 12. Build Order — PR by PR

### PR-1 — Clean the repo

**Branch:** `fix/clean-repo`

Actions:

- Delete: `app.html`, `css/`, `js/`, `icons/`, `screenshots/`, `scripts/`, `PLAN.md`, `PLAN_V3.md`, `FEATURE_PLAN.md`, `UI_REDESIGN_PLAN.md`, `PROMPTS.md`, `Plan0.md`, `claude-company-os 2.zip`
- Create: `assets/` folder with placeholder `icon-192.png` and `icon-512.png`
- Update: `manifest.json` with new config above
- Replace: `sw.js` with the fixed version above
- Replace: `README.md` with a clean description

Result: Clean repo. No orphaned files. GitHub Pages will serve `index.html` which doesn’t exist yet — it will 404, which is fine until PR-2.

---

### PR-2 — Core index.html: Design system + Screen 1 (Intake Form)

**Branch:** `feat/screen1-intake-form`

Build the complete `index.html` with:

- All CSS design tokens (Section 7)
- Screen system (3 screens, CSS show/hide)
- Bottom tab system (for Screen 3)
- Screen 1: Full intake form (all 6 sections, Section 3)
- Form state persistence to `sessionStorage`
- Form validation on submit
- Progress indicator (6 dots)
- “Generate My Plan” button (disabled until minimum fields filled)

Do NOT implement Screen 2 or 3 yet. Button can `console.log(buildPrompt(formData))` as a placeholder.

Test checklist:

- [ ] Site loads at `ruddvz.github.io/Health/` with no console errors
- [ ] All form sections render correctly on iPhone 14 screen
- [ ] Segmented controls work (tap to select, correct visual)
- [ ] Selection cards work (tap to select, correct visual + checkmark)
- [ ] Stepper buttons work (+ / -)
- [ ] Multi-select chips work (toggle on/off)
- [ ] Progress dots update as sections are filled
- [ ] Form state persists on page refresh (sessionStorage)
- [ ] Validation fires on empty required fields (scrolls to first error)
- [ ] Country dropdown works

---

### PR-3 — Screen 2: Prompt Generator

**Branch:** `feat/screen2-prompt`

Add to `index.html`:

- `buildPrompt(formData)` function with the full template (Section 6)
- Screen 2 HTML structure (Section 4)
- Screen transition animation: Screen 1 slides left, Screen 2 slides in from right
- “Copy Prompt” button with 2-second “Copied ✓” feedback
- “Open Claude” button
- Step-by-step instructions
- “Upload My Plan” button — file input (`.json` only)
- JSON file reader and validator (Section 8)
- On valid JSON: save to `localStorage` under `health_plan`, transition to Screen 3
- On invalid JSON: show error card

Test checklist:

- [ ] Tap “Generate My Plan” on Screen 1 — transitions to Screen 2
- [ ] Back arrow returns to Screen 1 with form data intact
- [ ] Prompt text area shows fully assembled prompt with real user data inserted
- [ ] “Copy Prompt” copies to clipboard and shows confirmation
- [ ] “Open Claude” opens claude.ai in new tab
- [ ] Upload a valid `.json` file — transitions to Screen 3
- [ ] Upload a malformed `.json` file — shows error card
- [ ] Upload a JSON missing required keys — shows error with specific keys named

---

### PR-4 — Screen 3: Tab Bar + Home Tab

**Branch:** `feat/screen3-home`

Add to `index.html`:

- Bottom tab bar HTML + CSS (frosted glass, 6 tabs, SVG icons)
- Tab switching JavaScript
- Tab state persistence to `localStorage`
- Home tab renderer (pulls from `window.healthPlan`)
- Greeting with time-of-day awareness (`new Date().getHours()`)
- Workout day / rest day detection
- Stats row
- Today’s schedule
- Quick nav cards
- Motivational tip (rotates daily)
- Water reminder
- Photo reminder (week 1 logic)
- “Change plan / Re-upload” option in a subtle top-right menu (⋯ button) for when user wants to upload a new JSON

Test checklist:

- [ ] After JSON upload, Screen 3 shows immediately
- [ ] Greeting says correct time of day (“Good morning” vs “Good evening”)
- [ ] User’s name appears in greeting
- [ ] Today’s schedule shows correct meals for workout vs rest day
- [ ] Stats row shows correct weight, duration, protein from the JSON
- [ ] Quick nav cards navigate to correct tabs
- [ ] Tip rotates (check by changing system date)
- [ ] On reload, app goes straight to Screen 3 (loads plan from localStorage)
- [ ] ⋯ menu has “Re-upload plan” that goes back to Screen 2

---

### PR-5 — Screen 3: Phases + Meals Tabs

**Branch:** `feat/tabs-phases-meals`

Add:

- Phases tab renderer
- Phase cards with large calorie number, macro row chips, description, flavour rotation
- Meals tab renderer
- Workout/rest day toggle (segmented control)
- Meal cards with time badge, calorie badge, ingredient list with category colour dots
- Phase selector (pill tabs) to see how meals change per phase
- Daily calorie summary at bottom

Test checklist:

- [ ] All phases render with correct data from JSON
- [ ] Calorie number is large and in green
- [ ] Macro chips show P/C/F with correct values and colours
- [ ] Meals tab shows correct meals from JSON
- [ ] Toggle between Workout Day and Rest Day works
- [ ] Ingredient category dots show correct colours (teal=protein, lime=carbs, orange=veg)
- [ ] Phase selector changes the meals shown

---

### PR-6 — Screen 3: Prep + Grocery Tabs

**Branch:** `feat/tabs-prep-grocery`

Add:

- Prep tab renderer
- Sunday steps as checkable cards
- Wednesday top-up section
- Check-off state with localStorage persistence
- “Clear all” button
- Grocery tab renderer
- Category tabs (Protein / Carbs / Veg / Fat / Pantry)
- Check-off items with localStorage persistence
- Budget swaps toggle (shows alternative items)
- Store tip card
- “Clear all checks” button

Test checklist:

- [ ] Prep steps render with step number, name, detail, time estimate
- [ ] Tapping prep step checks it off (strikethrough + dim)
- [ ] Checked prep state persists across tab switches and page reload
- [ ] “Clear all” resets all prep steps
- [ ] Grocery categories all have items
- [ ] Tapping grocery item checks it off
- [ ] Checked grocery state persists
- [ ] Budget swaps toggle shows/hides alternative items
- [ ] Store tip appears at bottom

---

### PR-7 — Screen 3: Supplements Tab

**Branch:** `feat/tab-supps`

Add:

- Supps tab renderer
- Daily schedule card (4 time slots)
- Supplement detail cards with coloured dot, status badge, dose, timing, why explanation
- Protein powder comparison (3 cards: Best / Budget / Premium)
- “Skip list” — what NOT to buy section

Test checklist:

- [ ] Daily schedule shows all time slots with correct items
- [ ] Each supplement card shows name, dose, timing, explanation
- [ ] Coloured dot matches the `colour` field in JSON
- [ ] “Have it” / “Need to buy” badge renders correctly
- [ ] 3 protein powder options show with prices
- [ ] Skip list shows with reasons

---

### PR-8 — Polish + Animations + Edge Cases

**Branch:** `feat/polish`

Add:

- Screen transition animations (slide left/right)
- Tab switch animation (fade)
- Card press states (scale 0.98)
- Form field focus states (blue border glow)
- Loading state when reading JSON file
- Empty state screens (if a JSON section is missing data)
- “About this app” footer on Screen 1 — one line: “Your data never leaves your device.”
- PWA install prompt handling (intercept `beforeinstallprompt`)
- Haptic feedback attempt via `navigator.vibrate([10])` on check-off (no-op on unsupported)

Test checklist:

- [ ] Screen transitions feel smooth and directional
- [ ] All interactive elements have visible press feedback
- [ ] Form inputs have focus indicators
- [ ] No content shifts or layout jumps
- [ ] Works as installed PWA on iPhone home screen
- [ ] Status bar colour matches app background

---

## 13. The README (replace current)

```markdown
# Health — Personalised Plan

A mobile web app that turns a personalised Claude-generated health plan into
a beautiful, interactive guide.

## How it works

1. Fill in your details in the intake form
2. The app generates a pre-built prompt tailored to you
3. Paste the prompt into Claude at claude.ai
4. Upload the JSON plan Claude gives you
5. Your personalised plan — meals, macros, phases, grocery list, supplements —
   renders as a native-feeling mobile app

## Features

- 6-section intake form covering nutrition, training, lifestyle, and supplements
- Pre-filled Claude prompt — zero editing required, just copy and paste
- JSON-driven rendering — every piece of content comes from Claude's analysis
- Grocery checklist with persistent check-off state
- Meal prep guide with checkable steps
- Supplement stack with timing schedule
- Budget vs premium options for protein powder and grocery items
- Works offline after first load (PWA)

## Tech

Single `index.html` file. No framework. No build step. No backend.  
All data stays on your device — nothing is sent anywhere.

Hosted on GitHub Pages: https://ruddvz.github.io/Health/
```

---

## 14. Future Phases (after the core is shipped)

These are not in scope for the initial build but are worth planning:

### Phase 2 — In-app Claude API call

Instead of copy-paste, the app calls the Anthropic API directly. User fills form, taps “Generate Plan,” app calls `api.anthropic.com/v1/messages` with the prompt, streams the response, parses the JSON, and renders it — all in one flow. No leaving the app. Requires exposing an API key (needs a thin proxy server or Cloudflare Worker to avoid key exposure in client code).

### Phase 3 — Multi-language

Port the existing `i18n.js` structure (which is already solid) into the new app. Three languages: English, Hinglish, Gujlish. The prompt template also gets translated so Claude receives the form data with language context and can generate plans with food suggestions that make sense in each culture.

### Phase 4 — Progress tracking

Weekly weigh-in logger. Simple line chart (weight over 16 weeks). Photo reminder with date stamps. Adherence tracker (checkboxes for each day — did you hit your meals, did you train, did you drink 3L?). Stored entirely in localStorage.

### Phase 5 — Plan regeneration

If the user’s weight changes significantly, or they want to update their goal mid-program, a “Regenerate Plan” flow lets them update just the changed fields and regenerate a new prompt. The app detects what changed and explains why the plan might differ.

---

## 15. What NOT to Change from the Old Repo

Some things in the existing codebase are worth keeping as reference even though we’re rewriting:

- The TDEE calculation in `plangen.js` is mathematically correct (Mifflin-St Jeor formula, correct activity multipliers) — worth cross-referencing to validate that Claude’s output is in the right ballpark
- The i18n structure in `i18n.js` (dot-notation, `t()` function) is clean and worth reusing in Phase 2 when multi-language is added
- The `store.js` localStorage helper pattern is clean — copy the pattern
- The `sw.js` cache strategy (cache-first for assets, network-first for HTML) is correct — just fix the fatal error

---

## 16. Definition of Done

The app is complete and ready to share when:

1. `ruddvz.github.io/Health/` loads in under 2 seconds on an iPhone on LTE
1. Zero JavaScript errors in the console on any screen
1. The intake form collects all required data across 6 sections
1. The generated prompt is correctly assembled with all user data
1. A `.json` file uploaded from Claude renders a complete, beautiful plan
1. All 6 tabs in the app are functional with real data from the JSON
1. Grocery and prep check-offs persist across sessions
1. The app is installable as a PWA from Safari on iPhone
1. The app works offline after the first load
1. The design looks and feels like an Apple Health companion — no lime brutalism, no placeholder grey squares, no hardcoded content

---

_Plan v4.0 — Complete pivot to intake → Claude prompt → JSON upload architecture._  
_Written May 2026. Replaces all previous plan files._
