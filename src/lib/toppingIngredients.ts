import type { RecipeIngredient } from '../types'

// Ingredients that are always poured in last — directly into the glass —
// rather than shaken, stirred, or blended with the rest of the recipe:
// carbonated/sparkling mixers (which would go flat or fizz over) and a
// wine float (which needs to sit on top, not mix in). This applies
// regardless of whether the ingredient is required or optional, and
// regardless of the cocktail's `method` — a Moscow Mule's ginger beer and
// a French 75's Champagne both get added after the shake/stir/blend step,
// never during it. (Build-method drinks already pour everything directly
// into the glass in one motion, so this split doesn't change anything for
// them — it only matters for Shake/Stir/Blend.)
const TOPPING_INGREDIENT_IDS = new Set([
  'soda-water',
  'tonic-water',
  'ginger-beer',
  'ginger-ale',
  'cola',
  'lemon-lime-soda',
  'champagne',
  'prosecco',
  'beer',
  'red-wine',
  'white-wine',
])

export function isToppingIngredient(ingredientId: string): boolean {
  return TOPPING_INGREDIENT_IDS.has(ingredientId)
}

// Splits a cocktail's required ingredients into what gets shaken/stirred/
// blended together vs. what gets poured on top afterward.
export function splitToppings(ingredients: RecipeIngredient[]): { main: RecipeIngredient[]; toppings: RecipeIngredient[] } {
  const main: RecipeIngredient[] = []
  const toppings: RecipeIngredient[] = []
  for (const ing of ingredients) {
    ;(isToppingIngredient(ing.ingredientId) ? toppings : main).push(ing)
  }
  return { main, toppings }
}
