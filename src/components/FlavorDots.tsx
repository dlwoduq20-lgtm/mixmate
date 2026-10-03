export default function FlavorDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < value ? 'bg-[var(--color-coral)]' : 'bg-[var(--color-border)]'}`}
        />
      ))}
    </span>
  )
}
