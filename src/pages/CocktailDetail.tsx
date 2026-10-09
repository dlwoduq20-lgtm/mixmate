import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ChevronLeft, Check, X, Wine, Plus, ShoppingCart, Repeat } from 'lucide-react'
import { COCKTAILS } from '../data/cocktails'
import { INGREDIENTS } from '../data/ingredients'
import { getSubstitutes } from '../data/substitutions'
import { COCKTAIL_STORY_KO } from '../i18n/cocktailStories.ko'
import { COCKTAIL_STORY_EN } from '../i18n/cocktailStories.en'
import { useMatchFor } from '../hooks/useMatches'
import { useAppStore } from '../store/useAppStore'
import CocktailImage from '../components/CocktailImage'
import FlavorDots from '../components/FlavorDots'
import { formatAmount, formatAmountKo } from '../lib/format'
import { useLocalize } from '../i18n/localize'
import { buildKoreanInstructions } from '../lib/koInstructions'
import { eulReul } from '../i18n/hangul'
import { ENABLE_SHOPPING_LIST } from '../config/featureFlags'

// Maps each value that appears in Cocktail.foodPairings (src/data/cocktails.ts)
// to a representative emoji shown on the food-pairing cards. Falls back to
// 🍽️ for any pairing value not listed here (e.g. a new one added later).
const FOOD_EMOJI: Record<string, string> = {
  'Aged Cheese': '🧀',
  'BBQ Ribs': '🍖',
  Biscotti: '🍪',
  Blini: '🥞',
  'Buffalo Wings': '🍗',
  Caviar: '🐟',
  Ceviche: '🐟',
  Charcuterie: '🥓',
  'Charred Corn Elote': '🌽',
  'Chocolate Cake': '🍰',
  'Dark Chocolate': '🍫',
  'Fresh Salad': '🥗',
  'Fruit Tart': '🥧',
  'Grilled Beef': '🥩',
  'Grilled Chorizo': '🌭',
  'Grilled Shrimp': '🍤',
  Guacamole: '🥑',
  'Jerk Chicken': '🍗',
  'Light Canapés': '🥟',
  'Light Seafood': '🦐',
  'Loaded Fries': '🍟',
  Nachos: '🧀',
  Olives: '🫒',
  Oysters: '🦪',
  Pickles: '🥒',
  Pâté: '🥖',
  'Roasted Nuts': '🥜',
  Sliders: '🍔',
  'Smoked Fish': '🐟',
  'Smoked Meats': '🍖',
  'Smoked Salmon': '🍣',
  'Soft Cheese': '🧀',
  'Spicy Chicken': '🌶️',
  'Spicy Mexican Food': '🌶️',
  Steak: '🥩',
  Sushi: '🍣',
  'Tacos al Pastor': '🌮',
  Tacos: '🌮',
  Tiramisu: '🍰',
  'Vanilla Ice Cream': '🍦',
}
const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]))

