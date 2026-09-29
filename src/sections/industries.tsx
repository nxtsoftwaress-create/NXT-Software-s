import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

const industries = [
  { name: "FINTECH", tag: "Money moves faster in good systems.", items: ["Payments infrastructure", "Fraud detection", "Customer dashboards", "AI advisors"] },
  { name: "RETAIL", tag: "Selling is a system, not a struggle.", items: ["E-commerce builds", "Inventory systems", "Personalization", "Demand forecasting"] },
  { name: "HOSPITALITY", tag: "Service that scales without losing warmth.", items: ["Digital ordering", "Reservations", "AI support", "Analytics"] },
  { name: "HEALTHCARE", tag: "Care supported by calm software.", items: ["Patient portals", "Scheduling systems", "AI triage assistants", "Data security"] },
  { name: "REAL ESTATE", tag: "Property, minus the paperwork.", items: ["Listing platforms", "CRM automation", "Document workflows", "Market analytics"] },
  { name: "EDUCATION", tag: "Learning platforms people actually use.", items: ["Learning platforms", "Student portals", "AI tutoring", "Progress analytics"] },
  { name: "STARTUPS", tag: "From idea to MVP, fast.", items: ["MVP development", "Product strategy", "Cloud architecture", "Investor-ready demos"] },
  { name: "SMALL BUSINESS", tag: "Big-business tools, right-sized.", items: ["Websites that convert", "Booking systems", "Invoicing & billing", "Affordable AI tools"] },
] as const

export function Industries() {
  const targetRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-78%"])

  return (
    <section id="industries" className="relative bg-nxt-navy">
      <div ref={targetRef} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-6">
            <SectionHeading
              eyebrow="Industries"
              title={
                <>
                  BUILT FOR
                  <br />
                  REAL BUSINESS.
                </>
              }
              className="mb-8 md:mb-12"
            />

            <motion.div
              style={reduce ? undefined : { x }}
              className="flex gap-6"
            >
              {industries.map((ind, i) => (
                <article
                  key={ind.name}
                  className={cn(
                    "group relative w-[82vw] shrink-0 overflow-hidden rounded-xl border border-nxt-border bg-nxt-section p-8 sm:w-[60vw] md:w-[42vw] lg:w-[36vw] xl:w-[30vw]",
                  )}
                >
                  <span className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-[7rem] font-bold leading-none text-nxt-border/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-nxt-accent">
                    {ind.name}
                  </span>
                  <p className="mt-4 font-display text-xl font-semibold tracking-tight text-nxt-text md:text-2xl">
                    {ind.tag}
                  </p>
                  <ul className="mt-6 space-y-2 border-t border-nxt-border/60 pt-6">
                    {ind.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-sm text-nxt-text2">
                        <span className="h-1 w-1 rounded-full bg-nxt-accent" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
