import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { en } from './en'
import { ko } from './ko'
import { ENABLE_LANGUAGE_SWITCHER } from '../config/featureFlags'

const instance = i18n.use(initReactI18next)
if (ENABLE_LANGUAGE_SWITCHER) instance.use(LanguageDetector)

instance.init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  // Korean-only launch: pin the language and skip browser/localStorage
  // detection entirely while ENABLE_LANGUAGE_SWITCHER is off, so every
  // visitor sees Korean regardless of device settings or a stale saved
  // choice from before this flag existed.
  ...(ENABLE_LANGUAGE_SWITCHER ? {} : { lng: 'ko' }),
  fallbackLng: 'en',
  supportedLngs: ['en', 'ko'],
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  detection: {
    // Remembers the viewer's choice across reloads; falls back to their
    // browser/device language on first launch. Only used once the
    // language switcher is re-enabled.
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'mixmate-language',
  },
})

export default i18n
