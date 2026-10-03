import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { COCKTAILS } from '../data/cocktails'
import { buildMixingSteps } from '../lib/mixingSteps'
import { useAppStore } from '../store/useAppStore'
import RecipeTimer from '../components/RecipeTimer'
import { useLocalize } from '../i18n/localize'

export default function MixingMode() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const localize = useLocalize()
  const cocktail = COCKTAILS.find((c) => c.id === id)
  const addRecentlyMade = useAppStore((s) => s.addRecentlyMade)
  const steps = useMemo(() => (cocktail ? buildMixingSteps(cocktail, localize) : []), [cocktail, localize])
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  if (!cocktail) {
    return (
      <div className="pt-20 text-center px-6">
        <p className="text-[var(--color-ink-soft)]">{t('mixing.notFound')}</p>
      </div>
    )
  }

  const total = steps.length
  const step = steps[index]
  const isLast = index === total - 1

  function handleNext() {
    if (isLast) {
      addRecentlyMade(cocktail!.id)
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  function handleBack() {
    if (index === 0) navigate(-1)
    else setIndex((i) => i - 1)
  }

  return (
    <div className="fixed inset-0 z-95 bg-white flex flex-col safe-top safe-bottom" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => navigate(`/cocktail/${cocktail.id}`)} aria-label={t('common.close')} className="w-9 h-9 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center">
          <X size={18} />
        </button>
        {!finished && (
          <span className="text-[12px] font-bold text-[var(--color-ink-soft)]">
            {t('mixing.step', { current: index + 1, total })}
          </span>
        )}
        <div className="w-9" />
      </div>

      {!finished && (
        <div className="flex gap-1 px-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-[var(--color-coral)]' : 'bg-[var(--color-border)]'}`}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {finished ? (
          <>
            <p className="text-7xl mb-5">🍸</p>
            <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)]">{t('mixing.readyTitle')}</h1>
            <p className="text-[14px] text-[var(--color-ink-soft)] mt-2">
              {t('mixing.enjoy', { name: localize.cocktailName(cocktail.id, cocktail.name) })}
            </p>
          </>
        ) : (
          <>
            <p className="text-6xl mb-6">{step.emoji ?? '🍹'}</p>
            <h1 className="font-display font-extrabold text-[26px] text-[var(--color-ink)] leading-snug">{step.label}</h1>
            {step.timerSeconds && <RecipeTimer seconds={step.timerSeconds} />}
          </>
        )}
      </div>

      <div className="px-6 pb-6 flex gap-3">
        {!finished && index > 0 && (
          <button
            onClick={handleBack}
            className="px-5 py-4 rounded-2xl bg-[var(--color-bg-soft)] text-[var(--color-ink)] font-bold text-[15px]"
          >
            {t('mixing.back')}
          </button>
        )}
        <button
          onClick={finished ? () => navigate(`/cocktail/${cocktail.id}`) : handleNext}
          className="flex-1 py-4 rounded-2xl bg-[var(--color-coral)] text-white font-bold text-[16px] active:scale-[0.98] transition-transform"
        >
          {finished ? t('mixing.finish') : isLast ? t('mixing.done') : t('mixing.next')}
        </button>
      </div>
    </div>
  )
}
