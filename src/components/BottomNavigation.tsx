import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, GlassWater, Martini, Heart } from 'lucide-react'

const TABS = [
  { to: '/', key: 'home', icon: Home, end: true },
  { to: '/my-bar', key: 'myBar', icon: GlassWater, end: false },
  { to: '/cocktails', key: 'cocktails', icon: Martini, end: false },
  { to: '/favorites', key: 'favorites', icon: Heart, end: false },
] as const

export default function BottomNavigation() {
  const { t } = useTranslation()
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-80 bg-white/95 backdrop-blur border-t border-[var(--color-border)] safe-bottom"
      style={{ maxWidth: 480, margin: '0 auto' }}
    >
      <div className="flex items-stretch justify-around px-2 pt-1.5">
        {TABS.map(({ to, key, icon: Icon, end }) => {
          const label = t(`nav.${key}`)
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-4 min-w-[64px] rounded-2xl transition-colors ${
                  isActive ? 'text-[var(--color-coral)]' : 'text-[var(--color-ink-soft)]'
                }`
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 1.9} />
                  <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
