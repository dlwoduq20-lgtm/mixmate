// Thin wrapper around Google Analytics 4 (gtag.js).
//
// MIXMATE is a single-page app using HashRouter (routes are "#/cocktail/x"
// rather than real navigations), so GA's automatic pageview tracking would
// only ever see the one initial load. We load gtag.js with automatic
// pageview sending turned off, then send a page_view event ourselves every
// time the route changes (wired up in App.tsx's ScrollToTop, which already
// fires on every pathname change).

import { GA_MEASUREMENT_ID, ENABLE_ANALYTICS } from '../config/analytics'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

let initialized = false

export function initAnalytics() {
  if (!ENABLE_ANALYTICS || initialized || typeof window === 'undefined') return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
}

export function trackPageView(path: string) {
  if (!ENABLE_ANALYTICS || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
  })
}

// GA4's recommended `exception` event — shows up under Reports > Engagement
// > Events > exception, and can be turned into a dashboard/alert there.
// `description` is capped short because GA4 truncates long event params;
// the full message + stack trace is kept locally instead (see errorLog.ts).
export function trackError(message: string, fatal: boolean) {
  if (!ENABLE_ANALYTICS || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'exception', {
    description: message.slice(0, 150),
    fatal,
  })
}
