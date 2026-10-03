// Lightweight local error log, persisted to localStorage. Complements GA4
// (see analytics.ts): GA4 gives aggregate counts but takes up to 48h to
// show up and truncates the error message, so this keeps the last N raw
// errors (with a stack trace, when available) directly on the device,
// readable any time from the hidden /debug/errors page — useful for
// catching a bug on a real phone with no dev tools attached.

import { APP_CONFIG } from '../config/app'

export interface LoggedError {
  id: string
  timestamp: number
  message: string
  stack?: string
  source: 'react' | 'window' | 'promise'
  path: string
}

const STORAGE_KEY = `${APP_CONFIG.storagePrefix}-error-log`
const MAX_ERRORS = 30

function readAll(): LoggedError[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function logErrorLocally(entry: Omit<LoggedError, 'id' | 'timestamp'>) {
  try {
    const errors = readAll()
    const next: LoggedError = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      ...entry,
    }
    errors.unshift(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(errors.slice(0, MAX_ERRORS)))
  } catch {
    // localStorage full/unavailable — nothing more we can do locally.
  }
}

export function getLoggedErrors(): LoggedError[] {
  return readAll()
}

export function clearLoggedErrors() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
