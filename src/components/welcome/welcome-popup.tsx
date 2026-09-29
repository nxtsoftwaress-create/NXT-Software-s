"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

/** How long the welcome card holds once the loading screen has revealed it. */
const HOLD_MS = 1800

interface WelcomePopupProps {
  onComplete?: () => void
}

export function WelcomePopup({ onComplete }: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(true)

  const close = () => {
    setIsOpen(false)
    setTimeout(() => onComplete?.(), 700)
  }

  // Auto-dismiss: start the hold only after the boot/loading screen has
  // revealed this popup (it waits for "nxt:boot-done"), so the visitor gets
  // a full ~2s welcome beat before the cinematic exit into the hero.
  useEffect(() => {
    let timer: number | undefined
    const start = () => {
      if (timer !== undefined) return
      timer = window.setTimeout(close, HOLD_MS)
    }
    if ((window as { __nxtBootDone?: boolean }).__nxtBootDone) start()
    window.addEventListener("nxt:boot-done", start)
    const failsafe = window.setTimeout(start, 5000)
    return () => {
      window.removeEventListener("nxt:boot-done", start)
      window.clearTimeout(timer)
      window.clearTimeout(failsafe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-nxt-bg font-body"
          initial={{ opacity: 1 }}
          onClick={close}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nxt-accent/[0.04] blur-[120px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(rgb(var(--nxt-accent)) 1px, transparent 1px),
                linear-gradient(90deg, rgb(var(--nxt-accent)) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
            {/* Small eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.45em" }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 text-[11px] font-medium uppercase text-nxt-muted sm:text-xs"
            >
              Welcome to
            </motion.div>

            {/* Big metallic wordmark — hero type treatment scaled so
                "NXT SOFTWARES" always sits on one line */}
            <motion.h1
              initial={{ opacity: 0, y: 28, letterSpacing: "0.08em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "-0.075em" }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-metallic whitespace-nowrap text-[clamp(1.9rem,7vw,7.5rem)] font-medium leading-[0.86] tracking-[-0.075em]"
            >
              NXT SOFTWARES
            </motion.h1>

            {/* Metallic hairline under the wordmark */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
              className="metal-line mt-8 h-px w-40 origin-center sm:w-56"
            />
          </div>

          {/* Auto-advance indicator: metallic line filling across the bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
            className="absolute bottom-8 left-0 right-0 h-px origin-left bg-gradient-to-r from-nxt-accent/60 via-nxt-accent-bright/60 to-transparent"
          />

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="absolute left-0 right-0 top-8 h-px origin-center bg-gradient-to-r from-transparent via-nxt-accent/30 to-transparent"
          />

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="absolute bottom-8 left-0 right-0 h-px origin-center bg-gradient-to-r from-transparent via-nxt-accent/20 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
