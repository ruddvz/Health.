# NutriPal — Premium UI Redesign Plan

> **Status:** Implemented in `cursor/premium-ui-redesign-0de1`. This document is the canonical spec for the visual redesign. Any agent continuing this work should read this first.

---

## 1. Design Direction: "Dark Athletic Premium"

The target aesthetic is the intersection of **Whoop × Apple Fitness × Levels Health** — dark base, bold editorial numbers, surgical use of colour, glass-morphism depth, and spring-physics micro-interactions. Nothing should look flat or corporate.

**Guiding principle:** Colour is a signal, not decoration. Lime = action/success. Teal = rest/secondary. Orange = intensity/warning. Purple = peak phase. Everything else is white or grey.

---

## 2. Font System

| Role | Family | Weight | Size Range |
|------|--------|--------|------------|
| Display / hero numbers | Archivo | 900 | 40–72px |
| Page titles | Archivo | 700–900 | 24–32px |
| Section headings | Archivo | 700 | 16–20px |
| Body text | System-UI (SF Pro / Helvetica Neue) | 400–500 | 14–16px |
| Monospace labels, stats | SF Mono / Menlo | 500–600 | 10–13px |
| All-caps eyebrows | Archivo | 700 | 10–11px, +2px tracking |

**Google Fonts import** (add to `<head>` of both HTML files before other stylesheet links):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&display=swap" rel="stylesheet">
```

CSS var: `--font-display: 'Archivo', -apple-system, sans-serif;`

---

## 3. Colour System (complete)

```css
/* Base */
--bg:                #000000
--surface:           rgba(28, 28, 30, 0.72)    /* glass cards */
--surface-low:       rgba(255,255,255,0.03)     /* subtle fills */
--surface-mid:       rgba(255,255,255,0.06)     /* card interiors */
--surface-high:      rgba(255,255,255,0.10)     /* raised elements */
--nav:               rgba(18, 18, 20, 0.94)

/* Borders */
--border:            rgba(255,255,255,0.09)
--border-mid:        rgba(255,255,255,0.14)

/* Accents */
--accent-lime:       #d4f53c    /* primary action, Phase 1 */
--accent-teal:       #3effc8    /* secondary, Phase 2, rest days */
--accent-orange:     #ff6030    /* intensity, Phase 3, warnings */
--accent-purple:     #b4a0ff    /* Phase 4, peak */
--accent-gold:       #ffd060    /* ashwagandha, tertiary warm */

/* Text */
--text:              #ffffff
--text-dim:          rgba(255,255,255,0.55)
--text-muted:        rgba(255,255,255,0.35)

/* Glows (box-shadow) */
--glow-lime:         0 0 24px rgba(212,245,60,0.45)
--glow-teal:         0 0 24px rgba(62,255,200,0.35)
--glow-orange:       0 0 20px rgba(255,96,48,0.35)

