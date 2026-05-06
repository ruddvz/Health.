# NutriPal — Design Reference Image Prompts

> **How this works:**
> Generate each prompt below as a full-size mobile screen mockup image (1170×2532 px — iPhone 15 Pro resolution).
> Export as PNG. Hand the images to the build agent with the instruction: "Build the app to match these images pixel-for-pixel."
>
> **Mascot:** Otto the Otter — chubby, brown and cream coloured, big round shiny eyes, tiny round nose, small rounded ears, a flat wide tail, small paws. Flat vector illustration style with a thick outline. Chibi proportions (head slightly bigger than body). Extremely cute, gender-neutral, universally lovable. Similar energy to the llama in the reference image — bold outlines, simple shapes, slightly chunky, very charming.
>
> **Style reference for all screens:** Look at the llama image provided — bold thick outlines around all characters, flat colour fills (no gradients inside shapes), slightly chunky and playful typography, dark background with glowing accent colours. That energy but applied to a sleek iOS dark-mode fitness app.

---

## MASCOT POSES — Generate These First

These are standalone transparent-background PNGs. You'll reuse Otto in every screen below.

---

### `otto-wave.png`

```
Chibi otter mascot character. Chubby brown body with cream/beige belly patch, big glossy round black eyes with a white highlight dot, tiny round black nose, small rounded ears, a wide flat beaver-like tail, small round paws. Thick black outline around entire character. Flat vector illustration — no gradients, solid colour fills. Transparent background. Pose: Otto is standing upright, one paw raised high in a friendly wave, huge open smile showing tiny white teeth, other paw on hip. Very cheerful and welcoming. Chibi proportions. No text. Clean minimal lines. White sparkles or stars floating around him for extra charm.
```

---

### `otto-think.png`

```
Same chibi otter mascot — chubby brown body, cream belly, big glossy eyes, thick black outline, flat vector style. Transparent background. Pose: Otto is in a classic thinking pose — one paw raised and pressing against his cheek/chin, eyes rolled slightly upward with a curious squint, small thoughtful smile, eyebrow slightly raised. A small thought bubble floats above his head with three dots inside. Chibi proportions. No text. No background.
```

---

### `otto-flex.png`

```
Same chibi otter mascot — chubby brown body, cream belly, big glossy eyes, thick black outline, flat vector style. Transparent background. Pose: Otto is in a full celebration victory pose — both paws flexed up in the air showing tiny muscles, eyes squeezed completely shut in the biggest smile, tongue sticking out slightly in excitement. Yellow and white star burst shapes and sparkles explode around him. Small motion lines suggest he just jumped. Extremely energetic and triumphant. Chibi proportions. No text. No background.
```

---

### `otto-eat.png`

```
Same chibi otter mascot — chubby brown body, cream belly, big glossy eyes, thick black outline, flat vector style. Transparent background. Pose: Otto is holding a small round ramen/rice bowl in both paws at chest height, looking down at it with enormous excited eyes and the widest grin. A tiny drop of cartoon drool hangs from the corner of his mouth. Steam wisps rise from the bowl. Chibi proportions. No text. No background.
```

---

### `otto-sleep.png`

```
Same chibi otter mascot — chubby brown body, cream belly, thick black outline, flat vector style. Transparent background. Pose: Otto is floating on his back like otters do in water (classic otter pose), eyes closed with curved "zzzz" expression, a small smile, paws folded on his belly, tiny Z letters floating up from him. Peaceful and restful. Used on rest day screens. Chibi proportions. No text. No background.
```

---

### `otto-shop.png`

```
Same chibi otter mascot — chubby brown body, cream belly, thick black outline, flat vector style. Transparent background. Pose: Otto is holding a small grocery basket in one paw, the other paw giving a thumbs up. Big happy smile. A small broccoli and a chicken drumstick peek out of the basket. Chibi proportions. No text. No background.
```

---

### App Icon — `icon-512.png`

```
Mobile app icon. Perfect square (512×512 px). Apple squircle shape — corner radius approximately 22.5% of width. Background: bold lime green (#d4f53c). Centred: the chibi otter mascot Otto, holding a tiny silver dumbbell in one paw and a fork in the other, grinning with eyes squeezed into happy crescents. Thick black outline. Flat vector. No text on icon. Bold and instantly readable at 60×60 px size. The otter fills about 70% of the icon space.
```

---

## ONBOARDING SCREENS

---

### Screen 0 — Language Picker

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Dark background #000000. Status bar at top with time and battery icons in white.

