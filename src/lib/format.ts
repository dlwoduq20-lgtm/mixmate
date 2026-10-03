export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr} hr ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`
  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 5) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`
  return new Date(timestamp).toLocaleDateString()
}

export function formatAmount(amount: number | null, unit: string): string {
  if (amount === null) return unit
  if (unit === 'ml') return `${amount} ml`
  if (unit === 'dash') return `${amount} dash${amount !== 1 ? 'es' : ''}`
  if (unit === 'leaf') return `${amount} ${amount !== 1 ? 'leaves' : 'leaf'}`
  return `${amount} ${unit}`
}

// Korean amount formatting: numbers + Korean unit names, no English
// pluralization. `unitKo` should already be the localized unit label
// (see useLocalize().unit).
export function formatAmountKo(amount: number | null, unitKo: string): string {
  if (amount === null) return unitKo
  return `${amount}${unitKo}`
}
