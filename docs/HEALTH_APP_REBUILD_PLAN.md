# Health App Rebuild Plan — SvelteKit PWA + Nothing OS–Inspired Design

**Project:** `ruddvz/Health`  
**Goal:** Replace the oversized single `index.html` with a clean, modern, component-based PWA that still deploys to GitHub Pages.  
**Design direction:** Nothing OS–inspired: monochrome, dot-matrix details, red accent, modular widgets, strict grid, tactile cards, minimal clutter.

---

## 1. Direct Answer

No, the app does **not** need to be written as one giant HTML file.

GitHub Pages ultimately serves static files, but you can build those static files from a better language/framework first.

### Best new setup

Use:

- **SvelteKit**
- **TypeScript**
- **Vite**
- **SvelteKit static adapter**
- **Vite PWA plugin**
- **CSS variables / custom design system**
- **LocalStorage first, IndexedDB later**
- **GitHub Actions deploy to GitHub Pages**

The app will still deploy as:

```text
HTML + CSS + JavaScript + manifest + service worker
```

But you will no longer manually write one massive `index.html`.

You write clean files like:

```text
src/routes/+page.svelte
src/lib/components/TodayDashboard.svelte
src/lib/components/MealCard.svelte
src/lib/components/NothingWidget.svelte
src/lib/stores/plan.ts
src/lib/validation/validatePlan.ts
src/lib/styles/tokens.css
```

Then the build process outputs a static site, and GitHub Pages hosts that.

---

## 2. Best Framework Choice

## Recommended: SvelteKit + TypeScript

This is the best fit for this project because:

- The app is mostly local-first UI.
- The plan is data-heavy.
- You need clean components.
- You want mobile/PWA polish.
- You do not need a backend yet.
- Svelte creates less UI boilerplate than React.
- Svelte stores are simple for local plan state.
- SvelteKit can export to static files for GitHub Pages.
- It keeps the app fast on iPhone.

### Why not stay with plain HTML?

The current one-file approach becomes painful because everything is mixed together:

- HTML
- CSS
- app state
- validation
- rendering
- PWA logic
- JSON parsing
- screens
- components

This creates:

- huge file size
- hard debugging
- duplicated styles
- inconsistent UI
- slow future development
- higher chance of breaking one screen while editing another

### Why not React?

React is also fine, especially with Vite. But for this project, SvelteKit is cleaner because:

- Less boilerplate.
- Easier component files.
- Smaller mental overhead.
- Good for mobile dashboards.
- Better fit for a single-user local-first PWA.

Use React only if the person implementing is much stronger in React.

---

## 3. Final Stack

```text
Framework:       SvelteKit
Language:        TypeScript
Build tool:      Vite
Deployment:      GitHub Pages via GitHub Actions
PWA:             vite-plugin-pwa
Styling:         CSS variables + component CSS
Validation:      TypeScript validator or Zod
State:           Svelte stores
Storage:         localStorage first, IndexedDB later
Charts:          lightweight SVG/custom charts first
Icons:           custom CSS/dot icons, not heavy icon packs
```

### Optional packages

Use very few dependencies.

Recommended:

```text
@sveltejs/adapter-static
vite-plugin-pwa
zod
lucide-svelte only if needed
```

Avoid heavy UI libraries. The visual identity should be custom.

---

## 4. New Repo Structure

Replace the single-file app with this:

```text
Health/
  .github/
    workflows/
      pages.yml

  public/
    manifest.webmanifest
    offline.html
    icons/
      icon-192.png
      icon-512.png
      maskable-512.png
    samples/
      rudra-plan-v2.json

  src/
    app.html

    routes/
      +layout.svelte
      +page.svelte

    lib/
      components/
        app/
          AppShell.svelte
          BottomNav.svelte
          TopStatusBar.svelte
          InstallPrompt.svelte
          OfflineBanner.svelte

        nothing/
          DotMatrix.svelte
          DotHeading.svelte
          NothingWidget.svelte
          RedActionButton.svelte
          MetricTile.svelte
          GlyphProgress.svelte
          SegmentedControl.svelte
          TickerText.svelte

        intake/
          IntakeFlow.svelte
          IntakeStep.svelte
          GoalCards.svelte
          ScheduleStep.svelte
          FoodPreferencesStep.svelte
          PromptGenerator.svelte

        today/
          TodayDashboard.svelte
          NextActionCard.svelte
          TodayTimeline.svelte
          MacroGrid.svelte
          WaterWidget.svelte
          SupplementStrip.svelte
          PlanWarningCard.svelte

        meals/
          MealsScreen.svelte
          MealCard.svelte
          IngredientList.svelte
          MacroRepair.svelte
          MealSwapSheet.svelte
          CookingMode.svelte

        training/
          TrainingScreen.svelte
          WorkoutCard.svelte
          ExerciseTracker.svelte
          SetLogger.svelte
          RestTimer.svelte
          ProgressionHint.svelte

        progress/
          ProgressScreen.svelte
          WeightTrend.svelte
          CheckInForm.svelte
          RedFlagEngine.svelte
          PhotoReminder.svelte

        system/
          SystemScreen.svelte
          GroceryScreen.svelte
          PrepScreen.svelte
          SupplementsScreen.svelte
          SettingsScreen.svelte
          PrivacyScreen.svelte

      stores/
        plan.ts
        settings.ts
        progress.ts
        grocery.ts
        ui.ts

      validation/
        schema.ts
        validatePlan.ts
        migrateV1ToV2.ts
        warnings.ts

      logic/
        nutrition.ts
        schedule.ts
        macroRepair.ts
        training.ts
        progress.ts
        safety.ts

      storage/
        localStorage.ts
        indexedDb.ts
        exportData.ts

      styles/
        tokens.css
        global.css
        nothing.css
        utilities.css

      types/
        plan.ts
        user.ts
        nutrition.ts
        training.ts
        grocery.ts
        progress.ts

  package.json
  svelte.config.js
  vite.config.ts
  tsconfig.json
  README.md
  CHANGELOG.md
```

