import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { getTheme, toggleTheme, type Theme } from "@/lib/theme"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getTheme())

  // Follow the system if the visitor never chose a theme themselves.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => {
      let hasChoice = false
      try {
        hasChoice = !!localStorage.getItem("nxt-theme")
      } catch {
        /* ignore */
      }
      if (!hasChoice) {
        const next: Theme = e.matches ? "dark" : "light"
        document.documentElement.classList.toggle("dark", e.matches)
        setTheme(next)
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const onToggle = () => setTheme(toggleTheme())

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-nxt-border text-nxt-text2 transition-colors hover:border-nxt-accent/50 hover:text-nxt-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="block"
        >
          {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
