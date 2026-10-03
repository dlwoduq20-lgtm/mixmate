import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ShoppingCart, Check, Plus, Trash2 } from 'lucide-react'
import { INGREDIENTS } from '../data/ingredients'
import { useAppStore } from '../store/useAppStore'
import EmptyState from '../components/EmptyState'
import { useLocalize } from '../i18n/localize'

const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]))

export default function ShoppingList() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const shoppingList = useAppStore((s) => s.shoppingList)
  const toggle = useAppStore((s) => s.toggleShoppingItemPurchased)
  const removeItem = useAppStore((s) => s.removeFromShoppingList)
  const addIngredient = useAppStore((s) => s.addIngredient)

  const items = useMemo(
    () =>
      [...shoppingList]
        .sort((a, b) => Number(a.purchased) - Number(b.purchased) || b.addedAt - a.addedAt)
        .map((item) => ({ ...item, ingredient: INGREDIENT_BY_ID.get(item.ingredientId) }))
        .filter((i) => i.ingredient),
    [shoppingList],
  )
  const purchasedCount = items.filter((i) => i.purchased).length

  function moveAllPurchasedToBar() {
    items.filter((i) => i.purchased).forEach((i) => {
      addIngredient(i.ingredientId)
      removeItem(i.ingredientId)
    })
  }

  return (
    <div className="pt-6 pb-10 px-5">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={() => navigate(-1)} aria-label={t('common.back')} className="w-9 h-9 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)]">{t('shoppingList.title')}</h1>
      </div>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<ShoppingCart size={24} />}
            title={t('shoppingList.emptyTitle')}
            subtitle={t('shoppingList.emptySubtitle')}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mt-5">
            {items.map((item) => {
              const name = localize.ingredientName(item.ingredientId, item.ingredient!.name)
              return (
                <div
                  key={item.ingredientId}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                    item.purchased ? 'bg-[var(--color-success-light)] border-transparent' : 'bg-white border-[var(--color-border)]'
                  }`}
                >
                  <button
                    onClick={() => toggle(item.ingredientId)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        item.purchased ? 'bg-[var(--color-success)] border-[var(--color-success)]' : 'border-[var(--color-border)]'
                      }`}
                    >
                      {item.purchased && <Check size={13} strokeWidth={3} className="text-white" />}
                    </span>
                    <span
                      className={`text-[14px] font-semibold ${
                        item.purchased ? 'text-[var(--color-ink-soft)] line-through' : 'text-[var(--color-ink)]'
                      }`}
                    >
                      {name}
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    {item.purchased && (
                      <button
                        onClick={() => {
                          addIngredient(item.ingredientId)
                          removeItem(item.ingredientId)
                        }}
                        aria-label={t('common.addNameToMyBar', { name })}
                        className="w-7 h-7 rounded-full bg-[var(--color-coral)] text-white flex items-center justify-center"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(item.ingredientId)}
                      aria-label={t('common.removeName', { name })}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-ink-soft)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {purchasedCount > 0 && (
            <button
              onClick={moveAllPurchasedToBar}
              className="w-full mt-5 py-3.5 rounded-2xl bg-[var(--color-coral)] text-white font-bold text-[14px] active:scale-[0.98] transition-transform"
            >
              {t('shoppingList.addPurchased', { count: purchasedCount })}
            </button>
          )}
        </>
      )}
    </div>
  )
}
