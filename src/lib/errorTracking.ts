// Single entry point for reporting a runtime error, wherever it's caught
// from: a React render crash (ErrorBoundary), an uncaught exception
// (window 'error'), or a rejected promise nobody awaited ('unhandledrejection').
// Every path goes through here so an error always ends up in both places —
// GA4 (aggregate, for "is this happening a lot") and the local error log
// (full detail, for "what exactly broke, on this device").

import { trackError } from './analytics'
import { logErrorLocally, type LoggedError } from './errorLog'

export function reportError(
  error: unknown,
  source: LoggedError['source'],
  fatal = false,
) {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  if (import.meta.env.DEV) {
    console.error(`[error-tracking:${source}]`, error)
  }

  logErrorLocally({
    message: message || '(no message)',
    stack,
    source,
    path: typeof window !== 'undefined' ? window.location.hash || window.location.pathname : '',
  })

  trackError(message || '(no message)', fatal)
}

export function installGlobalErrorTracking() {
  if (typeof window === 'undefined') return

  window.addEventListener('error', (event) => {
    reportError(event.error ?? event.message, 'window')
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, 'promise')
  })
}
