import { useState } from "react"
import { motion } from "framer-motion"
import {
  LayoutGrid,
  BrainCircuit,
  Workflow,
  Globe,
  Smartphone,
  Gauge,
  ArrowRight,
} from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

const items = [
  {
    key: "digital",
    label: "DIGITAL PRODUCTS",
    icon: LayoutGrid,
    title: "Products, taken end to end.",
    desc: "From idea → architecture → deployment. We design, build and ship products that live in the real world.",
    chips: ["Product strategy", "UX & UI", "Web & mobile", "Launch support"],
    visual: "journey",
  },
  {
    key: "ai",
    label: "AI SOLUTIONS",
    icon: BrainCircuit,
    title: "AI woven into your workflow.",
    desc: "Agents, chatbots and data intelligence built around your business logic — not generic demos.",
    chips: ["AI agents", "Chatbots", "Data intelligence", "Integrations"],
    visual: "neural",
  },
  {
    key: "automation",
    label: "AUTOMATION",
    icon: Workflow,
    title: "Manual work, replaced by systems.",
    desc: "We map repetitive processes and replace them with reliable, measurable automation.",
    chips: ["Process mapping", "Integrations", "Dashboards", "Monitoring"],
    visual: "flow",
  },
  {
    key: "web",
    label: "WEB APPLICATIONS",
    icon: Globe,
    title: "Web apps that hold up under load.",
    desc: "Type-safe, cloud-native web applications designed to scale with your business.",
    chips: ["React & TypeScript", "APIs", "Cloud", "Security"],
    visual: "browser",
  },
  {
    key: "mobile",
    label: "MOBILE APPLICATIONS",
    icon: Smartphone,
    title: "Mobile, done properly.",
    desc: "Native-feeling iOS and Android apps with clean state, offline handling and analytics.",
    chips: ["iOS", "Android", "Cross-platform", "App store delivery"],
    visual: "phone",
  },
  {
    key: "consulting",
    label: "CONSULTING",
    icon: Gauge,
    title: "Direction before development.",
    desc: "Architecture reviews, technology selection and roadmaps from senior engineers.",
    chips: ["Architecture", "Tech selection", "AI strategy", "Audits"],
    visual: "plan",
  },
] as const