export default function CocktailDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const cocktail = COCKTAILS.find((c) => c.id === id)
  const match = useMatchFor(id)
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed)
  const addIngredient = useAppStore((s) => s.addIngredient)
  const addToShoppingList = useAppStore((s) => s.addToShoppingList)
  const selectedIngredients = useAppStore((s) => s.selectedIngredients)
  const ownedSet = new Set(selectedIngredients)

  useEffect(() => {
    if (cocktail) addRecentlyViewed(cocktail.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cocktail?.id])

  if (!cocktail || !match) {
    return (
      <div className="pt-20 text-center px-6">
        <p className="text-[var(--color-ink-soft)]">{t('detail.notFound')}</p>
        <Link to="/cocktails" className="text-[var(--color-coral)] font-bold text-sm">{t('detail.backToCocktails')}</Link>
      </div>
    )
  }

  const isFav = favorites.includes(cocktail.id)
  const strengthStars = Math.min(5, Math.max(1, Math.round(cocktail.abv / 10)))
  const recipeSteps = localize.isKo ? buildKoreanInstructions(cocktail, localize) : cocktail.instructions
  const story = localize.isKo ? COCKTAIL_STORY_KO[cocktail.id] : COCKTAIL_STORY_EN[cocktail.id]
  const amount = (amt: number | null, unit: string) =>
    localize.isKo ? formatAmountKo(amt, localize.unit(unit)) : formatAmount(amt, unit)

  return (
    <div className="pb-8">
      <div className="relative">
        <CocktailImage
          cocktail={cocktail}
          displayName={localize.cocktailName(cocktail.id, cocktail.name)}
          size={480}
          rounded={false}
          className="w-full aspect-[4/3]"
        />
        <button
          onClick={() => navigate(-1)}
          aria-label={t('common.back')}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => toggleFavorite(cocktail.id)}
          aria-label={isFav ? t('common.removeFromFavorites') : t('common.addToFavorites')}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
        >
          <Heart size={19} className={isFav ? 'fill-[var(--color-favorite)] text-[var(--color-favorite)]' : 'text-[var(--color-ink-soft)]'} />
        </button>
      </div>

      <div className="px-5 -mt-6 relative">
        <div className="bg-white rounded-t-[28px] pt-5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-coral-dark)] uppercase tracking-wide">
            <span className="bg-[var(--color-coral-light)] px-2 py-0.5 rounded-full">{localize.cocktailCategory(cocktail.category)}</span>
            <span className="text-[var(--color-ink-soft)]">{t('detail.basedOn', { spirit: localize.baseSpirit(cocktail.baseSpirit) })}</span>
          </div>
          <h1 className="font-display font-extrabold text-[28px] text-[var(--color-ink)] mt-1 leading-tight">
            {localize.cocktailName(cocktail.id, cocktail.name)}
          </h1>
          {!story && (
            <p className="text-[13px] text-[var(--color-ink-soft)] mt-2 leading-relaxed">{cocktail.description}</p>
          )}

          {match.status === 'READY' ? (
            <p className="text-[13px] font-bold text-[var(--color-success)] mt-3">✓ {t('home.haveEverything')}</p>
          ) : (
            <p className="text-[13px] font-bold text-[var(--color-coral-dark)] mt-3">
              {t(match.missingCount === 1 ? 'detail.missingOnly' : 'detail.missingList', {
                items: match.missingIngredients.map((m) => localize.ingredientName(m.ingredientId, m.name)).join(', '),
              })}
            </p>
          )}
          {match.substitutedIngredients.length > 0 && (
            <p className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-coral-dark)] mt-1.5">
              <Repeat size={12} strokeWidth={3} />
              {t('detail.usingSubstitutes', { count: match.substitutedIngredients.length })}
            </p>
          )}
        </div>
      </div>

      {/* Info strip */}
      <div className="px-5 mt-4 grid grid-cols-4 gap-2 text-center">
        {[
          { label: t('detail.glass'), value: localize.glass(cocktail.glass) },
          { label: t('detail.method'), value: localize.method(cocktail.method) },
          { label: t('detail.difficulty'), value: localize.difficulty(cocktail.difficulty) },
          { label: t('detail.time'), value: `${cocktail.preparationTime} ${t('common.min')}` },
        ].map((it) => (
          <div key={it.label} className="bg-[var(--color-bg-soft)] rounded-2xl py-2.5 px-1">
            <p className="text-[10px] font-bold text-[var(--color-ink-soft)] uppercase">{it.label}</p>
            <p className="text-[12px] font-bold text-[var(--color-ink)] mt-0.5">{it.value}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      {story && (
        <div className="px-5 mt-6">
          <h2 className="font-display font-bold text-[16px] text-[var(--color-ink)] mb-3">{t('detail.story')}</h2>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-4">
            <p className="text-[13px] text-[var(--color-ink)] leading-relaxed">{story}</p>
          </div>
        </div>
      )}

      {/* Ingredients */}
      <div className="px-5 mt-6">
        <h2 className="font-display font-bold text-[16px] text-[var(--color-ink)] mb-3">{t('detail.ingredientsTitle')}</h2>
        <div className="flex flex-col gap-2">
          {cocktail.ingredients.map((ing) => {
            const has = ownedSet.has(ing.ingredientId)
            // If the "count substitutes as owned" toggle (My Bar) is on and
            // this ingredient is missing, the match engine may already be
            // counting an owned stand-in toward READY/etc — surface exactly
            // which one, rather than showing a plain ✗ that would read as
            // "you can't make this" while the app disagrees.
            const subEntry = match.substitutedIngredients.find((s) => s.ingredientId === ing.ingredientId)
            const subDetail = subEntry ? getSubstitutes(ing.ingredientId).find((s) => s.ingredientId === subEntry.substituteId) : undefined
            const subName = subEntry
              ? localize.ingredientName(subEntry.substituteId, INGREDIENT_BY_ID.get(subEntry.substituteId)?.name ?? subEntry.substituteId)
              : null
            return (
              <div key={ing.ingredientId} className="py-2 border-b border-[var(--color-border)] last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {has ? (
                      <Check size={16} strokeWidth={3} className="text-[var(--color-success)] shrink-0" />
                    ) : subEntry ? (
                      <Repeat size={15} strokeWidth={3} className="text-[var(--color-coral)] shrink-0" />
                    ) : (
                      <X size={16} strokeWidth={3} className="text-[var(--color-favorite)] shrink-0" />
                    )}
                    <span className={`text-[13px] font-semibold ${has || subEntry ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'}`}>
                      {localize.ingredientName(ing.ingredientId, ing.name)}
                    </span>
                  </div>
                  <span className="text-[12px] text-[var(--color-ink-soft)]">{amount(ing.amount, ing.unit)}</span>
                </div>
                {subEntry && subDetail && subName && (
                  <p className="text-[11px] text-[var(--color-coral-dark)] leading-snug mt-1 pl-[26px]">
                    {localize.isKo
                      ? `보유하신 ${eulReul(subName)} 대신 사용 중 — ${subDetail.noteKo}`
                      : `Using the ${subName} you already have — ${subDetail.note}`}
                  </p>
                )}
              </div>
            )
          })}
          {cocktail.optionalIngredients.map((ing) => {
            const has = ownedSet.has(ing.ingredientId)
            return (
              <div key={ing.ingredientId} className="flex items-center justify-between py-2 opacity-70">
                <div className="flex items-center gap-2.5">
                  {has ? (
                    <Check size={16} strokeWidth={3} className="text-[var(--color-success)] shrink-0" />
                  ) : (
                    <span className="w-4 h-4 shrink-0" />
                  )}
                  <span className="text-[13px] font-semibold text-[var(--color-ink-soft)]">{localize.ingredientName(ing.ingredientId, ing.name)}</span>
                  <span className="text-[10px] font-bold text-[var(--color-ink-soft)] bg-[var(--color-bg-soft)] px-1.5 py-0.5 rounded">
                    {t('common.optional')}
                  </span>
                </div>
                <span className="text-[12px] text-[var(--color-ink-soft)]">{amount(ing.amount, ing.unit)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recipe */}
      <div className="px-5 mt-6">
        <h2 className="font-display font-bold text-[16px] text-[var(--color-ink)] mb-3">{t('detail.recipe')}</h2>
        <ol className="flex flex-col gap-3">
          {recipeSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--color-coral)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-[13px] text-[var(--color-ink)] leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Flavor profile */}
      <div className="px-5 mt-6">
        <h2 className="font-display font-bold text-[16px] text-[var(--color-ink)] mb-3">{t('detail.flavorProfile')}</h2>
        <div className="bg-[var(--color-bg-soft)] rounded-2xl p-4 flex flex-col gap-2.5">
          {(['sweet', 'sour', 'bitter', 'strong', 'refreshing'] as const).map((k) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[var(--color-ink-soft)] capitalize w-20">{t(`flavor.${k}`)}</span>
              <FlavorDots value={cocktail.flavorProfile[k]} />
            </div>
          ))}
          <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)] mt-1">
            <span className="text-[12px] font-semibold text-[var(--color-ink-soft)] w-20">{t('detail.strength')}</span>
            <div className="flex items-center gap-2">
              <FlavorDots value={strengthStars} />
              <span className="text-[11px] text-[var(--color-ink-soft)]">~{cocktail.abv}% ABV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Food pairing */}
      <div className="px-5 mt-6">
        <h2 className="font-display font-bold text-[16px] text-[var(--color-ink)] mb-1">{t('detail.pairing')}</h2>
        <p className="text-[12px] text-[var(--color-ink-soft)] mb-3">{t('detail.pairingSubtitle')}</p>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {cocktail.foodPairings.map((food) => (
            <div key={food} className="shrink-0 w-24 bg-[var(--color-bg-soft)] rounded-2xl p-3 flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
                {FOOD_EMOJI[food] ?? '🍽️'}
              </div>
              <p className="text-[11px] font-semibold text-center text-[var(--color-ink)] leading-tight">{localize.foodPairing(food)}</p>
            </div>
          ))}
        </div>
      </div>

      {match.missingCount > 0 && (
        <div className="px-5 mt-6">
          <div className="bg-[var(--color-coral-light)] rounded-2xl p-4">
            <p className="text-[12px] font-bold text-[var(--color-coral-dark)] uppercase tracking-wide mb-2">
              {t('detail.missingIngredientsCount', { count: match.missingCount })}
            </p>
            <div className="flex flex-col gap-2">
              {match.missingIngredients.map((ing) => {
                const name = localize.ingredientName(ing.ingredientId, ing.name)
                // Reference-only tip: an owned ingredient that's a reasonable
                // flavor-similar stand-in. Purely informational — it never
                // changes match/READY status or ingredient counts anywhere
                // in the app (see src/data/substitutions.ts).
                const ownedSub = getSubstitutes(ing.ingredientId).find((s) => ownedSet.has(s.ingredientId))
                const subName = ownedSub
                  ? localize.ingredientName(ownedSub.ingredientId, INGREDIENT_BY_ID.get(ownedSub.ingredientId)?.name ?? ownedSub.ingredientId)
                  : null
                return (
                  <div key={ing.ingredientId} className="bg-white rounded-xl px-3 py-2 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[var(--color-ink)]">{name}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => addIngredient(ing.ingredientId)}
                          aria-label={t('common.addNameToMyBar', { name })}
                          className="w-7 h-7 rounded-full bg-[var(--color-coral)] text-white flex items-center justify-center"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                        {ENABLE_SHOPPING_LIST && (
                          <button
                            onClick={() => addToShoppingList(ing.ingredientId)}
                            aria-label={t('common.addNameToShoppingList', { name })}
                            className="w-7 h-7 rounded-full bg-[var(--color-bg-soft)] border border-[var(--color-border)] flex items-center justify-center"
                          >
                            <ShoppingCart size={13} className="text-[var(--color-ink)]" />
                          </button>
                        )}
                      </div>
                    </div>
                    {ownedSub && subName && (
                      <p className="text-[11px] text-[var(--color-ink-soft)] leading-snug">
                        💡{' '}
                        {localize.isKo
                          ? `보유하신 ${eulReul(subName)} 대신 써보세요 — ${ownedSub.noteKo}`
                          : `Try the ${subName} you already have instead — ${ownedSub.note}`}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="px-5 mt-7">
        <button
          onClick={() => navigate(`/cocktail/${cocktail.id}/mix`)}
          className="w-full py-4 rounded-2xl bg-[var(--color-ink)] text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Wine size={18} /> {t('detail.startMixing')}
        </button>
      </div>
    </div>
  )
}
