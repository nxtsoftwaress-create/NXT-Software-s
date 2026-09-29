import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Globe,
  Smartphone,
  BrainCircuit,
  Workflow,
  ArrowUp,
  Lightbulb,
  ArrowRight,
} from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

const options = [
  {
    key: "website",
    label: "BUILD A WEBSITE",
    icon: Globe,
    kicker: "WEBSITE",
    title: "A website that earns attention.",
    note: "Fast, editorial and search-ready. We design around your message, not a template.",
    flow: ["Brand & goals", "Design system", "Build & CMS", "Launch & SEO"],
  },
  {
    key: "app",
    label: "BUILD AN APP",
    icon: Smartphone,
    kicker: "APPLICATION",
    title: "Software your team relies on daily.",
    note: "Web or mobile — structured data, clean UX and infrastructure that scales.",
    flow: ["Scope & users", "Prototypes", "Development", "Release"],
  },
  {
    key: "ai",
    label: "BUILD AN AI SYSTEM",
    icon: BrainCircuit,
    kicker: "AI SYSTEM",
    title: "AI that understands your business.",
    note: "We start from the business problem, design the AI system around it, integrate it with your tools — and measure the result.",
    flow: ["Problem", "AI system", "Integration", "Business result"],
  },
  {
    key: "automate",
    label: "AUTOMATE MY BUSINESS",
    icon: Workflow,
    kicker: "AUTOMATION",
    title: "Give hours back to your team.",
    note: "We audit your workflows, automate the repetitive core and keep humans in charge of judgment calls.",
    flow: ["Audit", "Automate", "Integrate", "Monitor"],
  },
  {
    key: "upgrade",
    label: "UPGRADE MY SOFTWARE",
    icon: ArrowUp,
    kicker: "MODERNIZATION",
    title: "Legacy code, future-proof again.",
    note: "Incremental modernization — same business logic, modern stack, less risk.",
    flow: ["Assessment", "Migration plan", "Refactor", "Cutover"],
  },
  {
    key: "idea",
    label: "I HAVE AN IDEA",
    icon: Lightbulb,
    kicker: "NEW VENTURE",
    title: "From sketch to shipping product.",
    note: "Discovery, an MVP roadmap and a senior team that has shipped before.",
    flow: ["Discovery", "MVP scope", "Build", "Iterate"],
  },
] as const

export function Solutions() {
  const [active, setActive] = useState(2)
  const opt = options[active]

  return (
    <section id="solutions" className="relative bg-nxt-bg py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Solutions"
          title="WHAT ARE YOU TRYING TO SOLVE?"
          description="Pick the closest match — we shape the rest together."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div role="radiogroup" aria-label="Business problems" className="grid gap-3 sm:grid-cols-2">
            {options.map((o, i) => {
              const Icon = o.icon
              const isActive = i === active
              return (
                <button
                  key={o.key}
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group flex items-center gap-4 rounded-lg border px-5 py-5 text-left transition-all duration-300",
                    isActive
                      ? "border-nxt-accent/50 bg-nxt-hover"
                      : "border-nxt-border bg-nxt-card hover:border-nxt-border hover:bg-nxt-hover/60",
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-nxt-accent" : "text-nxt-muted",
                    )}
                  />
                  <span
                    className={cn(
                      "font-display text-sm font-semibold tracking-wide md:text-base",
                      isActive ? "text-nxt-text" : "text-nxt-text2",
                    )}
                  >
                    {o.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative overflow-hidden rounded-xl border border-nxt-border bg-nxt-section p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={opt.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-nxt-accent">
                  {opt.kicker}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-nxt-text md:text-3xl">
                  {opt.title}
                </h3>
                <p className="mt-4 leading-7 text-nxt-text2">{opt.note}</p>

                <ol className="mt-8 space-y-3">
                  {opt.flow.map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-nxt-accent/40 font-mono text-[10px] text-nxt-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-nxt-text2">{step}</span>
                    </li>
                  ))}
                </ol>

                <a
                  href="#consultation"
                  className="mt-8 inline-flex items-center gap-2 border-b border-nxt-accent/40 pb-1 text-sm font-medium text-nxt-accent transition-colors hover:border-nxt-accent hover:text-nxt-accent-bright"
                >
                  Discuss this solution
                  <ArrowRight size={15} />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