/** Small generated visuals — no stock photos, GPU-friendly CSS/SVG. */
function Visual({ kind }: { kind: (typeof items)[number]["visual"] }) {
  if (kind === "journey") {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        {["IDEA", "ARCHITECTURE", "DEPLOYMENT"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 sm:gap-3">
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-center",
                i === 0
                  ? "border-nxt-accent/40 bg-nxt-accent/10"
                  : "border-nxt-border bg-nxt-card",
              )}
            >
              <b className="block font-display text-[11px] tracking-widest text-nxt-text sm:text-xs">{s}</b>
              <span className="text-[10px] text-nxt-muted">
                {["requirements", "system design", "live product"][i]}
              </span>
            </div>
            {i < 2 && <ArrowRight size={14} className="shrink-0 text-nxt-accent/60" />}
          </div>
        ))}
      </div>
    )
  }
  if (kind === "neural") {
    return (
      <div className="grid h-32 w-full place-items-center">
        <svg viewBox="0 0 320 120" className="w-full max-w-md" aria-hidden="true">
          {[
            [40, 30],
            [40, 90],
            [160, 20],
            [160, 60],
            [160, 100],
            [280, 40],
            [280, 80],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" className="fill-nxt-card" stroke={i === 3 ? "rgb(var(--nxt-accent))" : "rgb(var(--nxt-border))"} strokeWidth="1.5" />
          ))}
          {[
            [40, 30, 160, 20],
            [40, 30, 160, 60],
            [40, 90, 160, 60],
            [40, 90, 160, 100],
            [160, 20, 280, 40],
            [160, 60, 280, 40],
            [160, 60, 280, 80],
            [160, 100, 280, 80],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgb(var(--nxt-border))"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.08 }}
            />
          ))}
        </svg>
      </div>
    )
  }
  if (kind === "flow") {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {["MANUAL", "AI / AUTOMATED", "INTEGRATED"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 sm:gap-3">
            <div
              className={cn(
                "rounded-lg border px-4 py-2.5 text-xs font-medium tracking-wider",
                i === 1
                  ? "border-nxt-accent/40 bg-nxt-accent/10 text-nxt-accent"
                  : "border-nxt-border bg-nxt-card text-nxt-text2",
              )}
            >
              {s}
            </div>
            {i < 2 && <ArrowRight size={14} className="text-nxt-muted" />}
          </div>
        ))}
      </div>
    )
  }
  if (kind === "browser") {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-nxt-border bg-nxt-card">
        <div className="flex items-center gap-1.5 border-b border-nxt-border px-3 py-2">
          <i className="h-2 w-2 rounded-full bg-nxt-border" />
          <i className="h-2 w-2 rounded-full bg-nxt-border" />
          <i className="h-2 w-2 rounded-full bg-nxt-accent/50" />
          <em className="ml-2 text-[10px] not-italic text-nxt-muted">nxtsoftwares.com</em>
        </div>
        <div className="space-y-2 p-4">
          <div className="h-3 w-1/3 rounded bg-nxt-accent/30" />
          <div className="h-2 w-3/4 rounded bg-nxt-border" />
          <div className="h-2 w-2/3 rounded bg-nxt-border" />
        </div>
      </div>
    )
  }
  if (kind === "phone") {
    return (
      <div className="w-32 rounded-2xl border border-nxt-border bg-nxt-card p-3">
        <i className="mx-auto block h-1.5 w-10 rounded-full bg-nxt-border" />
        <div className="mt-3 space-y-2">
          <div className="h-2.5 w-3/4 rounded bg-nxt-accent/30" />
          <div className="h-2 rounded bg-nxt-border" />
          <div className="h-2 w-5/6 rounded bg-nxt-border" />
        </div>
        <div className="mt-3 h-7 rounded-md bg-nxt-accent/80" />
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {["TODAY", "90 DAYS", "GOAL"].map((s, i) => (
        <div key={s} className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-center",
              i === 2
                ? "border-nxt-accent/40 bg-nxt-accent/10"
                : "border-nxt-border bg-nxt-card",
            )}
          >
            <b className="block font-display text-[11px] tracking-widest text-nxt-text">{s}</b>
            <span className="text-[10px] text-nxt-muted">
              {["audit", "roadmap", "direction"][i]}
            </span>
          </div>
          {i < 2 && <span className="h-px w-6 bg-nxt-border sm:w-10" />}
        </div>
      ))}
    </div>
  )
}

export function Services() {
  const [active, setActive] = useState(0)
  const item = items[active]

  return (
    <section id="services" className="relative bg-nxt-bg py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              WHAT WE BUILD
            </>
          }
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Tab list */}
          <div role="tablist" aria-label="Services" className="flex flex-col">
            {items.map((it, i) => {
              const Icon = it.icon
              const isActive = i === active
              return (
                <button
                  key={it.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group flex items-center gap-4 border-b border-nxt-border/60 py-5 text-left transition-colors first:border-t md:py-6",
                    isActive ? "text-nxt-text" : "text-nxt-muted hover:text-nxt-text2",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-xs",
                      isActive ? "text-nxt-accent" : "text-nxt-muted/60",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-lg font-semibold tracking-wide md:text-xl">
                    {it.label}
                  </span>
                  <Icon
                    size={18}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-nxt-accent" : "text-nxt-muted/50 group-hover:text-nxt-muted",
                    )}
                  />
                </button>
              )
            })}
          </div>

          {/* Panel */}
          <div className="relative overflow-hidden rounded-xl border border-nxt-border bg-nxt-section p-8 md:p-12">
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 flex min-h-[140px] items-center justify-center rounded-lg border border-nxt-border/60 bg-nxt-card/50 p-6">
                <Visual kind={item.visual} />
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-nxt-text md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-xl leading-7 text-nxt-text2">{item.desc}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {item.chips.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-nxt-border px-3 py-1 text-xs text-nxt-text2"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
