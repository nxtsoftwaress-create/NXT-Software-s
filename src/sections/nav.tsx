import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const links = [
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
]

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[9000] transition-colors duration-500",
          scrolled
            ? "border-b border-nxt-border/60 bg-nxt-bg/80 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
          <a
            href="#hero"
            className="font-display text-lg font-bold tracking-tight text-nxt-text"
          >
            NXT<span className="metal-text-shimmer ml-1 text-xs font-medium tracking-[0.3em]">SOFTWARES</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-nxt-text2 transition-colors hover:text-nxt-text"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#consultation"
              className="hidden items-center gap-1.5 rounded-full border border-nxt-accent/40 bg-nxt-accent/10 px-4 py-2 text-sm font-medium text-nxt-accent transition-colors hover:bg-nxt-accent/20 md:inline-flex"
            >
              Let's Talk
              <ArrowUpRight size={15} />
            </a>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-nxt-text md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 z-[8999] border-b border-nxt-border bg-nxt-bg/95 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 py-4">
              <div className="mb-2 flex items-center justify-between border-b border-nxt-border/60 pb-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-nxt-muted">
                  Appearance
                </span>
                <ThemeToggle />
              </div>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 font-display text-lg text-nxt-text2 hover:bg-nxt-hover hover:text-nxt-text"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#consultation"
                onClick={() => setOpen(false)}
                className="metal-surface mt-3 rounded-md px-3 py-3 text-center font-medium"
              >
                Let's Talk
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
