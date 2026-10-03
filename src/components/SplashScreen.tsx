import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Martini } from 'lucide-react'
import { APP_CONFIG } from '../config/app'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 250)
    const t2 = setTimeout(() => setPhase('out'), 1500)
    const t3 = setTimeout(onDone, 1900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-gradient-to-b from-[#FF6B4A] to-[#E8734A] transition-opacity duration-400 ${
        phase === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ maxWidth: 480, margin: '0 auto' }}
    >
      <div
        className={`flex flex-col items-center transition-all duration-500 ${
          phase === 'in' ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white/15 mb-5">
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
          <Martini size={44} strokeWidth={1.8} className="text-white relative" />
        </div>
        <h1 className="text-white text-4xl font-extrabold tracking-tight">{APP_CONFIG.name}</h1>
        <p className="text-white/85 text-sm mt-3 font-medium">{t('splash.tagline')}</p>
      </div>
    </div>
  )
}
