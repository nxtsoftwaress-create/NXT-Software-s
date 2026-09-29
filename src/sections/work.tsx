import { useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import {
  FintechMock,
  RetailMock,
  HealthMock,
} from "@/components/ui/dashboard-mocks"
import { cn } from "@/lib/utils"

const projects = [
  {
    id: "01",
    name: "MERIDIAN",
    kind: "Fintech platform",
    desc: "Real-time payments dashboard with fraud signals and merchant analytics.",
    tags: ["Web app", "Data viz", "AI"],
    gradient: "a",
    glyph: "◈",
  },
  {
    id: "02",
    name: "ATLAS COMMERCE",
    kind: "Retail system",
    desc: "Omnichannel inventory engine with demand forecasting across 40 stores.",
    tags: ["E-commerce", "Automation"],
    gradient: "b",
    glyph: "▲",
  },
  {
    id: "03",
    name: "VERA HEALTH",
    kind: "Healthcare AI",
    desc: "Patient triage assistant reducing queue times by 38% in first quarter.",
    tags: ["AI agent", "Mobile"],
    gradient: "c",
    glyph: "◉",
  },
] as const

export function Work() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const mocks = [FintechMock, RetailMock, HealthMock]
  const ActiveMock = mocks[active]

  return (
    <section id="work" className="relative bg-nxt-bg py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Our Work"
          title="SELECTED WORK."
          description="A sample of systems we've shipped. Details under NDA — the results speak."
        />

        <div ref={ref} className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Stage */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-nxt-border">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={projects[active].id}
                className={cn(
                  /* theme-aware stage: dark product shot in dark mode,
                     light product shot in light mode (ink via .nxt-mock) */
                  "nxt-mock absolute inset-0",
                  projects[active].gradient === "a" && "nxt-stage-a",
                  projects[active].gradient === "b" && "nxt-stage-b",
                  projects[active].gradient === "c" && "nxt-stage-c",
                )}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* live product-UI mock inside the stage */}
                <div className="absolute inset-0 flex flex-col p-4 sm:p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                    <span className="ml-2 font-mono text-[10px] tracking-widest text-white/40">
                      {projects[active].kind.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-white/[0.07] bg-black/30">
                    <ActiveMock reduce={reduce} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Selector */}
          <div>
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={cn(
                  "group block w-full border-b border-nxt-border/60 py-6 text-left transition-colors first:pt-0",
                  i === active ? "text-nxt-text" : "text-nxt-muted hover:text-nxt-text2",
                )}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={cn(
                      "font-mono text-xs",
                      i === active ? "text-nxt-accent" : "text-nxt-muted/60",
                    )}
                  >
                    {p.id}
                  </span>
                  <div className="flex-1">
                    <span className="font-display text-xl font-semibold tracking-wide md:text-2xl">
                      {p.name}
                    </span>
                    <p className="mt-1 text-sm leading-6 text-nxt-text2">{p.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-nxt-border px-2.5 py-0.5 text-[11px] text-nxt-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className={cn(
                      "transition-all",
                      i === active
                        ? "text-nxt-accent opacity-100"
                        : "opacity-0 group-hover:opacity-50",
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
