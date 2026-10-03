// Temporary rollout flags.

// Korean-only launch: hides the EN/KO language switcher and forces the app
// to Korean regardless of the visitor's browser language or any previously
// stored choice. The English translation itself is complete (UI strings in
// en.ts, cocktail names, ingredient/category names, and the per-cocktail
// "story" and ingredient-substitution content all have English versions —
// see src/i18n/cocktailStories.en.ts and the `note` field in
// src/data/substitutions.ts) and was verified end-to-end with the switcher
// temporarily flipped on. Flip this to `true` whenever you want to actually
// launch English (see src/i18n/config.ts and
// src/components/LanguageSwitcher.tsx) — no further translation work is
// required first.
export const ENABLE_LANGUAGE_SWITCHER = false

// Shopping List: hidden per product decision (2026-09-30) — the feature
// itself works (add/remove/mark-purchased, move-purchased-to-My-Bar, all
// persisted via useAppStore.shoppingList), but it's just a bare checklist
// with no real purchase path behind it, so it isn't ready to show users
// yet. This flag hides every entry point into it:
//   - the shopping-cart icon + badge in My Bar's header (src/pages/MyBar.tsx)
//   - the "add to shopping list" button in the missing-ingredients box on
//     the cocktail detail page (src/pages/CocktailDetail.tsx)
//   - the "add to shopping list" button on the Next Ingredient page
//     (src/pages/NextIngredient.tsx)
//   - the "add to shopping list" button on Home's ingredient-checklist
//     cards (src/components/IngredientChecklistCard.tsx)
// The /shopping-list route, the ShoppingList page, and the store logic are
// all left intact and working — only linked from nowhere in the UI while
// this is false. Per the product roadmap discussion, the plan is to build
// this into a real "missing ingredient -> buy it" flow (e.g. affiliate
// links to 쿠팡/네이버/온라인 주류몰) before flipping this back on, rather
// than re-exposing the current bare checklist as-is.
export const ENABLE_SHOPPING_LIST = false
