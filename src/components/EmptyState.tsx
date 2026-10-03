import type { ReactNode } from 'react'

export default function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[var(--color-coral-light)] flex items-center justify-center mb-4 text-[var(--color-coral)]">
          {icon}
        </div>
      )}
      <h3 className="font-display font-bold text-lg text-[var(--color-ink)]">{title}</h3>
      {subtitle && <p className="text-sm text-[var(--color-ink-soft)] mt-2 max-w-[280px]">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