/* Gradients */
--gradient-lime:     linear-gradient(135deg, #d4f53c 0%, #b8d900 100%)
--bg-gradient:       radial-gradient(ellipse 120% 80% at 50% -20%, rgba(212,245,60,0.12) 0%, transparent 55%),
                     radial-gradient(ellipse 90% 60% at 100% 100%, rgba(62,255,200,0.06) 0%, transparent 50%)
```

**Phase colour mapping:**
| Phase | Accent | Badge bg | Left border |
|-------|--------|----------|-------------|
| 1 (Weeks 1–4) | `--accent-lime` | `rgba(212,245,60,0.15)` | `--accent-lime` |
| 2 (Weeks 5–8) | `--accent-teal` | `rgba(62,255,200,0.12)` | `--accent-teal` |
| 3 (Weeks 9–12) | `--accent-orange` | `rgba(255,96,48,0.12)` | `--accent-orange` |
| 4 (Weeks 13+) | `--accent-purple` | `rgba(180,160,255,0.12)` | `--accent-purple` |

---

## 4. Spacing & Radius

```
Page horizontal padding:   20px
Section vertical gap:      24–32px
Card padding:              18–20px
Inner element gap:         12–14px

Card radius:        20px  (--radius-card)
Chip radius:        12px  (--radius-chip)
Button radius:      14px  (--radius-btn)
Pill (full round):  9999px
Small tag:          8px
```

---

## 5. Animation System

```css
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)   /* spring bounce */
--ease-smooth:   cubic-bezier(0.25, 0.46, 0.45, 0.94) /* smooth decel */
--dur-fast:      150ms
--dur-base:      250ms
--dur-slow:      400ms
--dur-page:      300ms
```

**Tap interaction:** `transform: scale(0.97)` on `:active`, transition `150ms var(--ease-spring)`. All interactive cards and buttons.

**Page enter:** `opacity 0→1` + `translateY(12px)→0` over `300ms var(--ease-smooth)`.

**Progress bar shimmer:** Gradient sweep animation left→right over `1.8s linear infinite`.

**Stagger:** Each card in a list adds `animation-delay: calc(var(--i) * 60ms)` for staggered reveal.

---

## 6. Glass Card Specification

The `.glass` class (used on all cards):
```css
backdrop-filter: blur(28px) saturate(180%);
-webkit-backdrop-filter: blur(28px) saturate(180%);
background: var(--surface);
border: 1px solid var(--border);
border-radius: var(--radius-card);
box-shadow: 0 8px 32px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.08);  /* top inner glow — key detail */
```

The `inset 0 1px 0` highlight is what makes glass cards look real instead of flat. Never omit it.

---

## 7. Onboarding Screens — Spec

### Screen 0: Language Picker
- Full viewport with page padding
- "NutriPal" brand in small Archivo 700 all-caps lime at top
- "Choose your language" heading in Archivo 900, ~2rem
- Three cards (`.lang-card`) stacked vertically:
  - Flag emoji (🇺🇸 / 🇮🇳 / 🇮🇳 ) + language name in Archivo 900 1.5rem + native script in dim
  - Sample phrase below in system font
  - Right-arrow `›` positioned at right
  - On hover: lime left-border glow
  - On active/selected: lime border + lime background tint

### Screen 1: Splash
- No progress bar visible (hide it or keep it at 0%)
- Full-height centered layout
- Brand mark: "NutriPal" in Archivo 900 at ~3.5rem, lime coloured
- Tagline: large headline in Archivo 900, white, 2 lines
- Sub-copy: smaller body text in dim
- CTA: full-width `btn btn-primary` with "Let's build your plan →"
- Background: subtle lime radial gradient top-right corner

### Screens 2–14: Form Steps
- Tiny eyebrow at top: "STEP X / 14" in mono, muted
- Question headline: Archivo 900, ~1.8rem, white, tight line-height
- Optional description: body text, dim
- Input/selector below with generous spacing
- CTA button pinned near bottom: "Continue →"
- Spring-in animation on each step change

**Step 3 (Goal):** Each option-big button shows an emoji icon above the label (🔥 Cut / 💪 Build / ⚡ Recomp) and a short description line

**Steps 5–6 (Weight/Height):** Show the current value as a giant Archivo 900 number (~4rem) above the range slider; unit toggle as a pill beside it

**Step 7 (Age):** Giant Archivo 900 number (~5rem) centred between `−` and `+` buttons

**Step 11 (Diet):** Emoji per option (🍗 Non-veg / 🥗 Veg / 🥚 Eggetarian / 🌱 Vegan)

### Screen 15: Loading
- Name displayed: "Building your plan, [Name]..." in Archivo 900 ~1.8rem
- Animated gradient progress bar (shimmer effect)
- Stats appear one-by-one as bar fills:
  1. "Daily target: X kcal ✓" (at ~30%)
  2. "Protein goal: Xg / day ✓" (at ~60%)
  3. "Duration: X weeks ✓" (at ~85%)
- At 100%: heading changes to "Your plan is ready." + brief pause before redirect

---

## 8. Home Page — Spec

### Hero Section
```
┌──────────────────────────────────┐
│ ░░░░ lime radial gradient bg ░░░░│
│  Good morning,                   │
│  Rudra.              [settings⚙] │
│                                  │
│  ┌──────┬──────┬──────┐          │
│  │ 84kg │ 16wk │ 180g │          │
│  │ Start│ Plan │ Prot │          │
│  └──────┴──────┴──────┘          │
└──────────────────────────────────┘
```

- Greeting: `text-dim` size, body font
- Name: Archivo 900, ~2.5rem, white, tight tracking
- Stat bar: 3-column grid, each stat has a mono number (large) + label (tiny all-caps)
- Stat bar uses glass card style

### Today's Schedule
- Section eyebrow: "TODAY'S SCHEDULE" in tiny all-caps mono, lime
- Timeline layout: vertical line on left, dot indicators, time badge right-aligned
- Each item: dot (lime) + meal name + time badge

### Quick Nav Grid
- 2-column grid of glass cards
- Each card: emoji icon (24px) + bold title + muted description + `›` arrow
- On tap: scale down + spring back

### Info Boxes
- Lime tip box: lime-tinted bg, lime left border, lime bold text
- Orange warning box: orange-tinted bg, orange text

---

## 9. Phases Page — Spec

Each phase card:
```
┌─────────────────────────────────┐
│ ▌ PHASE 01          [Weeks 1–4] │  ← left colored border + badge pill
│ Reset & Foundation               │
│ ─────────────────────────────── │
│ 2,000 kcal / day                 │
│ Focus text...                    │
│ ┌───────┬───────┬───────┐        │
│ │ 170g  │ 180g  │  55g  │        │
│ │Protein│ Carbs │  Fat  │        │
│ └───────┴───────┴───────┘        │
└─────────────────────────────────┘
```

- Left border: 3px solid, phase accent colour
- Background: decorative large phase number (opacity 0.04) in background
- Badge pill: colour-coded per phase
- Kcal: Archivo 900, large, accent-coloured number
- Macro grid: 3-column glass chips

---

## 10. Meals Page — Spec

Day picker: horizontal scroll row of day-pills (Mon-Sun), active = lime bg + black text

Each meal card:
```
┌──────────────────────────────────┐
│ [7:00 AM]  Morning Fuel   520kcal│  ← time badge + right-aligned kcal
│ ─────────────────────────────── │
│ 3 whole eggs · toast · banana    │
│ [High protein] [15 min]          │  ← tag chips
└──────────────────────────────────┘
```

- Time badge: monospace, glass chip style
- Kcal: lime colour, right-aligned
- Ingredient list: bullet points, dim text
- Tags: small glass chips

---

## 11. Prep Page — Spec

Each step card:
```
┌────┬──────────────────────────────┐
│ 01 │ Batch Chicken                 │
│    │ Description text...           │
│    │ [⏱ 25 min]                    │
└────┴──────────────────────────────┘
```

- Step number: lime-background square, Archivo 900 white number
- Time badge: teal-tinted chip

---

## 12. Grocery Page — Spec

Category tabs: pill style, active = lime bg + black text

Each grocery item:
```
┌──────────────────────────────────┐
│ [✓] Chicken breast          1.5kg│
└──────────────────────────────────┘
```

- Checkbox: animated from border-only → lime-filled with `✓` on check
- Item crosses out with line-through + opacity fade when checked
- Quantity: right-aligned, mono, dim

---

## 13. Supplements Page — Spec

Daily schedule at top (timeline card with time rows)

Each supplement card:
```
┌──────────────────────────────────┐
│ ● Creatine Monohydrate  [Have it]│
│ ─────────────────────────────── │
│ Why it works (body text dim)     │
│ [Post-workout] [5g dose]         │  ← timing chips (teal)
└──────────────────────────────────┘
```

- Status badge: "Have it" = lime chip, "Need to buy" = orange chip
- Timing chips: teal tinted

---

## 14. Bottom Navigation — Spec

```
┌──────────────────────────────────┐
│ [🏠] [📊] [🍽] [⏱] [🛒] [💊]   │
│  Home Phases Meals Prep Groc Sup │
└──────────────────────────────────┘
```

Active state:
- Icon + label wrapped in a lime-tinted pill background
- Label turns lime coloured
- Icon scales up slightly

Inactive state:
- Opacity 0.40, greyscale filter on icon
- No background

---

## 15. File-by-File Change Summary

| File | Type of change |
|------|----------------|
| `index.html` | Add Archivo Google Font `<link>` tags |
| `app.html` | Add Archivo Google Font `<link>` tags |
| `css/tokens.css` | Add `--font-display`, glow tokens, spring easing, surface vars, phase colours |
| `css/components.css` | Glass inner highlight, button gradient+glow, chip glow, new `.hero-stat`, `.eyebrow`, `.phase-badge`, shimmer progress |
| `css/onboarding.css` | Full redesign: splash hero, large typography, premium lang cards, stat reveal |
| `css/app.css` | Full redesign: home hero, phase cards, meal cards, timeline schedule, prep steps, supp cards, grocery items, premium nav |
| `js/onboarding.js` | Template improvements: emoji goals/diet, giant number display, loading stat reveals |
| `js/app.js` | SVG icon nav, pill active state |
| `js/pages/home.js` | Gradient hero, stat bar, timeline schedule, quick nav cards with icons |
| `js/pages/phases.js` | Colour-coded phase cards, macro grid, decorative phase number |
| `js/pages/meals.js` | Time badge, prominent kcal, better ingredient list, tags |
| `js/pages/supps.js` | Daily schedule view, status badges, timing chips |
| `js/pages/grocery.js` | Animated checkbox, quantity display, better category tabs |
| `js/pages/prep.js` | Numbered step cards with lime number block + teal time badge |

---

*Redesign implemented May 2026. Design direction: Dark Athletic Premium. Reference app HTML provided by user.*
