// Google Analytics 4 (GA4) configuration.
//
// Measurement ID for the "MIXMATE Web" GA4 property (created 2026-09-30,
// account/property set up directly in analytics.google.com). This value is
// public by design — it's meant to sit in client-side code and shows up in
// the page source and outgoing network requests, so it's not a secret and
// doesn't need to be hidden behind an env var.
export const GA_MEASUREMENT_ID = 'G-W1FTWVW53V'

// Master switch. Set to `false` to stop sending any analytics data at all
// (e.g. while developing locally) without touching src/lib/analytics.ts.
export const ENABLE_ANALYTICS = true