Top section (30% of screen): Large Otto the otter mascot (otto-wave pose) centred, floating with a gentle white glow behind him. Below the mascot, the app name "NutriPal" in large bold rounded white sans-serif font, with a small lime green dot after it like "NutriPal·"

Middle section (50% of screen): Three tall rounded rectangle cards stacked vertically with 16px gaps. Each card has:
- Background: rgba(28,28,30,0.9) — very dark frosted glass look
- Border: 1.5px border in rgba(255,255,255,0.1)
- Border radius: 20px
- Left side: a large flag emoji or language initial
- Right side: Language name in bold white 20px font, below it a sample sentence in that language in 14px rgba(255,255,255,0.5) grey

Card 1: 🇬🇧 — "English" / "Let's build your plan."
Card 2: 🇮🇳 — "Hinglish" / "Tera plan banate hain. 💪"
Card 3: A Gujarati script symbol — "Gujlish" / "Tara plan baniye. 💪"

The currently hovered/active card (show Card 1 as selected) has a bright lime green (#d4f53c) border instead of the dim white border, and a very faint lime green background tint.

Bottom: Small grey text "You can change this anytime in Settings."

Bottom safe area is empty (no nav bar yet).
Overall vibe: Welcoming, clean, premium dark iOS feel.
```

---

### Screen 1 — Splash / Welcome

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Full bleed black background.

Large Otto the otter (otto-wave pose) takes up the top 45% of screen, centred, with a subtle radial lime green glow (#d4f53c at 15% opacity) behind him. Otto has a warm white drop shadow.

Below Otto, centre-aligned text stack:
- Small all-caps tracking label: "// 16-WEEK PROTOCOL" in lime green (#d4f53c), font size 12px, letter spacing 3px, mono font
- Giant headline "Let's build your plan." in white, bold rounded sans-serif, font size 38px, line height tight, letter spacing -1px
- Below that, smaller subtext in rgba(255,255,255,0.55): "Takes 2 minutes. No account needed."

Bottom 20% of screen: A single large pill button, full width minus 40px margins, height 60px, solid lime green (#d4f53c) background, black text "Get Started →" in bold 18px font. Button has 30px border radius. Below the button, tiny grey text: "Free forever. Works offline."

Background has very faint scattered star/dot decorations in rgba(255,255,255,0.04).

No top navigation bar. Pure landing screen.
```

---

### Screen 2 — Name Input

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Top: Thin lime green progress bar, 2/14 filled (about 14% width), at the very top of the screen below status bar. Rounded ends. Height 3px.

Below progress bar, 24px gap, then small grey label "STEP 2 OF 14" in mono font, letter spacing 2px.

Centre of screen:
- Otto (otto-think pose) at 120px tall, centred, floating
- Below Otto: Question text "What's your name?" in bold white 32px rounded sans-serif
- Below that: A large text input field — dark surface rgba(28,28,30,1), border-radius 16px, 1.5px border rgba(255,255,255,0.12), height 64px, left-padded 20px. Inside: placeholder text "Type your name..." in rgba(255,255,255,0.3). The cursor blinks. A very faint lime green glow appears around the field border indicating focus.
- Below input: small grey caption "We'll use this throughout your plan."

Bottom: Large pill "Continue →" button, lime green, same style as Screen 1. 
Left of button: back arrow "<" as a ghost/outline button.

Keyboard shown at bottom of screen (standard iOS dark keyboard, blurred beneath a frosted glass strip).
```

---

### Screen 3 — Goal Selection

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Top: Progress bar ~21% filled. "STEP 3 OF 14" label.

Otto (otto-flex pose, smaller, about 100px) floats top centre. 

Question: "What's your main goal, [Name]?" — 28px bold white. The word "[Name]" is highlighted in lime green.

Below question, 3 large option cards stacked vertically with 12px gaps:

Card A — "Lose fat" (Cut):
- Background: rgba(28,28,30,0.9), border-radius 20px, border 1.5px rgba(255,255,255,0.1)
- Left: large fire emoji 🔥 in a small lime green circle badge
- Right: Title "Lose fat" bold white 18px. Subtitle "Calorie deficit · High protein" in grey 13px.
- Far right: empty circle radio button (white outline)

Card B — "Build muscle" (Build):
- Same style. Left: 💪 in teal circle. Title "Build muscle". Subtitle "Calorie surplus · Heavy lifting". Radio empty.

Card C — "Both (Recomp)":
- Same style. Left: ⚡ in orange circle. Title "Both" with small badge chip saying "RECOMP" in purple. Subtitle "Slight deficit · Maximum protein". Radio empty.

Show Card A as selected: lime green border, lime green radio filled, very faint lime green background tint (#d4f53c at 8% opacity).

Below cards: Continue button and back button. Same style as before.
```

---

### Screen 4 — Duration Picker

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~28% filled. "STEP 4 OF 14" label.

Otto (otto-think pose, 100px) floats top centre.

Question: "How long is your plan?" 28px bold white.

Below: a 2-column grid of 6 duration cards, each roughly 160px wide and 100px tall, 12px gap:

Card 1: "4 Weeks" — bold white 22px. Subtitle "Quick reset" in grey. Icon: 🌱
Card 2: "8 Weeks" — "Solid foundation" 🌿
Card 3: "12 Weeks" — "Real results" 💪 — shown as SELECTED (lime green border, lime tint bg)
Card 4: "16 Weeks" — "Full transformation" 🔥 — small badge chip "POPULAR" in lime green
Card 5: "6 Months" — "Lifestyle change" ⚡
Card 6: "1 Year" — "New you" 🏆

All cards: dark surface, 20px radius, 1.5px dim border.
Selected card: lime green 1.5px border, lime tint background.

Below grid: Continue and back buttons.
```

---

### Screen 5 — Weight Input

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~35% filled. "STEP 5 OF 14" label.

Otto (otto-think pose, 90px) top centre.

Question: "How much do you weigh?" 28px bold white.

Below: large weight display — a number like "84" in huge white mono font 80px, followed by "kg" in lime green 36px. Feels like a scale readout.

Below the number: a horizontal slider track. Thick pill-shaped track in rgba(255,255,255,0.1). The filled portion is lime green. The thumb is a white circle 28px with a subtle shadow. The user can drag it.

Tick marks below slider showing: 40 · 60 · 80 · 100 · 120 · 140 · 160 (kg)

Below slider: unit toggle — two pill buttons side by side:
- "kg" selected — lime green background, black text
- "lbs" — dark background, grey text

Continue and back buttons at bottom.
```

---

### Screen 6 — Height Input

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~42% filled. "STEP 6 OF 14".

Otto (otto-think pose, 90px) top centre.

Question: "How tall are you?" 28px bold white.

Large height display: "178" in huge mono 80px white, "cm" in lime green 36px.

Same horizontal slider style as weight screen. Tick marks: 140 · 155 · 170 · 185 · 200 · 215.

Unit toggle: "cm" selected / "ft · in"

Continue and back buttons.
```

---

### Screen 7 — Age Input

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~49% filled. "STEP 7 OF 14".

Otto (otto-think pose, 90px) top centre.

Question: "How old are you?" 28px bold white.

Large drum-roller / scroll picker in the centre of screen. iOS-style spinning drum picker showing numbers. The visible numbers scroll:
  ... 22 23 [24] 25 26 ...
Centre number "24" is large and white. Adjacent numbers are smaller and faded. Horizontal selection line above and below the centre value in lime green.

Picker has a frosted glass mask above and below so numbers fade out toward edges.

Continue and back buttons.
```

---

### Screen 8 — Sex

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~56% filled. "STEP 8 OF 14".

Otto (otto-think pose, 90px) top centre.

Question: "Biological sex?" 28px bold white.
Small caption below: "Used only for calorie calculations." in grey 13px.

3 large option cards stacked:
Card 1: ♂️ "Male" — shown selected (lime green border + tint)
Card 2: ♀️ "Female"
Card 3: "Prefer not to say" — dimmer style

Same card style as goal screen.

Continue and back buttons.
```

---

### Screen 9 — Activity Level

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~63% filled. "STEP 9 OF 14".

Otto (otto-think pose, 90px) top centre.

Question: "How active are you outside the gym?" 26px bold white.

4 option cards stacked:

Card 1: 🪑 "Sedentary" — "Mostly sitting. Desk job." — dim unselected
Card 2: 🚶 "Lightly active" — "Walk sometimes. Light movement." — shown SELECTED (lime green)
Card 3: 🏃 "Active" — "Physical job or daily exercise outside gym."
Card 4: ⚡ "Very active" — "Heavy physical job or athlete-level training."

Each card has the emoji in a small coloured circle badge on left, title bold white, subtitle grey, radio on far right.

Continue and back buttons.
```

---

### Screen 10 — Training Days

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~70% filled. "STEP 10 OF 14".

Otto (otto-flex pose, 90px) top centre — flexing because gym.

Question: "How many days a week do you train?" 26px bold white.

7 circular tap buttons in a row:
1  2  3  4  5  6  7
Each is a 60px circle. Unselected: dark surface, dim white number, 1.5px dim border.
Selected button (show "5" selected): solid lime green fill, black number bold.

Below: descriptive text that changes based on selection. Example for 5: 
"5 days — solid split. Push / Pull / Legs + 2 extras." in grey 13px.

Continue and back buttons.
```

---

### Screen 11 — Diet Type

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~77% filled. "STEP 11 OF 14".

Otto (otto-eat pose, 110px) top centre — hungry otter.

Question: "What do you eat?" 28px bold white.
Caption: "This shapes your entire meal plan." grey 13px.

4 large option cards:

Card 1: 🍗 "Non-veg" — "Chicken, eggs, fish, everything." — shown SELECTED (lime green)
Card 2: 🥬 "Vegetarian" — "No meat or fish. Dairy & eggs OK."
Card 3: 🥚 "Eggetarian" — "Veg + eggs only."
Card 4: 🌱 "Vegan" — "Plant-based only. No dairy or eggs."

Below the 4 cards, a section titled "Any extra restrictions?" with multi-select chips in a wrapping row:
Chips: [ No dairy ] [ No gluten ] [ No pork ] [ Jain ] [ Halal only ]
Each chip: dark surface, rounded, dim border. When selected, chip goes lime green with black text. Show "Jain" as selected for example.

Continue and back buttons.
```

---

### Screen 12 — Supplements

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~84% filled. "STEP 12 OF 14".

Otto (otto-think pose, 90px) top centre.

Question: "Which supplements do you already have?" 24px bold white.
Caption: "We'll only include what you actually have." grey 13px.

Multi-select grid of supplement chips in 2 columns:

Row 1: [ 💊 Creatine ] [ 🥛 Whey Protein ]
Row 2: [ ⚡ Pre-workout ] [ 🐟 Omega-3 ]
Row 3: [ 🌿 Multivitamin ] [ 🌙 Magnesium ]
Row 4: [ 🌿 Ashwagandha ] [ ❌ None of these ]

Each chip: taller card style (not small pill), dark surface, border-radius 14px, emoji on top, label below. About 155px wide, 80px tall.

Show Creatine, Whey, Omega-3, Multivitamin, Magnesium as selected (lime green border + tint).
"None of these" is greyed out.

Continue and back buttons.
```

---

### Screen 13 — City (Skippable)

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Progress bar ~91% filled. "STEP 13 OF 14".

Otto (otto-shop pose, 100px) top centre — shopping basket.

Question: "What city are you in?" 28px bold white.
Caption: "Optional. Helps us give local grocery store tips." grey 13px.

Large text input field (same style as name input), with placeholder "e.g. Toronto, Mumbai, London ON..."

Below input: a frosted glass info card showing: "🛒 Example tip: FreshCo on Dundas has the cheapest chicken breast in the west end." in grey italic text 13px. To show what kind of tip they'll get.

Two buttons at bottom:
- Primary lime green button "Continue →" 
- Below it, a text link button in grey: "Skip this step →"
```

---

### Screen 14 — Loading / Plan Generation

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Full screen loading experience. No progress bar at top (this is the final step).

Centre top: Otto (otto-flex pose) large (200px), animated glow behind him — a radial lime green gradient at 20% opacity pulsing.

Below Otto: Big bold white text "Building your plan..." 30px.

Below that: a large pill progress bar, full width minus 40px margins, height 12px. Track is rgba(255,255,255,0.1). Fill is animated from 0 to 100% in lime green with a glowing right edge effect (bright white glow on the leading edge). Show it at about 75% filled.

Below progress bar: rotating status messages in grey 14px (show one, imply they cycle):
"Calculating your TDEE..."
(would then show "Scaling your meal portions...", "Writing your grocery list...", etc.)

Bottom 25% of screen: a frosted glass card (border-radius 24px, dark surface, subtle border) previewing a snippet of what's being generated:
Small lime green label "PREVIEW" then:
"🔥 2,200 kcal / day
 🍗 Non-veg meal plan · 16 weeks
 💪 Protein: 176g · Carbs: 215g · Fat: 58g"
Numbers appear to be "typing in" one by one.

No buttons — this screen auto-advances.
```

---

## MAIN APP SCREENS

---

### Home Page

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

STATUS BAR: top, white icons.

TOP BAR (60px tall, frosted glass — backdrop blur, dark surface rgba(18,18,20,0.92), bottom border 1px rgba(255,255,255,0.08)):
- Left: Name "Rudra." in bold white 28px SF Display font. The period after the name is lime green.
- Right: Small Otto (otto-wave, 36px circle) as a profile/avatar button. Tiny gear icon beside it.

HERO SECTION (below top bar, full bleed, 280px tall):
Background: very subtle dark green-tinted gradient from #000 to #080e00.
Faint radial lime glow top-right corner.
Content:
- Small all-caps lime green label: "// WEEK 3 OF 16"
- Big greeting: "Good morning, Rudra." bold white 32px
- Below: stats row — 3 stat boxes side by side in a frosted glass row:
  [ 84 kg | Start ] [ Week 3 | Current ] [ 176g | Protein/day ]
  Each box: dark surface, 1px dim border, value in white bold 22px mono, label in grey 11px caps

SCROLL CONTENT below hero (user scrolls this):

TODAY'S SCHEDULE card — lime-tinted frosted glass background, lime green border:
Header: "TODAY'S SCHEDULE" in lime green 10px mono caps
5 schedule rows, each with:
- Small lime green dot
- Text of meal/supplement
- Time on far right in mono grey
Row examples: "Multivitamin + Omega-3  ·  Breakfast" / "Meal 3 — Chicken + Rice  ·  1:00 PM"

QUICK NAV GRID — 2×3 grid of cards (2 columns, 3 rows):
Each card: dark surface, 20px radius, 1px dim border
Row 1: [📅 Phases "Week-by-week"] [🍗 Meals "Every day rotates"]
Row 2: [🍳 Prep "Sunday cook"] [🛒 Grocery "Tap to check"]
Row 3: [💊 Supps "Your stack" — spans full width]
Each card has icon top-left, title bold white, subtitle grey, chevron › top-right.

INFO BOX — lime-tinted: "Take your Week 3 photo today. Front, side, back." lime green bold + grey body text.

INFO BOX — orange-tinted: "3L of water daily." orange bold + grey body text.

BOTTOM NAV (fixed, frosted glass, 80px + safe area):
6 tabs: Home · Phases · Meals · Prep · Grocery · Supps
Each: icon (emoji, 22px) above label (9px mono caps grey)
Active tab (Home): icon full opacity, label in lime green, small lime green dot below
Inactive: greyed out, 40% opacity
```

---

### Phases Page

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

TOP BAR: "Rudra." left, same style. 

PAGE HEADER section (no hero gradient, just flat dark):
- Small lime green eyebrow: "// YOUR ROADMAP"
- Title: "4 Phases,\n16 Weeks." bold white 34px
- Body: "You're doing a recomp. Slight deficit, maximum protein. At 24 you can lose fat and build muscle simultaneously." grey 13px

SCROLL CONTENT — 4 phase cards stacked:

Phase 1 card (Weeks 1–4):
- Background: dark surface. Top edge: 2px solid lime green bar.
- Top row: left "PHASE 01" grey 10px mono + "Reset & Foundation" bold white 18px. Right: pill badge "Weeks 1–4" lime-green tint bg, lime text.
- Body: "Daily: 2,000 kcal" with 2000 in lime green 24px bold.
- Description text grey 13px.
- Macro row: 3 chips side by side — [170g Protein] [180g Carbs] [55g Fat] — dark surface, white value mono 18px, label grey 10px.

Phase 2 card (Weeks 5–8):
- Top edge: 2px solid teal (#3effc8). Badge teal tint.
- "2,100 kcal" in teal.

Phase 3 card (Weeks 9–12):
- Top edge: 2px solid orange (#ff6030). Badge orange tint.
- "2,200 kcal" in orange.

Phase 4 card (Weeks 13–16):
- Top edge: 2px solid purple (#b4a0ff). Badge purple tint.
- "2,150 kcal" in purple.

Bottom: flavour rotation info box, lime-tinted.

BOTTOM NAV: Phases tab active (lime label + dot).
```

---

### Meals Page

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

TOP BAR: "Rudra." + avatar.

PAGE HEADER:
- Eyebrow "// 5 MEALS A DAY" lime green
- Title "Meal Plan" bold white 34px
- Body grey: "Every day rotates. Never eat the same thing twice this week."

WEEKDAY PICKER — horizontal scrollable row of 7 day pills below header:
[ Mon ] [ Tue ] [ Wed ] [ Thu ] [ Fri ] [ Sat ] [ Sun ]
Each: rounded pill, dark surface, grey text, dim border.
Active (Thu): lime green background, black bold text.

Below day picker: diet type indicator row:
Small teal dot + "Non-veg plan · Workout day" in teal 12px mono.

SCROLL CONTENT — 5 meal cards for Thursday:

Meal card style:
- Dark surface, 20px radius, 1px dim border
- Header row: time badge (dark surface chip "1:00 PM") + meal title bold white + kcal on far right in lime green mono
- Divider line 1px rgba(255,255,255,0.06)
- Body: description text grey 13px
- Tags row: small rounded chips — [High protein] [High carb] [Instant Pot batch] — lime-tinted for highlighted ones

Card 1: 7:00 AM · Morning Fuel · ~520 kcal — "Egg bhurji (scrambled eggs with onion, tomato, green chilli) on 2 slices whole wheat toast. 1 banana. Black coffee."
Tags: [High protein] [~15 min]

Card 2: 10:00 AM · Mid Morning · ~420 kcal — "150g Greek yogurt + 1 scoop whey stirred in. Small handful almonds and cashews. No cook, 2 minutes."
Tags: [High protein] [No cook]

Card 3: 1:00 PM · Main Lunch · ~620 kcal — "200g chicken breast from Sunday batch. 150g quinoa. Big salad — cucumber, tomato, lemon. Olive oil drizzle."
Tags: [High protein] [High carb] [Batch cooked]

Card 4: 4:00 PM · Pre-Workout · ~280 kcal — "1 banana + 30g oats with water. Nitro Surge 30 min before gym."
Tags: [Pre-gym carbs] [Nitro Surge]

Card 5: 7:30 PM · Post-Workout · ~380 kcal — "1.5 scoops whey in water. 5g creatine mixed in. Medium sweet potato microwaved 5 min."
Tags: [Critical window] [Creatine 5g]

Info box lime: "Thursday total: ~2,220 kcal. Workout day. You're on track."

BOTTOM NAV: Meals tab active.
```

---

### Prep Page

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

TOP BAR: "Rudra." + avatar.

PAGE HEADER:
- Eyebrow "// EVERY SUNDAY" lime green
- Title "Meal Prep\nGuide." bold white 34px
- Body grey: "90 minutes on Sunday sets you up for the entire week. Grab-and-go every morning."

Otto (otto-eat pose, 90px) floating to the right of the title, slightly overlapping.

SECTION LABEL: "INSTANT POT SEQUENCE" — 11px mono grey caps, underline 1px dim border, margin bottom.

SCROLL CONTENT — 6 prep step cards:

Each prep card:
- Dark surface, 20px radius, 1px dim border, 16px padding
- Left column (48px wide): large square lime green box with step number in bold black mono 20px — squircle shape (16px radius)
- Right column: Step name bold white 15px, detail text grey 13px, at bottom: time badge chip — teal tint background, "⏱ 25 min total · Covers all week" in teal 11px mono

Step 1: Batch Chicken — Lime number box "1" — "1.5kg chicken breast in Instant Pot. Pressure cook HIGH 12 min. Natural release 10 min. Shred and portion into 200g servings." — Time: ⏱ 25 min

Step 2: Bulk Rice — "2" — "2 cups basmati, 2.5 cups water, pinch salt. HIGH 4 min. 6 portions of 150g each." — ⏱ 15 min

Step 3: Pan Vegetables — "3" — "Chop broccoli, peppers, zucchini. Toss with olive oil and spices. Cook on medium-high until charred at edges." — ⏱ 25 min

Step 4: Boil 12 Eggs — "4" — "Full dozen at once. 10–12 min. Peel all and store in fridge. Use all week." — ⏱ 15 min

Step 5: Pack Tiffins — "5" — "Pack Mon–Wed now. Pack Thu–Sat on Wednesday evening (20 min). Round for rice and veg. Square for chicken." — ⏱ 15 min

Step 6: Sweet Potato — "6" — "Don't prep. After gym: fork pierce, microwave 5 min. Keep 4–5 at home." — ⏱ 5 min post-gym

Two info boxes:
- Lime: "Instant Pot order: Chicken first → Rice → Lentils if needed. Total active time under 45 min."
- Orange: "Wednesday top-up takes 20 minutes. No new cooking, just portioning."

BOTTOM NAV: Prep tab active.
```

---

### Grocery Page

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

TOP BAR: "Rudra." + avatar.

PAGE HEADER:
- Eyebrow "// WEEKLY SHOP" lime green
- Title "Grocery List." bold white 34px
- Body grey: "Tap items to check them off. Quantities for one week."

Otto (otto-shop pose, 80px) floats top right near header.

CATEGORY TABS — horizontal scrollable pill tabs below header:
[ Protein ] [ Carbs ] [ Veg & Fruit ] [ Fats ] [ Pantry ]
Active: Protein — lime green bg, black text. Others: dark, grey text, dim border.

SCROLL CONTENT — Protein tab shown:

Single large card containing a list (dark surface, 20px radius, 1px dim border, overflow hidden):

Each list item (row):
- Height 54px
- Bottom border 1px rgba(255,255,255,0.05)
- Left: square checkbox 22px — unhecked: dim border, rounded 6px; checked: lime green fill with black ✓
- Centre: item name 14px. If checked: strikethrough + opacity 0.4
- Right: quantity grey mono 12px

Items:
✓ [checked] Chicken breast (boneless, skinless) · 1.5–2 kg
✓ [checked] Chicken thighs (boneless) · 500g
○ [unchecked] Eggs (large) · 2 dozen
○ Greek yogurt (plain 2%) · 1 kg tub
○ Canned tuna (in water) · 4 cans
○ Cottage cheese (low fat) · 500g

Below list: store tip card in lime tint frosted glass:
"🛒 London ON tip: FreshCo on Dundas for produce. No Frills for bulk rice. Costco for chicken breast — cheapest per kg."

BOTTOM NAV: Grocery tab active.
```

---

### Supplements Page

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

TOP BAR: "Rudra." + avatar.

PAGE HEADER:
- Eyebrow "// YOUR STACK" lime green
- Title "Supplements." bold white 34px
- Body grey: "Only what you already have. Exactly when to take each one."

SECTION LABEL: "DAILY SCHEDULE"

Daily schedule card — dark surface, 20px radius, 1px dim border:
4 rows inside, each row:
- Left: time label in lime green 12px mono (Morning / Pre-gym / Post-gym / Before bed)
- Right column: item name bold white 14px + sub detail grey 12px

Rows:
Morning    | Multivitamin + Omega-3 | "Both with breakfast — fat in meal absorbs omega-3"
Pre-gym    | Nitro Surge — 1 scoop  | "30 min before. Skip rest days. Not within 6hr of sleep."
Post-gym   | Whey 1.5 scoops + Creatine 5g | "Within 30 min. On rest days take creatine with any meal."
Before bed | Ashwagandha + Magnesium | "Together. Better sleep + overnight recovery."

SECTION LABEL: "WHAT YOU HAVE" — 11px grey mono caps

5 supplement cards stacked:

Each supplement card:
- Dark surface, 20px radius, 1px dim border
- Header row: coloured dot (10px) + name bold white 15px + status badge right: "Have it" (lime green) or "Need it" (orange)
- Body: why text grey 13px
- Timing chips row: small dark chips, active timing chip is teal-tinted

Show cards for: Creatine (lime dot) / Nitro Surge (orange dot) / Omega-3 (teal dot) / Magnesium (purple dot) / Multivitamin (lime dot) / Ashwagandha (gold dot)

SECTION LABEL: "PROTEIN POWDER — WHICH TO BUY"

3 protein comparison cards:
Card 1: badge "BEST OVERALL" lime · "Optimum Nutrition Gold Standard Whey" · "$129 / 5lb" · description
Card 2: badge "BUDGET PICK" teal · "Kaizen Naturals — Costco" · "~$70 / 5lb"
Card 3: badge "FASTER ABSORPTION" orange · "Dymatize ISO100 Hydrolyzed" · "~$100 / 5lb"

Orange info box: "Don't buy anything else. BCAAs are useless at 170g+ protein daily. Save money for better food."

BOTTOM NAV: Supps tab active.
```

---

## ADDITIONAL SCREENS

---

### Settings / Language Change Screen

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

TOP BAR: back arrow "←" left + "Settings" centred in bold white 18px.

SCROLL CONTENT:

Section "YOUR PROFILE":
Dark surface rounded card, list style rows with chevrons ›:
- Name: "Rudra" → tap to edit
- Goal: "Recomp" 
- Duration: "16 Weeks"
- Diet type: "Non-veg"
- Weight: "84 kg"

Section "LANGUAGE":
Same Otto mascot small to the left of the section title.
3 language option rows (same style as Screen 0 language picker), but as a list card:
Row 1: 🇬🇧 English — selected (lime green checkmark on right)
Row 2: 🇮🇳 Hinglish
Row 3: Gujarati symbol Gujlish

Section "ABOUT":
- "NutriPal v1.0" grey
- "No account. No data leaves your device." grey small
- "Restart onboarding" text link in orange (destructive action)

Otto (otto-wave, 80px) sits at very bottom centre, above the bottom nav, waving cheerfully.

BOTTOM NAV: Home tab remains active (settings is a modal overlay-style page).
```

---

### Rest Day Meals View

```
Mobile app screen mockup, iPhone 15 Pro size (1170×2532 px). Black background.

Same structure as Meals Page but:
- Weekday picker shows "Wed" selected
- Below picker: small teal dot + "Non-veg plan · Rest day" in teal 12px mono
- Otto (otto-sleep pose, 80px) floats near the header, on his back floating peacefully

4 meal cards (no pre-workout card on rest day):
Card 1: 8:00 AM · Slow Morning · ~420 kcal — "2 whole eggs + 100g leftover chicken from fridge. 1 slice wheat toast. No banana — lower carbs today. Black coffee." — Tags: [Lower carb] [Leftover chicken]

Card 2: 12:00 PM · Lunch · ~520 kcal — "200g chicken breast. Big salad — cucumber, tomato, onion, lemon juice, olive oil. 100g rice instead of 150g." — Tags: [Lower carb] [Fresh salad]

Card 3: 3:30 PM · Snack · ~280 kcal — "1 scoop protein in water. 1 apple. Creatine 5g here — still take it on rest days." — Tags: [Creatine 5g] [No cook]

Card 4: 7:00 PM · Dinner · ~500 kcal — "150g chicken thighs in Instant Pot. Garlic, ginger, cumin. 1 cup lentils or chickpeas. Roasted vegetables." — Tags: [Instant Pot] [Lentils]

Info box lime: "Rest day total: ~1,720 kcal. Lower carbs, same protein. Your body burns stored fat when glycogen is low."
```

---

### Vegetarian Meal View (Veg user — same Thursday)

```
Same layout as Meals Page but for a veg user. Show to illustrate how diet type changes everything.

Diet indicator: Small green leaf dot + "Veg plan · Workout day" in teal.

Thursday veg meals:

Card 1: 7:00 AM · Morning Fuel · ~500 kcal — "Besan chilla (3 chickpea pancakes) with green chutney. 150g Greek yogurt on side. 1 banana. Chai without sugar." — Tags: [High protein] [Indian] [~15 min]

Card 2: 10:00 AM · Mid Morning · ~400 kcal — "1 scoop whey stirred into 150g yogurt. Handful mixed nuts. 2 minutes, no cook." — Tags: [High protein] [No cook]

Card 3: 1:00 PM · Main Lunch · ~600 kcal — "150g paneer tikka (from Sunday batch). 150g basmati rice. Big salad — cucumber, tomato, lemon olive oil." — Tags: [High protein] [High carb] [Paneer]

Card 4: 4:00 PM · Pre-Workout · ~270 kcal — "1 banana + 30g oats. Nitro Surge 30 min before gym." — Tags: [Pre-gym carbs]

Card 5: 7:30 PM · Post-Workout · ~380 kcal — "1.5 scoops whey + 5g creatine. Medium sweet potato microwaved." — Tags: [Critical window] [Creatine 5g]
```

---

### Hinglish Version — Home Page

```
Same layout as Home Page but ALL text is in Hinglish:

Greeting: "Subah bakhair, Rudra. 💪"
Schedule label: "AAJ KA SCHEDULE"
Schedule items: "Multivitamin + Omega-3 · Naaste ke saath" / "Meal 3 — Chicken + Rice · Dopahar 1 baje"
Quick card titles: "4 Phases" → "4 Phases" (same), subtitle: "Har hafte ka breakdown"
Card Meals subtitle: "Har din rotate hoga"
Info box: "Aaj Week 3 ki photo le. Front, side, back. Ek baar le le — 4 hafte baad ka comparison motivation bomb hai."
Water box: "3L paani — mandatory hai yaar. Dehydration fat loss, gym performance, recovery sab kuch kill karta hai."

Show this as a before/after pair or side-by-side if possible — English left, Hinglish right.
```

---

## NOTES FOR THE BUILD AGENT

When you receive the generated images:

1. Use them as **pixel-accurate design references** — match spacing, typography size, colour values, component shapes exactly
2. Extract the exact colour values from the images using an eyedropper
3. All component border-radius values are 20px for cards, 12px for chips, 9999px for full pills
4. The glass effect on nav and top bar is `backdrop-filter: blur(28px) saturate(180%)`
5. Otto images go in `assets/otto/` (not `axo/` — mascot name changed to Otto the Otter)
6. The `i18n.js` file must cover every string visible in these screens in all 3 languages
7. Every screen must match the layout grid visible in the mockups: 20px horizontal margin, 12–16px vertical gaps between cards

---

*Prompts v1 — May 2026. Generate all screens, hand images + PLAN.md to the build agent.*
