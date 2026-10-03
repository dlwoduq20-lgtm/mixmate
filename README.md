# MIXMATE — Cocktail Discovery App

"What's in your bar?" — pick the ingredients you own and MIXMATE tells you
what you can make right now, what you're one ingredient away from, and walks
you through mixing it, step by step.

## What this is

A real, working React + TypeScript app (not a mockup): 253 real cocktail
recipes (each with a real photo), a live ingredient-matching engine,
favorites, and a full step-by-step Mixing Mode with timers — all persisted
locally so it survives a refresh. (A shopping list that feeds back into
your bar exists in the code too, but is currently hidden from the UI — see
"Hidden / not yet enabled" below.)

A live build of this app is already hosted as a Claude Artifact (see the
link shared in your conversation) — open it on your phone and it just works.
This folder is the source, for when you want to customize it or build it as
an installable Android app.

## Run it locally

```
npm install
npm run dev       # http://localhost:5173
```

## Build

```
npm run build              # standard multi-file build -> dist/
npm run build:singlefile   # everything inlined into one HTML file -> dist-single/
```

## Project layout

- `src/data/` — the cocktail (253) and ingredient (135) databases. Generated
  from real recipes; edit these files directly to add/change drinks.
- `src/lib/matching.ts` — the "what can I make" recommendation engine
  (READY / ONE_AWAY / TWO_AWAY / POSSIBLE / UNAVAILABLE), next-ingredient
  suggestions, and "most useful ingredients."
- `src/lib/mixingSteps.ts` — turns a recipe into the step-by-step screens
  used by Mixing Mode.
- `src/store/useAppStore.ts` — Zustand store (My Bar, Favorites, Shopping
  List, Recently Viewed/Made) persisted to `localStorage`.
- `src/pages/` — one file per screen (Home, MyBar, CocktailDiscovery,
  CocktailDetail, MixingMode, Favorites, ShoppingList, NextIngredient).
- `src/lib/cocktailImages.ts` — maps a cocktail id to its real photo in
  `src/assets/cocktails/` (all 253 currently have one, as `.webp` — chosen
  over `.jpg` for ~48% smaller files at visually identical quality; the
  glob also accepts `.jpg`/`.jpeg`/`.png` for anything added later). Uses
  Vite's `import.meta.glob` with `eager: true` so photos are inlined as
  `data:` URIs by `vite-plugin-singlefile` in the single-file build used
  for the Claude Artifact / standalone `mixmate.html` — this is
  intentional, not an oversight, and shouldn't be changed to lazy loading
  without a separate build strategy for that target. The regular
  `npm run build` output is unaffected by this — Vite already emits each
  photo as its own small hashed file there, fetched natively lazily
  (`loading="lazy"` on the `<img>`), so this is a non-issue for the real
  deploy/App Store path. At a much larger cocktail count (thousands+),
  moving photos to an external image host/CDN instead of shipping them in
  the repo/app bundle will become necessary — not done yet.
- `src/components/CocktailGlass.tsx` — the generated, consistent-style SVG
  cocktail illustration used as a fallback for any cocktail without a real
  photo, colored by base spirit and flavor.
- `src/config/app.ts` — the app name/tagline as a single setting, so
  renaming away from "MIXMATE" later is a one-line change.

## Turning this into an Android app (Capacitor)

The app is plain client-side React with `localStorage` persistence, which
Capacitor wraps cleanly. This repo doesn't include the native Android
project (it requires the Android SDK/Gradle, which isn't available in the
environment this was built in), but the JS side is ready:

```
npm install -D @capacitor/core @capacitor/cli @capacitor/android
npx cap init "MIXMATE" "com.yourcompany.mixmate" --web-dir=dist
npm run build
npx cap add android
npx cap sync
npx cap open android   # opens Android Studio, where you can build the APK
```

## Notes on data

Every recipe's flavor profile, estimated ABV, difficulty, prep time, and
food pairings are derived from its actual ingredient list (amounts, base
spirit, method) rather than hand-typed per drink, so they stay consistent
across all 253 cocktails. Feel free to hand-tune any specific entry in
`src/data/cocktails.ts`.

