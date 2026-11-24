declare global {
  interface Window {
    /** Defined by the inline gtag.js snippet in index.html. */
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export {}
