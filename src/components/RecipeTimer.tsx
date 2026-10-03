import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function RecipeTimer({ seconds }: { seconds: number }) {
  const { t } = useTranslation()
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function start() {
    setRunning(true)
    setDone(false)
    setRemaining(seconds)
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setRunning(false)
          setDone(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {done ? (
        <p className="text-2xl font-display font-extrabold text-[var(--color-success)]">{t('mixing.timerDone')}</p>
      ) : (
        <p className="text-6xl font-display font-extrabold tabular-nums text-[var(--color-ink)]">{remaining}</p>
      )}
      {!running && (
        <button
          onClick={start}
          className="px-6 py-3 rounded-full bg-[var(--color-ink)] text-white font-bold text-[14px] active:scale-[0.97] transition-transform"
        >
          {done ? t('mixing.restartTimer') : t('mixing.startTimer')}
        </button>
      )}
    </div>
  )
}
