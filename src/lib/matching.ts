import type { Cocktail, CocktailMatch, MatchStatus, SubstitutedIngredient } from '../types'
import { getSubstitutes } from '../data/substitutions'

// Note: garnish/ice-type ingredients are modeled as `optionalIngredients` in
// the data layer already, so the core match calculation below only ever
// looks at `required` ingredients — no separate "soft category" filtering
// is needed here.

export function statusFor(ownedCount: number, requiredCount: number): MatchStatus {
  if (requiredCount === 0) return 'READY'
  const missing = requiredCount - ownedCount
  const ratio = ownedCount / requiredCount
  if (missing <= 0) return 'READY'
  if (missing === 1) return 'ONE_AWAY'
  if (missing === 2) return 'TWO_AWAY'
  if (ratio >= 0.6) return 'POSSIBLE'
  return 'UNAVAILABLE'
}

export interface MatchOptions {
  // When true, a required ingredient the user doesn't own but has a listed
  // flavor-similar stand-in for (src/data/substitutions.ts) counts toward
  // ownedCount/status instead of missingCount, and is reported in
  // `substitutedIngredients` so the UI can show which swap is in play.
  // Defaults to false (substitutes are informational-only), matching the
  // app's original behavior — callers opt in explicitly.
  useSubstitutes?: boolean
}

export function matchCocktail(
  cocktail: Cocktail,
  owned: Set<string>,
  opts: MatchOptions = {},
): CocktailMatch {
  const required = cocktail.ingredients
  const requiredCount = required.length
  const missingIngredients: typeof required = []
  const substitutedIngredients: SubstitutedIngredient[] = []
  let ownedCount = 0

  for (const r of required) {
    if (owned.has(r.ingredientId)) {
      ownedCount++
      continue
    }
    if (opts.useSubstitutes) {
      const standIn = getSubstitutes(r.ingredientId).find((s) => owned.has(s.ingredientId))
      if (standIn) {
        ownedCount++
        substitutedIngredients.push({ ingredientId: r.ingredientId, substituteId: standIn.ingredientId })
        continue
      }
    }
    missingIngredients.push(r)
  }

  const missingCount = missingIngredients.length
  const matchRatio = requiredCount === 0 ? 1 : ownedCount / requiredCount
  const status = statusFor(ownedCount, requiredCount)
  return {
    cocktail,
    ownedCount,
    requiredCount,
    missingCount,
    missingIngredients,
    substitutedIngredients,
    matchRatio,
    status,
  }
}

const STATUS_RANK: Record<MatchStatus, number> = {
  READY: 0,
  ONE_AWAY: 1,
  TWO_AWAY: 2,
  POSSIBLE: 3,
  UNAVAILABLE: 4,
}

export function getMatchingCocktails(
  cocktails: Cocktail[],
  selectedIngredients: Set<string>,
  opts: { includeUnavailable?: boolean; sortBy?: 'match' | 'popularity' | 'quick'; useSubstitutes?: boolean } = {},
): CocktailMatch[] {
  const matches = cocktails.map((c) => matchCocktail(c, selectedIngredients, { useSubstitutes: opts.useSubstitutes }))
  const filtered = opts.includeUnavailable
    ? matches
    : matches.filter((m) => m.status !== 'UNAVAILABLE')

  const sortBy = opts.sortBy ?? 'match'
  filtered.sort((a, b) => {
    if (sortBy === 'popularity') return b.cocktail.popularity - a.cocktail.popularity
    if (sortBy === 'quick') {
      const t = a.cocktail.preparationTime - b.cocktail.preparationTime
      if (t !== 0) return t
    }
    const rankDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status]
    if (rankDiff !== 0) return rankDiff
    if (b.matchRatio !== a.matchRatio) return b.matchRatio - a.matchRatio
    return b.cocktail.popularity - a.cocktail.popularity
  })
  return filtered
}

export interface NextIngredientSuggestion {
  ingredientId: string
  unlockedCocktails: Cocktail[]
}

// For every ingredient the user does NOT own, compute how many currently
// not-READY cocktails would flip to READY if it were added. Returns the
// suggestions sorted by biggest unlock, descending.
export function getNextIngredientSuggestions(
  cocktails: Cocktail[],
  selectedIngredients: Set<string>,
  allIngredientIds: string[],
  limit = 10,
  opts: MatchOptions = {},
): NextIngredientSuggestion[] {
  const candidates = allIngredientIds.filter((id) => !selectedIngredients.has(id))
  const results: NextIngredientSuggestion[] = []

  for (const candidateId of candidates) {
    const withCandidate = new Set(selectedIngredients)
    withCandidate.add(candidateId)
    const unlocked: Cocktail[] = []
    for (const cocktail of cocktails) {
      const before = matchCocktail(cocktail, selectedIngredients, opts)
      if (before.status === 'READY') continue
      const after = matchCocktail(cocktail, withCandidate, opts)
      if (after.status === 'READY') unlocked.push(cocktail)
    }
    if (unlocked.length > 0) {
      results.push({ ingredientId: candidateId, unlockedCocktails: unlocked })
    }
  }
  results.sort((a, b) => b.unlockedCocktails.length - a.unlockedCocktails.length)
  return results.slice(0, limit)
}

// "Most useful ingredients" — how many total cocktails (required list) use
// each owned ingredient, sorted descending.
export function mostUsefulIngredients(
  cocktails: Cocktail[],
  selectedIngredients: Set<string>,
): { ingredientId: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const id of selectedIngredients) counts.set(id, 0)
  for (const cocktail of cocktails) {
    for (const ing of cocktail.ingredients) {
      if (counts.has(ing.ingredientId)) {
        counts.set(ing.ingredientId, (counts.get(ing.ingredientId) ?? 0) + 1)
      }
    }
  }
  return [...counts.entries()]
    .map(([ingredientId, count]) => ({ ingredientId, count }))
    .sort((a, b) => b.count - a.count)
}
