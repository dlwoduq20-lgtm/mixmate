import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Clock } from 'lucide-react'
import CocktailImage from './CocktailImage'
import { StatusPill } from './StatusPill'
import { useAppStore } from '../store/useAppStore'
import { useLocalize } from '../i18n/localize'
import type { CocktailMatch, Cocktail } from '../types'

export default function CocktailCard({
  match,
  cocktail,
  compact = false,
}: {
  match?: CocktailMatch
  cocktail?: Cocktail
  compact?: boolean
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const favorites = useAppStore((s) => s.favorites)

  const c = match?.cocktail ?? cocktail
  if (!c) return null
  const isFav = favorites.includes(c.id)

  return (
    // Not a native <button>: it contains its own nested favorite <button>,
    // and interactive controls cannot legally nest inside one another.
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/cocktail/${c.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/cocktail/${c.id}`)
        }
      }}
      className="group text-left bg-white rounded-[20px] overflow-hidden border border-[var(--color-border)] active:scale-[0.98] transition-transform cursor-pointer"
      style={{ width: compact ? 150 : '100%' }}
    >
      <div className="relative">
        <CocktailImage
          cocktail={c}
          displayName={localize.cocktailName(c.id, c.name)}
          size={compact ? 150 : 400}
          rounded={false}
          className="w-full aspect-square"
        />
        <button
          type="button"
          aria-label={isFav ? t('common.removeFromFavorites') : t('common.addToFavorites')}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(c.id)
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart size={16} className={isFav ? 'fill-[var(--color-favorite)] text-[var(--color-favorite)]' : 'text-[var(--color-ink-soft)]'} />
        </button>
        {match && (
          <span className="absolute bottom-2 left-2">
            <StatusPill
              status={match.status}
              missingCount={match.missingCount}
              substitutedCount={match.substitutedIngredients.length}
            />
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-display font-bold text-[13px] tracking-wide uppercase text-[var(--color-ink)] truncate">
          {localize.cocktailName(c.id, c.name)}
        </h3>
        <p className="text-[12px] text-[var(--color-ink-soft)] mt-0.5">{localize.baseSpirit(c.baseSpirit)}</p>
        <div className="flex items-center justify-between mt-1.5">
          {match ? (
            <span className="text-[11px] font-semibold text-[var(--color-ink-soft)]">
              {match.ownedCount} / {match.requiredCount} {t('common.ingredientsWord')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-ink-soft)]">
              <Clock size={11} /> {c.preparationTime} {t('common.min')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
