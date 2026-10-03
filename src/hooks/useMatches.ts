import { useMemo } from 'react'
import { COCKTAILS } from '../data/cocktails'
import { useAppStore } from '../store/useAppStore'
import { getMatchingCocktails, matchCocktail } from '../lib/matching'
import type { CocktailMatch } from '../types'

export function useOwnedSet(): Set<string> {
  const selected = useAppStore((s) => s.selectedIngredients)
  return useMemo(() => new Set(selected), [selected])
}

export function useAllMatches(): CocktailMatch[] {
  const owned = useOwnedSet()
  const useSubstitutes = useAppStore((s) => s.useSubstitutesInMatching)
  return useMemo(
    () => getMatchingCocktails(COCKTAILS, owned, { includeUnavailable: true, useSubstitutes }),
    [owned, useSubstitutes],
  )
}

export function useMatchFor(cocktailId: string | undefined): CocktailMatch | undefined {
  const owned = useOwnedSet()
  const useSubstitutes = useAppStore((s) => s.useSubstitutesInMatching)
  return useMemo(() => {
    const c = COCKTAILS.find((x) => x.id === cocktailId)
    return c ? matchCocktail(c, owned, { useSubstitutes }) : undefined
  }, [cocktailId, owned, useSubstitutes])
}
