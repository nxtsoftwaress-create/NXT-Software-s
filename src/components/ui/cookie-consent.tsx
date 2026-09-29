import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Cookie } from "lucide-react"
import { LEGAL_ROUTES } from "@/lib/site"

const CONSENT_KEY = "nxt-cookie-consent"

export function hasCookieConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted"
  } catch {
    return false
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let choice: string | null = null
    try {
      choice = localStorage.getItem(CONSENT_KEY)
    } catch {
      /* storage unavailable — show banner, declining is default */
    }
    if (choice) return

    const t = window.setTimeout(() => setVisible(true), 1400)
    return () => window.clearTimeout(t)
  }, [])

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[9000] mx-auto max-w-2xl rounded-xl border border-nxt-border bg-nxt-card/95 p-5 shadow-[0_16px_60px_rgb(0_0_0/0.35)] backdrop-blur-xl sm:bottom-6 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-nxt-border bg-nxt-bg/60">
              <Cookie size={17} strokeWidth={1.5} className="text-nxt-accent" />
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold tracking-wide text-nxt-text">
                We use minimal cookies
              </p>
              <p className="mt-1 text-xs leading-relaxed text-nxt-muted">
                Only what&apos;s needed: your theme preference and anonymous
                traffic stats. No ads, no tracking pixels. Read our{" "}
                <a
                  href={LEGAL_ROUTES.cookies}
                  className="underline underline-offset-2 hover:text-nxt-accent"
                >
                  Cookie Policy
                </a>
                .
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => decide("accepted")}
                  className="metal-surface rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all duration-300 hover:brightness-110"
                >
                  Accept
                </button>
                <button
                  onClick={() => decide("declined")}
                  className="rounded-full border border-nxt-border px-5 py-2 text-xs font-medium text-nxt-text2 transition-colors hover:border-nxt-accent/40 hover:text-nxt-text"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent
