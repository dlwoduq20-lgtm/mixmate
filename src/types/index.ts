// Core domain types for MIXMATE

export interface Ingredient {
  id: string
  name: string
  aliases: string[]
  category: string
  popular: boolean
}

export interface RecipeIngredient {
  ingredientId: string
  name: string
  amount: number | null
  unit: string
  required: boolean
}

export interface FlavorProfile {
  sweet: number
  sour: number
  bitter: number
  strong: number
  refreshing: number
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Method = 'Build' | 'Stir' | 'Shake' | 'Blend'

export interface Cocktail {
  id: string
  name: string
  aliases: string[]
  category: string
  baseSpirit: string
  description: string
  ingredients: RecipeIngredient[]
  optionalIngredients: RecipeIngredient[]
  glass: string
  method: Method
  garnish: string
  instructions: string[]
  flavorProfile: FlavorProfile
  difficulty: Difficulty
  preparationTime: number
  abv: number
  foodPairings: string[]
  popularity: number
  season: string[]
  tags: string[]
}

export type MatchStatus = 'READY' | 'ONE_AWAY' | 'TWO_AWAY' | 'POSSIBLE' | 'UNAVAILABLE'

// A required ingredient the recipe calls for that isn't owned, but is
// covered because the user owns a listed flavor-similar stand-in for it
// (src/data/substitutions.ts). Only populated when matching is run with
// `useSubstitutes: true` — see src/lib/matching.ts.
export interface SubstitutedIngredient {
  ingredientId: string
  substituteId: string
}

export interface CocktailMatch {
  cocktail: Cocktail
  ownedCount: number
  requiredCount: number
  missingCount: number
  missingIngredients: RecipeIngredient[]
  substitutedIngredients: SubstitutedIngredient[]
  matchRatio: number
  status: MatchStatus
}

export interface RecentlyMadeEntry {
  cocktailId: string
  madeAt: number
}

export interface ShoppingListItem {
  ingredientId: string
  purchased: boolean
  addedAt: number
}

export interface UserPreferences {
  moodFlavors: string[]
}
