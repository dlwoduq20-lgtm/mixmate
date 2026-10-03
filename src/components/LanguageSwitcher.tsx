import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const lang = i18n.language === 'ko' ? 'ko' : 'en'

  function setLang(next: 'en' | 'ko') {
    i18n.changeLanguage(next)
  }

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="inline-flex bg-white border border-[var(--color-border)] rounded-full p-1 shrink-0"
    >
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
          lang === 'en' ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ko')}
        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
          lang === 'ko' ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)]'
        }`}
      >
        한국어
      </button>
    </div>
  )
}