---

## 5. GitHub Pages + PWA Architecture

GitHub Pages cannot run a live backend server for this app. It can host the finished static app.

That means:

- No server database from GitHub Pages alone.
- No private cloud sync from GitHub Pages alone.
- No server-side AI calls unless an external service is added later.

That is fine for this product.

The current product should stay:

```text
local-first + offline-first + PWA + user uploads JSON
```

### Build flow

```text
Developer writes Svelte/TypeScript
        ↓
npm run build
        ↓
SvelteKit exports static files
        ↓
GitHub Actions uploads build artifact
        ↓
GitHub Pages serves app
        ↓
User installs it as PWA
        ↓
Plan data stays local on device
```

---

## 6. Setup Commands

Start fresh in a new branch:

```bash
git checkout -b rebuild/sveltekit-nothing-os
npx sv create . --template minimal --types ts --add prettier eslint vitest sveltekit-adapter="adapter:static" --install npm --no-dir-check
npm install -D vite-plugin-pwa
npm install zod
```

Choose:

```text
Skeleton project
TypeScript: yes
ESLint: yes
Prettier: yes
Playwright: optional
Vitest: yes
```

---

## 7. SvelteKit Static Config

Create `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: dev ? '' : '/Health'
		}
	}
};

export default config;
```

Why `base: '/Health'` matters:

```text
https://ruddvz.github.io/Health/
```

Your assets must resolve under `/Health/`.

---

## 8. Vite PWA Config

