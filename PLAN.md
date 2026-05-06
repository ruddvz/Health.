# NutriPal PWA — Full Implementation Plan

> **Status**: Plan only. No code written yet.
> **Your job**: Create the mascot images (prompts below). Hand off this plan + images to the build agent.

---

## What We Are Building

A mobile-first **Progressive Web App** (PWA) — no server, no login, works offline, installs to iPhone/Android home screen like a real app.

**How it works:**
1. User opens the link in Safari/Chrome
2. A fun step-by-step mascot-guided quiz collects their stats (name, weight, goal, etc.)
3. The app generates a fully personalised 16-week Cut + Build plan
4. They tap "Add to Home Screen" and it installs as a native-feeling app
5. Everything is stored on their device — no data sent anywhere

**Mascot:** Axo the Axolotl — prehistoric, cute, gender-neutral, universally lovable. Pink/peachy colour, big round eyes, feathery pink gills on the sides of the head, stubby legs, wide smile. Think Duolingo owl energy but cuter and more original.

---

## File Structure (for the build agent)

```
/
├── index.html          ← Onboarding wizard (quiz)
├── app.html            ← Main plan app (all 6 pages)
├── manifest.json       ← PWA install config
├── sw.js               ← Service worker (offline support)
├── css/
│   ├── tokens.css      ← Colours, spacing, radii
│   ├── components.css  ← Shared UI pieces
│   ├── onboarding.css  ← Quiz screen styles
│   └── app.css         ← Main app styles
├── js/
│   ├── store.js        ← localStorage read/write helper
│   ├── onboarding.js   ← Quiz step logic
│   ├── plangen.js      ← Plan generation from user answers
│   ├── app.js          ← Page router + bottom nav
│   └── pages/
│       ├── home.js
│       ├── phases.js
│       ├── meals.js
│       ├── prep.js
│       ├── grocery.js
│       └── supps.js
└── assets/
    ├── axo/            ← YOU provide these 4 PNG files (see prompts below)
    │   ├── axo-wave.png
    │   ├── axo-think.png
    │   ├── axo-flex.png
    │   └── axo-eat.png
    └── icons/
        ├── icon-192.png   ← App icon (squircle, lime green background)
        └── icon-512.png   ← Same, larger
```

---

## Section 1 — Your Manual Tasks

### TASK 1: Create the Mascot (4 poses)

Use the image generation prompts below. Export each as **PNG with transparent background**, named exactly as shown. Place them in `assets/axo/`.

---

#### Pose 1 — `axo-wave.png` (Welcome / greeting screen)
```
Cute axolotl character with pink feathery gills, big round black eyes, wide friendly smile, chubby body, stubby arms and legs, pastel pink and peach colour. Flat vector illustration style. Transparent background. The axolotl is waving one hand cheerfully with a big happy grin. Chibi proportions. No text. Clean minimal lines. Think Duolingo mascot energy.
```

---

#### Pose 2 — `axo-think.png` (Question / input screens)
```
Cute axolotl character with pink feathery gills, big round black eyes, pastel pink and peach colour, chubby body. Flat vector illustration style. Transparent background. The axolotl is in a thinking pose — one stubby finger raised to chin, eyes looking slightly upward to the side, a small curious smile. Chibi proportions. No text. Clean minimal lines.
```

---

#### Pose 3 — `axo-flex.png` (Completion / results screen)
```
Cute axolotl character with pink feathery gills, big round black eyes, pastel pink and peach colour, chubby body. Flat vector illustration style. Transparent background. The axolotl is flexing both arms in a victory pose, eyes squeezed shut with a huge triumphant smile, small sparkles around it. Chibi proportions. No text. Clean minimal lines. Very energetic and celebratory.
```

---

#### Pose 4 — `axo-eat.png` (Meal plan screens)
```
Cute axolotl character with pink feathery gills, big round black eyes, pastel pink and peach colour, chubby body. Flat vector illustration style. Transparent background. The axolotl is holding a small bowl of food in both stubby hands, looking at it with excited hungry eyes and a big smile, maybe a small drool drop. Chibi proportions. No text. Clean minimal lines.
```

