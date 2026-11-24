import { useEffect, useRef } from "react"

const MEASUREMENT_ID = "G-J72BE1GE9Y"

/**
 * Resolve the app's current "route". This app has no router library: legal
 * pages are hash routes ("#/legal/privacy"), everything else is the single
 * home document.
 */
function currentRoute() {
  const hash = window.location.hash
  return hash.startsWith("#/") ? hash.slice(1) : window.location.pathname + window.location.search
}

/** "#/legal/privacy" is a route; "#services" is an in-page section anchor. */
function isRouteHash(hash: string) {
  return hash === "" || hash.startsWith("#/")
}

/**
 * Sends GA4 page_view hits for client-side route changes.
 *
 * The initial load is already counted by gtag('config', ...) in index.html, so
 * the route present at mount is recorded and never sent again. We deliberately
 * use the "page_view" event instead of calling gtag('config') on each change,
 * which would re-initialise the stream and emit its own hit.
 */
export function Analytics() {
  const lastSent = useRef<string | null>(null)

  useEffect(() => {
    // Path already counted by the gtag('config') call on page load.
    lastSent.current = currentRoute()

    const onHashChange = () => {
      // Ignore "#services"-style scroll anchors: same page, no new pageview.
      if (!isRouteHash(window.location.hash)) return

      const route = currentRoute()
      if (route === lastSent.current) return
      lastSent.current = route

      window.gtag?.("event", "page_view", {
        send_to: MEASUREMENT_ID,
        page_path: route,
        page_location: window.location.href,
        page_title: document.title,
      })
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return null
}
