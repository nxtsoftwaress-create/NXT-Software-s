export type Theme = "dark" | "light"

const STORAGE_KEY = "nxt-theme"

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.background = theme === "dark" ? "#050505" : "#fafaf9"
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = theme === "dark" ? "#050505" : "#fafaf9"
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* private mode — ignore */
  }
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark"
  applyTheme(next)
  return next
}
