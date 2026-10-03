import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Plus, ShoppingCart } from 'lucide-react'
import { INGREDIENTS } from '../data/ingredients'
import { COCKTAILS } from '../data/cocktails'
import { useAppStore } from '../store/useAppStore'
import { getNextIngredientSuggestions } from '../lib/matching'
import CocktailImage from '../components/CocktailImage'
import { useLocalize } from '../i18n/localize'
import { ENABLE_SHOPPING_LIST } from '../config/featureFlags'

const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]))

export default function NextIngredient() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const selectedIngredients = useAppStore((s) => s.selectedIngredients)
  const addIngredient = useAppStore((s) => s.addIngredient)
  const addToShoppingList = useAppStore((s) => s.addToShoppingList)
  const useSubstitutes = useAppStore((s) => s.useSubstitutesInMatching)
  const selectedSet = useMemo(() => new Set(selectedIngredients), [selectedIngredients])

  const ingredient = id ? INGREDIENT_BY_ID.get(id) : undefined
  const unlocked = useMemo(() => {
    if (!id) return []
    const [result] = getNextIngredientSuggestions(COCKTAILS, selectedSet, [id], 1, { useSubstitutes })
    return result?.unlockedCocktails ?? []
  }, [id, selectedSet, useSubstitutes])

  if (!ingredient) {
    return (
      <div className="pt-20 text-center px-6">
        <p className="text-[var(--color-ink-soft)]">{t('nextIngredient.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="pt-6 pb-10 px-5">
      <button onClick={() => navigate(-1)} aria-label={t('common.back')} className="w-9 h-9 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center mb-4">
        <ChevronLeft size={18} />
      </button>

      <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-coral)] uppercase">{localize.ingredientCategory(ingredient.category)}</p>
      <h1 className="font-display font-extrabold text-[28px] text-[var(--color-ink)] mt-0.5">{localize.ingredientName(ingredient.id, ingredient.name)}</h1>
      <p className="text-[15px] font-extrabold text-[var(--color-coral)] mt-2">
        {t('myBar.unlocksCocktails', { count: unlocked.length })}
      </p>
      <p className="text-[13px] text-[var(--color-ink-soft)] mt-1">{t('nextIngredient.unlockedTitle')}</p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {unlocked.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/cocktail/${c.id}`)}
            className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden text-left"
          >
            <CocktailImage
              cocktail={c}
              displayName={localize.cocktailName(c.id, c.name)}
              size={200}
              rounded={false}
              className="w-full aspect-square"
            />
            <p className="text-[12px] font-bold px-2.5 py-2 text-[var(--color-ink)] truncate">
              {localize.cocktailName(c.id, c.name)}
            </p>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => addIngredient(ingredient.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-[var(--color-coral)] text-white font-bold text-[14px] active:scale-[0.97] transition-transform"
        >
          <Plus size={16} strokeWidth={3} /> {t('common.addToMyBar')}
        </button>
        {ENABLE_SHOPPING_LIST && (
          <button
            onClick={() => addToShoppingList(ingredient.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-white border border-[var(--color-border)] text-[var(--color-ink)] font-bold text-[14px] active:scale-[0.97] transition-transform"
          >
            <ShoppingCart size={15} /> {t('common.addToShoppingList')}
          </button>
        )}
      </div>
    </div>
  )
}
