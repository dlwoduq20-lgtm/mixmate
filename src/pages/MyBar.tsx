import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, X, TrendingUp, Sparkles, ShoppingCart } from 'lucide-react'
import { INGREDIENTS, INGREDIENT_CATEGORIES, POPULAR_INGREDIENT_IDS } from '../data/ingredients'
import { COCKTAILS } from '../data/cocktails'
import { useAppStore } from '../store/useAppStore'
import IngredientChip from '../components/IngredientChip'
import { APP_CONFIG } from '../config/app'
import { useLocalize } from '../i18n/localize'
import { getNextIngredientSuggestions, mostUsefulIngredients } from '../lib/matching'
import { ENABLE_SHOPPING_LIST } from '../config/featureFlags'

const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]))
const ALL_INGREDIENT_IDS = INGREDIENTS.map((i) => i.id)

export default function MyBar() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const [query, setQuery] = useState('')
  const selectedIngredients = useAppStore((s) => s.selectedIngredients)
  const recentlyUsed = useAppStore((s) => s.recentlyUsedIngredients)
  const toggleIngredient = useAppStore((s) => s.toggleIngredient)
  const shoppingList = useAppStore((s) => s.shoppingList)
  const useSubstitutes = useAppStore((s) => s.useSubstitutesInMatching)
  const toggleUseSubstitutes = useAppStore((s) => s.toggleUseSubstitutesInMatching)
  const selectedSet = useMemo(() => new Set(selectedIngredients), [selectedIngredients])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    // Matches the English name/aliases and the Korean-localized ingredient
    // name/category, so searching in Korean (e.g. "민트") finds the same
    // ingredients as searching in English.
    return INGREDIENTS.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.aliases.some((a) => a.toLowerCase().includes(q)) ||
        localize.ingredientName(i.id, i.name).toLowerCase().includes(q) ||
        localize.ingredientCategory(i.category).toLowerCase().includes(q),
    )
  }, [query, localize])

  const popularIngredients = useMemo(
    () => POPULAR_INGREDIENT_IDS.map((id) => INGREDIENT_BY_ID.get(id)!).filter(Boolean),
    [],
  )
  const recentIngredients = useMemo(
    () => recentlyUsed.map((id) => INGREDIENT_BY_ID.get(id)!).filter(Boolean).slice(0, 8),
    [recentlyUsed],
  )

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof INGREDIENTS>()
    for (const cat of INGREDIENT_CATEGORIES) map.set(cat, [])
    for (const ing of INGREDIENTS) map.get(ing.category)?.push(ing)
    return map
  }, [])

  const nextIngredientSuggestions = useMemo(() => {
    if (selectedIngredients.length === 0) return []
    return getNextIngredientSuggestions(COCKTAILS, selectedSet, ALL_INGREDIENT_IDS, 3, { useSubstitutes })
  }, [selectedSet, selectedIngredients.length, useSubstitutes])

  const usefulIngredients = useMemo(() => {
    if (selectedIngredients.length === 0) return []
    return mostUsefulIngredients(COCKTAILS, selectedSet).filter((u) => u.count > 0).slice(0, 6)
  }, [selectedSet, selectedIngredients.length])

  return (
    <div className="pt-6 pb-24">
      <div className="px-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-coral)] uppercase">{APP_CONFIG.taglineAlt}</p>
            <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)] mt-0.5">{t('myBar.title')}</h1>
          </div>
          {ENABLE_SHOPPING_LIST && (
            <button
              onClick={() => navigate('/shopping-list')}
              aria-label={t('common.shoppingListLabel')}
              className="relative w-10 h-10 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center mt-0.5"
            >
              <ShoppingCart size={17} className="text-[var(--color-ink)]" />
              {shoppingList.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-coral)] text-white text-[10px] font-bold flex items-center justify-center">
                  {shoppingList.length}
                </span>
              )}
            </button>
          )}
        </div>
        <p className="text-[13px] text-[var(--color-ink-soft)] mt-1">
          {t('myBar.selectedCount', { count: selectedIngredients.length })}
        </p>

        <div className="flex items-center justify-between gap-3 mt-3 bg-[var(--color-bg-soft)] rounded-2xl px-3.5 py-2.5">
          <span className="text-[12px] font-semibold text-[var(--color-ink)] leading-snug pr-2">
            {t('myBar.substitutesToggle')}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={useSubstitutes}
            aria-label={t('myBar.substitutesToggle')}
            onClick={toggleUseSubstitutes}
            className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${
              useSubstitutes ? 'bg-[var(--color-coral)]' : 'bg-[var(--color-border)]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                useSubstitutes ? 'translate-x-[18px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="relative mt-4">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('myBar.searchPlaceholder')}
            className="w-full bg-white border border-[var(--color-border)] rounded-2xl py-3 pl-10 pr-10 text-[14px] placeholder:text-[var(--color-ink-soft)] outline-none focus:border-[var(--color-coral)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label={t('common.clearSearch')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        {searchResults ? (
          <div className="px-5">
            {searchResults.length === 0 ? (
              <p className="text-[13px] text-[var(--color-ink-soft)] text-center py-10">
                {t('myBar.noResultsFor', { query })}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {searchResults.map((ing) => (
                  <IngredientChip
                    key={ing.id}
                    ingredient={ing}
                    displayName={localize.ingredientName(ing.id, ing.name)}
                    selected={selectedSet.has(ing.id)}
                    onToggle={() => toggleIngredient(ing.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {nextIngredientSuggestions.length > 0 && (
              <div className="mb-6 px-5">
                <h2 className="text-[12px] font-extrabold tracking-wide text-[var(--color-ink-soft)] uppercase mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[var(--color-coral)]" /> {t('myBar.nextIngredient')}
                </h2>
                <div className="flex flex-col gap-2">
                  {nextIngredientSuggestions.map((s) => {
                    const ing = INGREDIENT_BY_ID.get(s.ingredientId)
                    if (!ing) return null
                    return (
                      <button
                        key={s.ingredientId}
                        onClick={() => navigate(`/next-ingredient/${s.ingredientId}`)}
                        className="w-full flex items-center justify-between bg-white rounded-2xl border border-[var(--color-border)] px-4 py-3 active:scale-[0.99] transition-transform"
                      >
                        <span className="text-left">
                          <span className="block font-display font-bold text-[14px] text-[var(--color-ink)]">{localize.ingredientName(ing.id, ing.name)}</span>
                          <span className="text-[12px] text-[var(--color-ink-soft)]">{localize.ingredientCategory(ing.category)}</span>
                        </span>
                        <span className="text-[13px] font-extrabold text-[var(--color-coral)]">
                          {t('myBar.unlocksCocktails', { count: s.unlockedCocktails.length })}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {usefulIngredients.length > 0 && (
              <div className="mb-6 px-5">
                <h2 className="text-[12px] font-extrabold tracking-wide text-[var(--color-ink-soft)] uppercase mb-2 flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[var(--color-coral)]" /> {t('myBar.mostUseful')}
                </h2>
                <div className="flex flex-col gap-1.5">
                  {usefulIngredients.map((u) => {
                    const ing = INGREDIENT_BY_ID.get(u.ingredientId)
                    if (!ing) return null
                    return (
                      <div key={u.ingredientId} className="flex items-center justify-between text-[13px] py-1">
                        <span className="font-semibold text-[var(--color-ink)]">{localize.ingredientName(ing.id, ing.name)}</span>
                        <span className="text-[12px] text-[var(--color-ink-soft)]">{t('myBar.usedIn', { count: u.count })}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {recentIngredients.length > 0 && (
              <div className="mb-6">
                <h2 className="px-5 text-[12px] font-extrabold tracking-wide text-[var(--color-ink-soft)] uppercase mb-2">
                  {t('myBar.recentlyUsed')}
                </h2>
                <div className="px-5 flex flex-wrap gap-2">
                  {recentIngredients.map((ing) => (
                    <IngredientChip
                      key={ing.id}
                      ingredient={ing}
                      displayName={localize.ingredientName(ing.id, ing.name)}
                      selected={selectedSet.has(ing.id)}
                      onToggle={() => toggleIngredient(ing.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="px-5 text-[12px] font-extrabold tracking-wide text-[var(--color-ink-soft)] uppercase mb-2">
                {t('myBar.popularIngredients')}
              </h2>
              <div className="px-5 flex flex-wrap gap-2">
                {popularIngredients.map((ing) => (
                  <IngredientChip
                    key={ing.id}
                    ingredient={ing}
                    displayName={localize.ingredientName(ing.id, ing.name)}
                    selected={selectedSet.has(ing.id)}
                    onToggle={() => toggleIngredient(ing.id)}
                  />
                ))}
              </div>
            </div>

            {INGREDIENT_CATEGORIES.map((cat) => {
              const items = byCategory.get(cat) ?? []
              if (items.length === 0) return null
              return (
                <div key={cat} className="mb-6">
                  <h2 className="px-5 text-[12px] font-extrabold tracking-wide text-[var(--color-ink-soft)] uppercase mb-2">
                    {localize.ingredientCategory(cat)}
                  </h2>
                  <div className="px-5 flex flex-wrap gap-2">
                    {items.map((ing) => (
                      <IngredientChip
                        key={ing.id}
                        ingredient={ing}
                        displayName={localize.ingredientName(ing.id, ing.name)}
                        selected={selectedSet.has(ing.id)}
                        onToggle={() => toggleIngredient(ing.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      <div
        className="fixed bottom-20 left-0 right-0 px-5 z-70"
        style={{ maxWidth: 480, margin: '0 auto' }}
      >
        <button
          onClick={() => navigate('/cocktails?mode=results')}
          disabled={selectedIngredients.length === 0}
          className="w-full py-3.5 rounded-2xl bg-[var(--color-coral)] text-white font-bold text-[15px] shadow-[0_10px_24px_-8px_rgba(255,107,74,0.6)] disabled:opacity-40 disabled:shadow-none active:scale-[0.98] transition-all"
        >
          {t('common.findCocktails')}
        </button>
      </div>
    </div>
  )
}
