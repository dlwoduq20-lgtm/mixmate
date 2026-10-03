import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

export default function SectionHeader({
  title,
  subtitle,
  action,
  onAction,
  icon,
}: {
  title: string
  subtitle?: string
  action?: string
  onAction?: () => void
  icon?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between px-5 mb-3">
      <div>
        <div className="flex items-center gap-1.5">
          {icon}
          <h2 className="text-[15px] font-extrabold tracking-wide text-[var(--color-ink)] uppercase">{title}</h2>
        </div>
        {subtitle && <p className="text-[13px] text-[var(--color-ink-soft)] mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center text-[13px] font-semibold text-[var(--color-coral)] shrink-0"
        >
          {action}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
