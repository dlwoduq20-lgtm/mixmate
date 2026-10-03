import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, X, Plus, ShoppingCart } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useLocalize } from '../i18n/localize'
import { ENABLE_SHOPPING_LIST } from '../config/featureFlags'
import type { CocktailMatch } from '../types'

export default function IngredientChecklistCard({ match, compact = false }: { match: CocktailMatch; compact?: boolean }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const addIngredient = useAppStore((s) => s.addIngredient)
  const addToShoppingList = useAppStore((s) => s.addToShoppingList)
  const owned = useAppStore((s) => s.selectedIngredients)
  const ownedSet = new Set(owned)
  const { cocktail, missingIngredients } = match

  return (
    <div className="bg-white rounded-[20px] border border-[var(--color-border)] p-4">
      <button onClick={() => navigate(`/cocktail/${cocktail.id}`)} className="w-full text-left flex items-start justify-between">
        <div>
          <h3 className="font-display font-bold text-[15px] text-[var(--color-ink)]">
            {localize.cocktailName(cocktail.id, cocktail.name)}
          </h3>
          <p className="text-[12px] text-[var(--color-ink-soft)]">
            {localize.baseSpirit(cocktail.baseSpirit)} · {cocktail.preparationTime} {t('common.min')}
          </p>
        </div>
        <span className="text-[11px] font-bold text-[var(--color-coral-dark)] bg-[var(--color-coral-light)] px-2 py-1 rounded-full shrink-0">
          {t('common.missingCount', { count: missingIngredients.length })}
        </span>
      </button>

      {!compact && (
        <ul className="mt-3 space-y-1.5">
          {cocktail.ingredients.map((ing) => {
            const has = ownedSet.has(ing.ingredientId)
            return (
              <li key={ing.ingredientId} className="flex items-center gap-2 text-[13px]">
                {has ? (
                  <Check size={14} strokeWidth={3} className="text-[var(--color-success)] shrink-0" />
                ) : (
                  <X size={14} strokeWidth={3} className="text-[var(--color-favorite)] shrink-0" />
                )}
                <span className={has ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'}>
                  {localize.ingredientName(ing.ingredientId, ing.name)}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {missingIngredients.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <p className="text-[11px] font-semibold text-[var(--color-ink-soft)] mb-2 uppercase tracking-wide">
            {t('common.missingLabel', {
              items: missingIngredients.map((m) => localize.ingredientName(m.ingredientId, m.name)).join(', '),
            })}
          </p>
          {(missingIngredients.length === 1 || ENABLE_SHOPPING_LIST) && (
            <div className="flex gap-2">
              {missingIngredients.length === 1 && (
                <button
                  onClick={() => addIngredient(missingIngredients[0].ingredientId)}
                  className="flex-1 flex items-center justify-center gap-1 text-[12px] font-bold text-white bg-[var(--color-coral)] rounded-full py-2 active:scale-[0.97] transition-transform"
                >
                  <Plus size={13} strokeWidth={3} /> {t('common.addToMyBar')}
                </button>
              )}
              {ENABLE_SHOPPING_LIST && (
                <button
                  onClick={() => missingIngredients.forEach((m) => addToShoppingList(m.ingredientId))}
                  className="flex-1 flex items-center justify-center gap-1 text-[12px] font-bold text-[var(--color-ink)] bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-full py-2 active:scale-[0.97] transition-transform"
                >
                  <ShoppingCart size={13} /> {t('common.addToShoppingList')}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
