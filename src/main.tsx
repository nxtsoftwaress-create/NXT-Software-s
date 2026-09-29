import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Dismiss the pre-React loading screen once the app has mounted, then tell
// the welcome popup it can start its ~2s hold (see welcome-popup.tsx).
const boot = document.getElementById("nxt-boot")
if (boot) {
  const elapsed = performance.now() - (
    (window as { __nxtBootStart?: number }).__nxtBootStart ?? performance.now()
  )
  const hold = Math.max(0, 600 - elapsed)
  window.setTimeout(() => {
    boot.classList.add("done")
    ;(window as { __nxtBootDone?: boolean }).__nxtBootDone = true
    window.dispatchEvent(new Event("nxt:boot-done"))
    window.setTimeout(() => boot.remove(), 700)
  }, hold)
}
