import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useAllMatches } from '../hooks/useMatches'
import { useAppStore } from '../store/useAppStore'
import CocktailCard from '../components/CocktailCard'
import EmptyState from '../components/EmptyState'
import { useLocalize } from '../i18n/localize'
import type { CocktailMatch } from '../types'

const EXPLORE_CATEGORIES = [
  'All', 'Classic', 'Gin', 'Vodka', 'Rum', 'Whiskey', 'Tequila', 'Brandy', 'Tiki', 'Sour', 'Highball', 'Martini', 'Sparkling',
]
const RESULTS_FILTERS = ['All', 'Ready', 'Almost', 'Gin', 'Vodka', 'Rum', 'Whiskey', 'Tequila']
const MOOD_FLAVORS: Array<keyof CocktailMatch['cocktail']['flavorProfile']> = ['sweet', 'sour', 'bitter', 'strong', 'refreshing']

type SortKey = 'match' | 'popular' | 'quick'

export default function CocktailDiscovery() {
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'results' ? 'results' : 'explore'
  const initialStatus = params.get('status')
  const { t } = useTranslation()
  const localize = useLocalize()

  const matches = useAllMatches()
  const moodFlavors = useAppStore((s) => s.moodFlavors)
  const toggleMoodFlavor = useAppStore((s) => s.toggleMoodFlavor)

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<string>(initialStatus === 'ready' ? 'Ready' : 'All')
  const [sort, setSort] = useState<SortKey>(mode === 'results' ? 'match' : 'popular')
  const [showMood, setShowMood] = useState(false)

  const filterOptions = mode === 'results' ? RESULTS_FILTERS : EXPLORE_CATEGORIES

  function filterLabel(opt: string) {
    if (opt === 'All') return t('discovery.filterAll')
    if (opt === 'Ready') return t('discovery.filterReady')
    if (opt === 'Almost') return t('discovery.filterAlmost')
    return mode === 'results' ? localize.baseSpirit(opt) : localize.cocktailCategory(opt)
  }

  const filtered = useMemo(() => {
    let list = matches

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((m) => {
        const c = m.cocktail
        // Matches against both the English data and the Korean-localized
        // display strings (ingredient names, base spirit, category, food
        // pairings), so searching in Korean (e.g. "보드카") finds the same
        // results as searching in English. Cocktail names themselves have
        // no Korean dictionary yet, so those still only match in English.
        return (
          c.name.toLowerCase().includes(q) ||
          localize.cocktailName(c.id, c.name).toLowerCase().includes(q) ||
          c.aliases.some((a) => a.toLowerCase().includes(q)) ||
          c.ingredients.some(
            (i) =>
              i.name.toLowerCase().includes(q) ||
              localize.ingredientName(i.ingredientId, i.name).toLowerCase().includes(q),
          ) ||
          c.baseSpirit.toLowerCase().includes(q) ||
          localize.baseSpirit(c.baseSpirit).toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          localize.cocktailCategory(c.category).toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.foodPairings.some(
            (f) => f.toLowerCase().includes(q) || localize.foodPairing(f).toLowerCase().includes(q),
          )
        )
      })
    }

    if (mode === 'results') {
      if (filter === 'Ready') list = list.filter((m) => m.status === 'READY')
      else if (filter === 'Almost') list = list.filter((m) => m.status === 'ONE_AWAY' || m.status === 'TWO_AWAY')
      else if (filter !== 'All') list = list.filter((m) => m.cocktail.baseSpirit === filter)
      else list = list.filter((m) => m.status !== 'UNAVAILABLE')
    } else if (filter !== 'All') {
      list = list.filter((m) => m.cocktail.category === filter)
    }

    if (moodFlavors.length > 0) {
      list = list.filter((m) => moodFlavors.every((f) => (m.cocktail.flavorProfile as any)[f] >= 3))
    }

    const sorted = [...list]
    if (sort === 'popular') sorted.sort((a, b) => b.cocktail.popularity - a.cocktail.popularity)
    else if (sort === 'quick') sorted.sort((a, b) => a.cocktail.preparationTime - b.cocktail.preparationTime)
    // 'match' relies on the ordering already produced by getMatchingCocktails upstream (useAllMatches)

    return sorted
  }, [matches, query, filter, mode, moodFlavors, sort, localize])

  const readyCount = useMemo(() => matches.filter((m) => m.status === 'READY').length, [matches])

  return (
    <div className="pt-6 pb-4">
      <div className="px-5">
        {mode === 'results' ? (
          <>
            <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-coral)] uppercase">{t('discovery.yourCocktailsLabel')}</p>
            <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)] mt-0.5">
              {t('discovery.youCanMakeCount', { count: readyCount })}
            </h1>
          </>
        ) : (
          <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)]">{t('discovery.exploreCocktails')}</h1>
        )}

        <div className="relative mt-4">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('discovery.searchPlaceholder')}
            className="w-full bg-white border border-[var(--color-border)] rounded-2xl py-3 pl-10 pr-4 text-[14px] placeholder:text-[var(--color-ink-soft)] outline-none focus:border-[var(--color-coral)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
                filter === opt
                  ? 'bg-[var(--color-ink)] text-white border-[var(--color-ink)]'
                  : 'bg-white text-[var(--color-ink-soft)] border-[var(--color-border)]'
              }`}
            >
              {filterLabel(opt)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setShowMood((v) => !v)}
            className={`flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full border ${
              moodFlavors.length > 0 ? 'bg-[var(--color-coral-light)] border-[var(--color-coral)] text-[var(--color-coral-dark)]' : 'border-[var(--color-border)] text-[var(--color-ink-soft)]'
            }`}
          >
            <SlidersHorizontal size={13} /> {t('discovery.mood')} {moodFlavors.length > 0 ? `(${moodFlavors.length})` : ''}
          </button>
          <div className="flex gap-1 bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-full p-1">
            {(['match', 'popular', 'quick'] as SortKey[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  sort === s ? 'bg-white shadow text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'
                }`}
              >
                {s === 'match' ? t('discovery.sortBestMatch') : s === 'popular' ? t('discovery.sortPopular') : t('discovery.sortQuick')}
              </button>
            ))}
          </div>
        </div>

        {showMood && (
          <div className="mt-3 bg-white rounded-2xl border border-[var(--color-border)] p-3">
            <p className="text-[12px] font-bold text-[var(--color-ink-soft)] mb-2 uppercase tracking-wide">
              {t('discovery.moodTitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              {MOOD_FLAVORS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleMoodFlavor(f)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border ${
                    moodFlavors.includes(f)
                      ? 'bg-[var(--color-coral)] border-[var(--color-coral)] text-white'
                      : 'bg-[var(--color-bg-soft)] border-[var(--color-border)] text-[var(--color-ink)]'
                  }`}
                >
                  {t(`flavor.${f}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 px-5">
        {filtered.length === 0 ? (
          <EmptyState title={t('common.noResultsTitle')} subtitle={t('common.noResultsSubtitle')} />
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
