import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useAllMatches } from '../hooks/useMatches'
import CocktailCard from '../components/CocktailCard'
import EmptyState from '../components/EmptyState'

const FILTERS = ['All', 'Can Make', 'Need Ingredients'] as const

export default function Favorites() {
  const { t } = useTranslation()
  const favorites = useAppStore((s) => s.favorites)
  const matches = useAllMatches()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const favoriteMatches = useMemo(
    () => matches.filter((m) => favorites.includes(m.cocktail.id)),
    [matches, favorites],
  )

  const filtered = useMemo(() => {
    if (filter === 'Can Make') return favoriteMatches.filter((m) => m.status === 'READY')
    if (filter === 'Need Ingredients') return favoriteMatches.filter((m) => m.status !== 'READY')
    return favoriteMatches
  }, [favoriteMatches, filter])

  const filterLabel: Record<(typeof FILTERS)[number], string> = {
    All: t('favorites.filterAll'),
    'Can Make': t('favorites.filterCanMake'),
    'Need Ingredients': t('favorites.filterNeedIngredients'),
  }

  return (
    <div className="pt-6 pb-4">
      <div className="px-5">
        <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)]">{t('favorites.title')}</h1>

        {favoriteMatches.length > 0 && (
          <div className="flex gap-2 mt-4">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
                  filter === f
                    ? 'bg-[var(--color-ink)] text-white border-[var(--color-ink)]'
                    : 'bg-white text-[var(--color-ink-soft)] border-[var(--color-border)]'
                }`}
              >
                {filterLabel[f]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 px-5">
        {favoriteMatches.length === 0 ? (
          <EmptyState
            icon={<Heart size={24} />}
            title={t('favorites.emptyTitle')}
            subtitle={t('favorites.emptySubtitle')}
          />
        ) : filtered.length === 0 ? (
          <EmptyState title={t('common.noResultsTitle')} subtitle={t('favorites.noResultsSubtitle')} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((m) => (
              <CocktailCard key={m.cocktail.id} match={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
