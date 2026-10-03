import { useTranslation } from 'react-i18next'
import { Check, Repeat } from 'lucide-react'
import type { MatchStatus } from '../types'

export function StatusPill({
  status,
  missingCount,
  substitutedCount = 0,
}: {
  status: MatchStatus
  missingCount: number
  // How many required ingredients this status counts via an owned stand-in
  // rather than an exact match (see CocktailMatch.substitutedIngredients).
  // Purely a transparency cue — never changes the status itself.
  substitutedCount?: number
}) {
  const { t } = useTranslation()

  if (status === 'READY') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-success)] bg-[var(--color-success-light)] px-2 py-1 rounded-full">
        <Check size={12} strokeWidth={3} /> {t('common.readyToMix')}
        {substitutedCount > 0 && (
          <Repeat size={11} strokeWidth={3} className="ml-0.5" aria-label={t('common.usesSubstitute')} />
        )}
      </span>
    )
  }
  if (status === 'ONE_AWAY') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-coral-dark)] bg-[var(--color-coral-light)] px-2 py-1 rounded-full">
        {t('common.oneAway')}
        {substitutedCount > 0 && (
          <Repeat size={11} strokeWidth={3} aria-label={t('common.usesSubstitute')} />
        )}
      </span>
    )
  }
  if (status === 'TWO_AWAY') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B8935A] bg-[#FDF1DC] px-2 py-1 rounded-full">
        {t('common.twoAway')}
        {substitutedCount > 0 && (
          <Repeat size={11} strokeWidth={3} aria-label={t('common.usesSubstitute')} />
        )}
      </span>
    )
  }
  if (status === 'POSSIBLE') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-ink-soft)] bg-[#F1ECE8] px-2 py-1 rounded-full">
        {t('common.missingCount', { count: missingCount })}
        {substitutedCount > 0 && (
          <Repeat size={11} strokeWidth={3} aria-label={t('common.usesSubstitute')} />
        )}
      </span>
    )
  }
  return null
}