All 253 recipes were audited for consistency (2026-09-30): every ingredient
reference resolves, every cocktail has an image/Korean name/Korean+English
story, and all category/unit/glass/garnish/food-pairing vocabulary used in
the data has a Korean translation — zero gaps. The audit did catch one real,
now-fixed bug: 17 cocktails (Mimosa, Kir, Kir Royale, Bellini, French 75,
Negroni Sbagliato, and others in the Champagne/wine-topped family) had their
defining sparkling wine or wine listed as an *optional* ingredient rather
than required, so the "what can I make" matcher would call them READY
without any bubbly at all (e.g. a Mimosa needed only orange juice). Fixed by
moving that ingredient into the required list for all 17. While fixing it,
also generalized the "top with X, poured in after the shake/stir/blend, not
mixed in" step (`src/lib/toppingIngredients.ts`, used by
`src/lib/mixingSteps.ts` and `src/lib/koInstructions.ts`) to work for any
method, not just Build — previously a Shake-method drink's required
carbonated ingredient (e.g. Kentucky Buck's ginger beer) was incorrectly
shaken together with everything else instead of topped after straining, and
an optional ingredient on a non-Build drink (e.g. Kentucky Buck's bitters)
was silently dropped from the recipe steps entirely.

## Notes on Korean localization

The app currently ships Korean-only. The UI strings, ingredient names,
units, categories, food pairings, recipe steps, and all 253 cocktail
*names* (`src/i18n/cocktailNames.ko.ts`) are localized to Korean
(`src/i18n/`), all wired through the `useLocalize()` hook
(`src/i18n/localize.ts`). The search boxes in Discovery and My Bar match
against these localized strings too — including cocktail names — so
searching in Korean (e.g. "보드카" or "마가리타") finds the same results as
searching in English.

## Notes on English readiness

English content is fully prepared but not yet turned on. Every piece of
Korean-only content has an English counterpart: the 159 UI strings
(`src/i18n/en.ts`), cocktail names/ingredients/categories (plain English,
the app's underlying data), the per-cocktail "story" blurbs
(`src/i18n/cocktailStories.en.ts`, mirroring `cocktailStories.ko.ts`), and
the ingredient-substitution tips (the `note` field alongside `noteKo` in
`src/data/substitutions.ts`). This was verified end-to-end with the
language switcher temporarily enabled (all cocktails checked for Korean
text leakage, story sections, substitution tips, and switcher round-trip).

The `ENABLE_LANGUAGE_SWITCHER` flag in `src/config/featureFlags.ts` is
currently `false` (Korean-only launch), which also hardcodes
`src/i18n/config.ts` to `lng: 'ko'` regardless of browser language or any
stored preference. Flip it to `true` whenever you want to actually launch
English — no further translation work is required first.

## Analytics

Basic page-view tracking via Google Analytics 4 (property "MIXMATE Web",
measurement ID `G-W1FTWVW53V`, created 2026-09-30). Because the app is a
single-page app using `HashRouter` (routes are `#/cocktail/x`, not real page
loads), GA's automatic pageview tracking is turned off and a `page_view`
event is sent manually on every route change instead — see
`src/lib/analytics.ts` (the gtag.js setup) and the `ScrollToTop` component
in `src/App.tsx` (fires on every route change already, for the scroll
reset, so tracking rides along on the same hook). Only page views are
tracked for now — no custom events (cocktail views, mixing started, etc.)
yet; that can be added the same way (`trackPageView` in `src/lib/analytics.ts`
is the pattern to copy for a `trackEvent` helper) if finer-grained data is
wanted later.

`ENABLE_ANALYTICS` in `src/config/analytics.ts` is the master switch — set
to `false` to stop sending data entirely (e.g. while developing locally).
The measurement ID itself is not a secret (it's meant to be public,
client-side, and shows up in the page source either way), so it's just a
plain constant rather than an env var.

New data can take up to 48 hours to show up in standard GA4 reports the
first time a property is created; after that it's near-real-time.

## Error tracking

Two layers, both wired through a single `reportError()` entry point
(`src/lib/errorTracking.ts`), so every error ends up in both places no
matter where it's caught:

- **`ErrorBoundary`** (`src/components/ErrorBoundary.tsx`, wraps the whole
  app in `main.tsx`) catches React render crashes and shows a friendly
  Korean fallback screen ("문제가 발생했어요" / "처음으로 돌아가기") instead of a
  blank white page.
- **Global handlers** (`installGlobalErrorTracking()`, also called from
  `main.tsx`) catch everything React's boundary can't: uncaught exceptions
  (`window.onerror`) and unhandled promise rejections.

Each error is sent to GA4 as a standard `exception` event (Reports >
Engagement > Events > exception) — good for "is this happening a lot," but
GA4 can take up to 48h to show new data and truncates the description. For
immediate, full-detail debugging on a real device, every error is also kept
locally (`src/lib/errorLog.ts`, last 30, in `localStorage`) and viewable at
the hidden **`#/debug/errors`** page (not linked from any nav — go there
directly by URL) — message, full stack trace, and which screen it happened
on, with a "전체 삭제" button to clear the log.

## Known issue: AI-generated photo artifacts

Some of the 253 cocktail photos have a visible defect baked into the image
itself from the AI generation process — a faint rectangular band/seam
(sometimes a torn-edge overlay, sometimes a straight vertical background
seam) rather than a clean photo. Confirmed present in at least
`waldorf-cocktail.webp`, `caipiroska.webp`, and `mai-tai.webp` from a small
manual sample (spot-checking ~7 of 253); two automated detection scripts
(pixel-variance and background-color heuristics) were tried and both proved
unreliable — one flagged over half the images as false positives, the other
missed even the known-real cases — so this isn't fully scoped yet. Given
that, this is tracked as a known issue rather than auto-detected: the real
fix is either regenerating the affected photos or re-running the whole
253-image batch through a cleaner generation pass, which is a separate,
larger piece of work, not a quick data fix.

## Hidden / not yet enabled

Features that exist in the code and work, but are deliberately hidden from
the UI via a flag in `src/config/featureFlags.ts` rather than shipped
half-finished. Flipping the flag back to `true` is enough to re-enable
each one — no rebuild of the feature itself is needed. Add to this list
any time something new gets hidden this way, so it doesn't get forgotten.

- **`ENABLE_SHOPPING_LIST`** (`false`) — the Shopping List: add/remove
  items, mark purchased, move purchased items back into My Bar, all
  persisted (`useAppStore.shoppingList`). Hidden because it's currently
  just a bare checklist with no real purchase path behind it. Every entry
  point into it (the cart icon in My Bar's header, and the "add to
  shopping list" buttons on the cocktail detail page, the Next Ingredient
  page, and Home's ingredient-checklist cards) is gated on this flag; the
  `/shopping-list` route and page are still there, just unlinked. Plan:
  build this into an actual "missing ingredient → buy it" flow (e.g.
  affiliate links to a retailer) before turning it back on.
