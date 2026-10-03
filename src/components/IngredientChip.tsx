import { Check, Plus } from 'lucide-react'
import type { Ingredient } from '../types'

export default function IngredientChip({
  ingredient,
  displayName,
  selected,
  onToggle,
}: {
  ingredient: Ingredient
  displayName?: string
  selected: boolean
  onToggle: () => void
}) {
  const label = displayName ?? ingredient.name
  return (
    <button
      onClick={onToggle}
      aria-label={label}
      aria-pressed={selected}
      className={`flex items-center gap-2 pl-2.5 pr-3.5 py-2.5 rounded-2xl border text-[13px] font-semibold transition-colors active:scale-[0.97] ${
        selected
          ? 'bg-[var(--color-coral)] border-[var(--color-coral)] text-white'
          : 'bg-white border-[var(--color-border)] text-[var(--color-ink)]'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          selected ? 'bg-white/25' : 'bg-[var(--color-bg-soft)] border border-[var(--color-border)]'
        }`}
      >
        {selected ? <Check size={12} strokeWidth={3} className="text-white" /> : <Plus size={12} className="text-[var(--color-ink-soft)]" />}
      </span>
      {label}
    </button>
  )
}
