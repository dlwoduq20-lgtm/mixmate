import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GlassWater, Dices, Sparkles, Sun, Flame, ArrowRight } from 'lucide-react'
import { COCKTAILS } from '../data/cocktails'
import { useAppStore } from '../store/useAppStore'
import { useAllMatches } from '../hooks/useMatches'
import { currentSeason, greetingKeyForTime, type Season } from '../lib/season'
import { formatRelativeTime } from '../lib/format'
import { History, Clock3 } from 'lucide-react'
import CocktailCard from '../components/CocktailCard'
import IngredientChecklistCard from '../components/IngredientChecklistCard'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import CocktailImage from '../components/CocktailImage'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { ENABLE_LANGUAGE_SWITCHER } from '../config/featureFlags'
import { useLocalize } from '../i18n/localize'

const SEASON_KEY: Record<Season, 'seasonSpring' | 'seasonSummer' | 'seasonAutumn' | 'seasonWinter'> = {
  Spring: 'seasonSpring',
  Summer: 'seasonSummer',
  Autumn: 'seasonAutumn',
  Winter: 'seasonWinter',
}

function HorizontalScroll({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1 snap-x">
      {children}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const selectedIngredients = useAppStore((s) => s.selectedIngredients)
  const recentlyViewedIds = useAppStore((s) => s.recentlyViewed)
  const recentlyMade = useAppStore((s) => s.recentlyMade)
  const matches = useAllMatches()

  const recentlyViewedCocktails = useMemo(
    () => recentlyViewedIds.map((id) => COCKTAILS.find((c) => c.id === id)).filter((c): c is (typeof COCKTAILS)[number] => !!c),
    [recentlyViewedIds],
  )
  const recentlyMadeCocktails = useMemo(
    () =>
      recentlyMade
        .map((entry) => ({ entry, cocktail: COCKTAILS.find((c) => c.id === entry.cocktailId) }))
        .filter((x): x is { entry: (typeof recentlyMade)[number]; cocktail: (typeof COCKTAILS)[number] } => !!x.cocktail)
        .slice(0, 8),
    [recentlyMade],
  )
  const [surprise, setSurprise] = useState<string | null>(null)

  const readyMatches = useMemo(() => matches.filter((m) => m.status === 'READY').sort((a, b) => b.cocktail.popularity - a.cocktail.popularity), [matches])
  const oneAwayMatches = useMemo(() => matches.filter((m) => m.status === 'ONE_AWAY').slice(0, 4), [matches])
  const twoAwayMatches = useMemo(() => matches.filter((m) => m.status === 'TWO_AWAY').slice(0, 4), [matches])

  const season = currentSeason()
  const seasonCocktails = useMemo(
    () => [...COCKTAILS].filter((c) => c.season.includes(season)).sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    [season],
  )
  const popularCocktails = useMemo(() => [...COCKTAILS].sort((a, b) => b.popularity - a.popularity).slice(0, 10), [])
  const quickEasy = useMemo(
    () => [...COCKTAILS].filter((c) => c.difficulty === 'Easy' && c.preparationTime <= 5).sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    [],
  )

  const todaysPick = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86400000)
    const pool = popularCocktails.length ? popularCocktails : COCKTAILS
    return pool[dayIndex % pool.length]
  }, [popularCocktails])
  const todaysPickReady = readyMatches.some((m) => m.cocktail.id === todaysPick?.id)

  const surprisePick = useMemo(() => COCKTAILS.find((c) => c.id === surprise), [surprise])

  function handleSurprise() {
    if (selectedIngredients.length === 0) {
      navigate('/my-bar')
      return
    }
    const pool = readyMatches.length > 0 ? readyMatches.map((m) => m.cocktail) : matches.filter((m) => m.status !== 'UNAVAILABLE').map((m) => m.cocktail)
    if (pool.length === 0) {
      navigate('/my-bar')
      return
    }
    const others = pool.filter((c) => c.id !== surprise)
    const choices = others.length > 0 ? others : pool
    const pick = choices[Math.floor(Math.random() * choices.length)]
    setSurprise(pick.id)
  }

  return (
    <div className="pt-6">
      <div className="px-5 flex items-center justify-between mb-5">
        <div>
          <p className="text-[12px] font-bold tracking-[0.12em] text-[var(--color-coral)]">{t(`greeting.${greetingKeyForTime()}`)}</p>
          <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)] mt-0.5">{t('home.subtitle')}</h1>
        </div>
        {ENABLE_LANGUAGE_SWITCHER && <LanguageSwitcher />}
      </div>

      {/* MY BAR summary */}
      <div className="px-5 mb-6">
        <button
          onClick={() => navigate('/my-bar')}
          className="w-full flex items-center justify-between bg-white rounded-[20px] border border-[var(--color-border)] p-4 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[var(--color-coral-light)] flex items-center justify-center text-[var(--color-coral)]">
              <GlassWater size={20} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold tracking-wide text-[var(--color-ink-soft)] uppercase">{t('home.myBarLabel')}</p>
              <p className="font-display font-bold text-[15px] text-[var(--color-ink)]">
                {t('home.myBarCount', { count: selectedIngredients.length })}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[13px] font-bold text-[var(--color-coral)]">
            {t('home.view')} <ArrowRight size={15} />
          </span>
        </button>

        <button
          onClick={() => navigate('/cocktails?mode=results')}
          className="w-full mt-3 py-4 rounded-2xl bg-[var(--color-coral)] text-white font-bold text-[15px] shadow-[0_8px_20px_-6px_rgba(255,107,74,0.55)] active:scale-[0.98] transition-transform"
        >
          {t('common.findCocktails')}
        </button>
      </div>

      {selectedIngredients.length === 0 && (
        <div className="mx-5 mb-6">
          <EmptyState
            icon={<GlassWater size={26} />}
            title={t('home.emptyTitle')}
            subtitle={t('home.emptySubtitle')}
            action={
              <button
                onClick={() => navigate('/my-bar')}
                className="px-5 py-2.5 rounded-full bg-[var(--color-coral)] text-white text-[13px] font-bold"
              >
                {t('home.chooseIngredients')}
              </button>
            }
          />
        </div>
      )}

      {/* YOU CAN MAKE */}
      {readyMatches.length > 0 && (
        <div className="mb-7">
          <SectionHeader
            title={t('home.youCanMake')}
            subtitle={t('common.cocktails', { count: readyMatches.length })}
            action={readyMatches.length > 4 ? t('common.seeAll') : undefined}
            onAction={() => navigate('/cocktails?mode=results&status=ready')}
          />
          <HorizontalScroll>
            {readyMatches.slice(0, 8).map((m) => (
              <div key={m.cocktail.id} className="snap-start shrink-0">
                <CocktailCard match={m} compact />
              </div>
            ))}
          </HorizontalScroll>
        </div>
      )}

      {/* ONE INGREDIENT AWAY */}
      {oneAwayMatches.length > 0 && (
        <div className="mb-7">
          <SectionHeader title={t('home.oneIngredientAway')} subtitle={t('home.oneIngredientAwaySubtitle')} />
          <div className="px-5 flex flex-col gap-3">
            {oneAwayMatches.map((m) => (
              <IngredientChecklistCard key={m.cocktail.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {/* TWO INGREDIENTS AWAY */}
      {twoAwayMatches.length > 0 && (
        <div className="mb-7">
          <SectionHeader title={t('home.twoIngredientsAway')} />
          <div className="px-5 flex flex-col gap-3">
            {twoAwayMatches.map((m) => (
              <IngredientChecklistCard key={m.cocktail.id} match={m} compact />
            ))}
          </div>
        </div>
      )}

      {/* TODAY'S PICK */}
      {todaysPick && (
        <div className="mb-7 px-5">
          <SectionHeader title={t('home.todaysPick')} icon={<Sparkles size={15} className="text-[var(--color-coral)]" />} />
          <button
            onClick={() => navigate(`/cocktail/${todaysPick.id}`)}
            className="w-full bg-white rounded-[24px] border border-[var(--color-border)] overflow-hidden text-left active:scale-[0.99] transition-transform"
          >
            <CocktailImage cocktail={todaysPick} size={480} rounded={false} className="w-full aspect-[16/10]" />
            <div className="p-4">
              <h3 className="font-display font-extrabold text-xl text-[var(--color-ink)]">{todaysPick.name}</h3>
              <p className="text-[13px] text-[var(--color-ink-soft)] mt-1">{todaysPick.tags.slice(0, 3).join(' · ')}</p>
              {todaysPickReady && (
                <p className="text-[12px] font-bold text-[var(--color-success)] mt-2">✓ {t('home.haveEverything')}</p>
              )}
              <span className="inline-block mt-3 text-[13px] font-bold text-white bg-[var(--color-coral)] px-4 py-2 rounded-full">
                {t('home.viewRecipe')}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* RECENTLY MADE */}
      {recentlyMadeCocktails.length > 0 && (
        <div className="mb-7">
          <SectionHeader title={t('home.recentlyMade')} icon={<Clock3 size={15} className="text-[var(--color-coral)]" />} />
          <HorizontalScroll>
            {recentlyMadeCocktails.map(({ entry, cocktail }) => (
              <button
                key={entry.madeAt}
                onClick={() => navigate(`/cocktail/${cocktail.id}`)}
                className="snap-start shrink-0 w-[110px] text-left"
              >
                <CocktailImage
                  cocktail={cocktail}
                  displayName={localize.cocktailName(cocktail.id, cocktail.name)}
                  size={110}
                />
                <p className="text-[12px] font-bold text-[var(--color-ink)] mt-1.5 truncate">
                  {localize.cocktailName(cocktail.id, cocktail.name)}
                </p>
                <p className="text-[11px] text-[var(--color-ink-soft)]">{formatRelativeTime(entry.madeAt)}</p>
              </button>
            ))}
          </HorizontalScroll>
        </div>
      )}

      {/* RECENTLY VIEWED */}
      {recentlyViewedCocktails.length > 0 && (
        <div className="mb-7">
          <SectionHeader title={t('home.recentlyViewed')} icon={<History size={15} className="text-[var(--color-coral)]" />} />
          <HorizontalScroll>
            {recentlyViewedCocktails.map((c) => {
              const m = matches.find((mm) => mm.cocktail.id === c.id)
              return (
                <div key={c.id} className="snap-start shrink-0">
                  <CocktailCard match={m} cocktail={c} compact />
                </div>
              )
            })}
          </HorizontalScroll>
        </div>
      )}

      {/* DON'T FEEL LIKE MIXING */}
      {quickEasy.length > 0 && (
        <div className="mb-7">
          <SectionHeader
            title={t('home.dontFeelLikeMixing')}
            subtitle={t('home.quickEasySubtitle')}
            icon={<Flame size={15} className="text-[var(--color-coral)]" />}
          />
          <HorizontalScroll>
            {quickEasy.map((c) => (
              <div key={c.id} className="snap-start shrink-0">
                <CocktailCard cocktail={c} compact />
              </div>
            ))}
          </HorizontalScroll>
        </div>
      )}

      {/* SURPRISE ME */}
      <div className="mb-7 px-5">
        <div className="bg-gradient-to-br from-[#FFF1E8] to-[#FFE3D3] rounded-[24px] p-5 border border-[var(--color-border)]">
          {!surprisePick ? (
            <div className="text-center">
              <h3 className="font-display font-extrabold text-lg text-[var(--color-ink)]">{t('home.surpriseTitle')}</h3>
              <p className="text-[13px] text-[var(--color-ink-soft)] mt-1 mb-4">
                {t('home.surpriseSubtitle')}
              </p>
              <button
                onClick={handleSurprise}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] text-white font-bold text-[14px] active:scale-[0.97] transition-transform"
              >
                <Dices size={17} /> {t('home.surpriseMe')}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-bold tracking-wide text-[var(--color-coral-dark)] uppercase mb-2">{t('home.yourRandomPick')}</p>
              <div className="flex items-center gap-3">
                <CocktailImage cocktail={surprisePick} size={72} />
                <div className="flex-1">
                  <h3 className="font-display font-extrabold text-lg text-[var(--color-ink)]">{surprisePick.name}</h3>
                  <p className="text-[12px] font-semibold text-[var(--color-success)]">{t('home.haveEverything')}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/cocktail/${surprisePick.id}/mix`)}
                  className="flex-1 py-2.5 rounded-full bg-[var(--color-coral)] text-white font-bold text-[13px] active:scale-[0.97] transition-transform"
                >
                  {t('home.startMixing')}
                </button>
                <button
                  onClick={handleSurprise}
                  className="flex-1 py-2.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-ink)] font-bold text-[13px] active:scale-[0.97] transition-transform"
                >
                  {t('home.tryAgain')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEASON'S BEST */}
      {seasonCocktails.length > 0 && (
        <div className="mb-7">
          <SectionHeader title={t('home.seasonsBest')} subtitle={t(`home.${SEASON_KEY[season]}`)} icon={<Sun size={15} className="text-[var(--color-coral)]" />} />
          <HorizontalScroll>
            {seasonCocktails.map((c) => {
              const m = matches.find((mm) => mm.cocktail.id === c.id)
              return (
                <div key={c.id} className="snap-start shrink-0">
                  <CocktailCard match={m} cocktail={c} compact />
                </div>
              )
            })}
          </HorizontalScroll>
        </div>
      )}

      {/* POPULAR COCKTAILS */}
      <div className="mb-4">
        <SectionHeader title={t('home.popularCocktails')} action={t('common.seeAll')} onAction={() => navigate('/cocktails')} />
        <HorizontalScroll>
          {popularCocktails.map((c) => {
            const m = matches.find((mm) => mm.cocktail.id === c.id)
            return (
              <div key={c.id} className="snap-start shrink-0">
                <CocktailCard match={m} cocktail={c} compact />
              </div>
            )
          })}
        </HorizontalScroll>
      </div>
    </div>
  )
}