---

### TASK 2: Create the App Icon (2 sizes)

Use this prompt or design it yourself. The icon is a squircle (Apple's standard rounded square shape — 22.5% radius).

```
App icon. Square format with rounded corners (squircle shape). Bright lime green (#d4f53c) background. Centred: the cute pink axolotl mascot (chibi, big eyes, feathery gills) holding a small dumbbell in one hand and a fork in the other, grinning. Flat vector style. No text. Bold, readable at small sizes.
```

Export as:
- `assets/icons/icon-192.png` — 192×192 px
- `assets/icons/icon-512.png` — 512×512 px

---

### TASK 3: Test Locally Before Handing to Users

1. Put all files in one folder on your Mac
2. Open Terminal, `cd` into that folder, run: `python3 -m http.server 8080`
3. Open Safari → `http://localhost:8080`
4. On iPhone (same WiFi): open Safari → `http://YOUR_MAC_IP:8080`
5. Tap Share → "Add to Home Screen" → it installs as an app

---

### TASK 4: Deploy for Real (Free, Takes 2 Minutes)

To share with anyone (Rudra or others):
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire project folder onto the page
3. You get a live HTTPS link instantly — e.g. `https://nutripal-xyz.netlify.app`
4. That link works for "Add to Home Screen" on any phone

---

## Section 2 — Onboarding Quiz Flow (12 Steps)

The quiz collects everything the plan generator needs. Axo appears at the top of every screen.

| # | Screen | Question | Input |
|---|--------|----------|-------|
| 0 | Splash | "Let's build your plan." | Tap to begin |
| 1 | Name | "First, what's your name?" | Text field |
| 2 | Goal | "What's your main goal?" | 3 buttons: Cut fat / Build muscle / Both (recomp) |
| 3 | Weight | "How much do you weigh?" | Number slider, kg/lbs toggle |
| 4 | Height | "How tall are you?" | Number slider, cm/ft toggle |
| 5 | Age | "How old are you?" | Number tap picker |
| 6 | Sex | "Biological sex?" | Male / Female / Prefer not to say |
| 7 | Activity | "How active are you outside the gym?" | 4 option cards |
| 8 | Training days | "How many days a week do you train?" | 1–7 tap grid |
| 9 | Diet | "Any dietary preferences?" | Multi-select chips |
| 10 | Supplements | "Which supplements do you already have?" | Multi-select chips |
| 11 | City | "City or region? (for grocery tips)" | Text field, skippable |
| 12 | Loading | "Building your plan…" | Animated Axo + progress bar → redirect to app |

---

## Section 3 — Plan Generator Logic

File: `js/plangen.js`

### Step 1 — Calculate TDEE (Total Daily Energy Expenditure)

```
BMR (Male)   = (10 × kg) + (6.25 × cm) − (5 × age) + 5
BMR (Female) = (10 × kg) + (6.25 × cm) − (5 × age) − 161
BMR (Other)  = average of above

Activity multipliers:
  Sedentary      = BMR × 1.20
  Lightly active = BMR × 1.375
  Active         = BMR × 1.55
  Very active    = BMR × 1.725

TDEE = BMR × activity multiplier
```

### Step 2 — Set Calorie Target by Goal

```
Cut (lose fat):     TDEE − 400
Build (gain muscle): TDEE + 200
Recomp (both):      TDEE − 150
```

### Step 3 — Macro Split

```
Protein = bodyweight_kg × 2.0g  (×2.2g if goal is Cut)
Fat     = 25% of total calories ÷ 9
Carbs   = (remaining calories) ÷ 4
```

### Step 4 — 16-Week Phases

```
Phase 1 (Wks 1–4):   base calories
Phase 2 (Wks 5–8):   base + 100 kcal (more carbs on training days)
Phase 3 (Wks 9–12):  base + 200 kcal
Phase 4 (Wks 13–16): base + 150 kcal (slight drop to strip last fat)
```

### Step 5 — Meal Plan

- 5-meal-per-day template
- Portion sizes (chicken g, rice g, etc.) are scaled to hit macro targets
- Vegetarian flag → replace chicken/tuna with paneer / tofu / lentils
- No-dairy flag → replace Greek yogurt with coconut yogurt, skip milk

### Step 6 — Grocery List

- Generated from active meal plan
- Quantities = (per-meal amount) × 7 days
- Regional grocery tip appended if city was provided

### Step 7 — Supplement Schedule

- Only includes supplements the user said they have
- If no whey protein → add note: "Hit protein target from whole food only"
- Static per-supplement timing rules (same as reference HTML)

---

## Section 4 — App Design: iOS 26 Liquid Glass

### Fonts
```
Body:  -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif
Mono:  'SF Mono', 'Menlo', monospace
```

### Colours (dark mode, adapts to light mode automatically)
```
Background:        #000000
Surface (cards):   rgba(28, 28, 30, 0.72)   ← frosted glass
Bottom nav:        rgba(18, 18, 20, 0.92)
Border:            rgba(255, 255, 255, 0.09)
Accent (lime):     #d4f53c
Accent (teal):     #3effc8
Accent (orange):   #ff6030
Text primary:      #ffffff
Text secondary:    rgba(255,255,255,0.60)
```

### Glass Effect (applied to cards + nav)
```css
backdrop-filter: blur(28px) saturate(180%);
background: rgba(28, 28, 30, 0.72);
border: 1px solid rgba(255, 255, 255, 0.09);
```

### Border Radius (squircle feel)
```
Cards:        20px
Chips/badges: 12px
Buttons:      14px
Nav icons:    13px
Full pill:    9999px
```

### Animations
- Page transitions: slide + fade (300ms ease-out)
- Axo mascot: gentle floating bob loop
- Button tap: scale down to 0.96, spring back
- Quiz progress bar: smooth width transition

---

## Section 5 — PWA Install Behaviour

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

### Service Worker Strategy
- On install: pre-cache all HTML, CSS, JS, SVG/PNG assets
- On fetch: cache-first for static assets; network-first for HTML
- Result: app works fully offline after first load

---

## Section 6 — Main App Pages (after onboarding)

Top bar shows: user's first name + a dot. E.g. `Rudra.`
Bottom nav: Home · Phases · Meals · Prep · Grocery · Supps

| Page | Icon | Content |
|------|------|---------|
| Home | 🏠 | Name greeting, today's schedule, stat bar, quick-nav cards, tips |
| Phases | 📅 | 4 phase cards with calorie/macro breakdown, flavour rotation tip |
| Meals | 🍗 | Workout day / Rest day tabs, 5 meal cards each with macros |
| Prep | 🍳 | 6-step Sunday batch cook guide |
| Grocery | 🛒 | 5-tab list (Protein/Carbs/Veg/Fats/Pantry), tap to check off items |
| Supps | 💊 | Daily schedule, per-supplement cards, protein powder comparison |

All data is read from `localStorage` (set by the plan generator). If no data is found, redirect to `index.html`.

---

## Section 7 — For the Build Agent

When you pick this plan up:

1. Implement all files exactly as laid out in Section 1 (File Structure)
2. Use the design tokens from Section 4
3. Use the quiz steps from Section 2
4. Implement `plangen.js` using the formulas in Section 3
5. Port all 6 app pages from the reference HTML (provided separately) into `app.html` with the new design
6. Axo PNG files will be in `assets/axo/` — if missing, use inline SVG placeholders
7. Wire up `manifest.json` and `sw.js`
8. Test: fill out quiz → check `localStorage` has correct keys → confirm app shows correct name + macros
9. Commit, push, open PR

---

*Plan written: May 2026. Ready to implement.*