Create `vite.config.ts`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'prompt',
			includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'offline.html'],
			manifest: {
				name: 'Health — Personal Plan',
				short_name: 'Health',
				description: 'Private offline health plan companion',
				start_url: '/Health/',
				scope: '/Health/',
				display: 'standalone',
				background_color: '#0b0b0b',
				theme_color: '#0b0b0b',
				orientation: 'portrait',
				categories: ['health', 'fitness', 'lifestyle'],
				icons: [
					{
						src: '/Health/icons/icon-192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/Health/icons/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,png,svg,webp,json}'],
				navigateFallback: '/Health/offline.html'
			}
		})
	]
});
```

---

## 9. GitHub Actions Deploy

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy SvelteKit PWA to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 10. Nothing OS–Inspired Design Direction

This should be inspired by Nothing OS, not a direct copy.

### Core aesthetic

Use:

- Monochrome base
- Deep black background
- White typography
- Muted grey surfaces
- Red accent
- Dot-matrix decoration
- Strict grid
- Modular widgets
- Minimal icons
- Strong negative space
- Thin outlines
- Industrial dashboard feeling
- Square/circle geometry
- Micro-interactions that feel mechanical

Avoid:

- Too many gradients
- Glassmorphism everywhere
- Random neon colors
- Generic fitness-app green
- Too many emojis
- Cluttered badges
- Long paragraphs on cards

### Visual mood

The app should feel like:

```text
Nothing OS widget dashboard
+ Apple Health clarity
+ Garmin data seriousness
+ a meal-prep command center
```

---

## 11. Design Tokens

Create `src/lib/styles/tokens.css`:

```css
:root {
	color-scheme: dark;

	--bg: #0b0b0b;
	--bg-grid: #101010;

	--surface-1: #121212;
	--surface-2: #181818;
	--surface-3: #202020;

	--text-1: #f4f4f0;
	--text-2: #b9b9b2;
	--text-3: #777771;

	--line-1: rgba(255, 255, 255, 0.08);
	--line-2: rgba(255, 255, 255, 0.16);

	--red: #ff2a2a;
	--red-soft: rgba(255, 42, 42, 0.14);

	--white-soft: rgba(255, 255, 255, 0.92);
	--black-soft: rgba(0, 0, 0, 0.55);

	--ok: #f4f4f0;
	--warning: #ffcc4d;
	--danger: #ff2a2a;
	--info: #c9c9c9;

	--radius-xs: 8px;
	--radius-sm: 12px;
	--radius-md: 18px;
	--radius-lg: 28px;
	--radius-xl: 36px;

	--space-1: 4px;
	--space-2: 8px;
	--space-3: 12px;
	--space-4: 16px;
	--space-5: 20px;
	--space-6: 24px;
	--space-8: 32px;

	--font-ui:
		Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
	--font-mono: 'SF Mono', 'Roboto Mono', 'IBM Plex Mono', monospace;

	--safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

### Dot matrix background

```css
body {
	margin: 0;
	background:
		radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0), var(--bg);
	background-size: 18px 18px;
	color: var(--text-1);
	font-family: var(--font-ui);
}
```

Use this carefully. If it becomes noisy, restrict dot matrix to headers and hero cards only.

---

## 12. Nothing-Style Components

## 12.1 Dot Heading

Used for major screen titles:

```text
TODAY_
MEALS_
TRAIN_
PROGRESS_
SYSTEM_
```

Style:

- uppercase
- mono font
- letter spacing
- dot texture
- red cursor/accent
- not used for long body text

Dot-matrix style should be decorative, not the main reading font. Accessibility matters.

---

## 12.2 Widget Card

Every dashboard module should feel like a Nothing OS widget.

```svelte
<NothingWidget title="PROTEIN" value="126g" meta="49g left" variant="metric" />
```

Widget style:

- black/grey card
- thin border
- square-ish radius
- large metric
- tiny mono label
- red accent only for important action or warning
- no colorful chart chaos

---

## 12.3 Glyph Progress

Use for:

- calories
- protein
- water
- weekly progress
- prep completion
- workout sets

Visual:

```text
● ● ● ● ● ○ ○ ○ ○ ○
```

or vertical dot progress:

```text
●
●
●
○
○
```

This gives a Nothing OS feeling without copying exact UI.

---

## 12.4 Red Action Button

Primary action buttons should use the red accent.

Examples:

- `START WORKOUT`
- `VIEW NEXT MEAL`
- `UPLOAD PLAN`
- `BEGIN PREP`
- `CHECK IN`

Style:

- black or red fill
- mono uppercase label
- tactile press state
- small arrow or dot indicator

---

## 12.5 Command Strip

At the top of Today:

```text
LOCAL ONLY   OFFLINE READY   WEEK 01   WORKOUT DAY
```

This gives a system-panel feeling.

---

## 13. App Information Architecture

Use 5 bottom tabs:

1. **Today**
2. **Meals**
3. **Train**
4. **Progress**
5. **System**

Rename “More” to **System** to match the operating-system feel.

### System contains

- Plan phases
- Grocery
- Prep
- Supplements
- Settings
- Import/export
- Privacy
- Debug/validation
- About

---

## 14. New Screen Design

(See original brief for Today, Meals, Training, Progress, and System screen wireframes and rules.)

---

## 15. Data Architecture

### Stores

Create `src/lib/stores/plan.ts` with `writable` / `derived` stores for plan, active day type, phase, and `currentTargets`.

Create separate stores for:

```text
settings.ts
progress.ts
grocery.ts
prep.ts
ui.ts
```

Do not put everything in one global object.

---

## 16. Plan Validation

Validation levels: **ERROR**, **WARNING**, **INFO**.

Add a System diagnostics view with counts, message list, and actions (fix prompt, export normalized JSON).

---

## 17. Migration Strategy

```text
main
  current stable HTML app

rebuild/sveltekit-nothing-os
  new SvelteKit version

archive/html-v1
  backup of old one-file version
```

### Migration steps

1. Create new SvelteKit app in the same repo.
2. Move old `index.html` to `legacy/index.html`.
3. Keep old icons and manifest as starting assets.
4. Rebuild visual shell first.
5. Add JSON upload and validation.
6. Add Today screen.
7. Add Meals screen.
8. Add System screen.
9. Add Training and Progress.
10. Replace GitHub Pages workflow.
11. Test live.
12. Merge into main.

**Current branch work:** `legacy/` holds the previous single-file app and its PWA files for reference until feature parity.

---

## 18. Build Order (Phases 1–8)

Phase 1 — Foundation: SvelteKit, static adapter, `/Health` base, PWA, tokens, shell, bottom nav, install/offline UI — **initial implementation on branch `cursor/sveltekit-health-rebuild-0438`.**

Phases 2–8: Import/validation, Today, Meals, Training, Progress, Grocery/prep/supplements, Polish/QA — as detailed in the original plan.

---

## 19–25. Visual Rules, Example Copy, Component APIs, Prompt Strategy, Security, README, Recommendation

Unchanged from the original specification: red usage, dot-matrix limits, widget layout, example UI copy, `NothingWidget` / `MealCard` / `GlyphProgress` APIs, stricter Claude JSON prompt rules, local-first privacy (no external fonts/scripts by default), README topics, and final recommendation to ship a **Nothing OS health command center** PWA.

---

## Tracking

| Item                     | Status                                    |
| ------------------------ | ----------------------------------------- |
| Plan document            | This file                                 |
| Legacy snapshot          | `legacy/`                                 |
| SvelteKit + static + PWA | Phase 1 (shell shipped on rebuild branch) |
| Import + Zod validation  | Phase 2                                   |
| Today dashboard          | Phase 3                                   |
| …                        | See §18                                   |
