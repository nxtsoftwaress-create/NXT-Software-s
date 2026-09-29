import { useRef, useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import { Plus } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

const stages = [
  { name: "DISCOVER", desc: "Goals, users and constraints — we learn the business before touching code.", tags: ["Goals", "Users", "Risks", "Scope"] },
  { name: "DEFINE", desc: "Requirements become a clear roadmap with priorities and estimates.", tags: ["Requirements", "Roadmap", "Estimates"] },
  { name: "DESIGN", desc: "Wireframes to polished UI — clickable prototypes before development.", tags: ["Wireframes", "UI Design", "Prototype"] },
  { name: "DEVELOP", desc: "Working software in visible increments — you see progress every week.", tags: ["Frontend", "Backend", "APIs", "Cloud"] },
  { name: "TEST", desc: "Manual and automated QA across devices, loads and edge cases.", tags: ["QA", "Automation", "Security"] },
  { name: "DEPLOY", desc: "Zero-drama launches — CI/CD pipelines, monitoring and backups in place.", tags: ["CI/CD", "Monitoring", "Backups"] },
  { name: "SUPPORT", desc: "We stay — maintenance, new features and evolution as the business grows.", tags: ["Maintenance", "Features", "SLA"] },
] as const

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section id="process" className="relative bg-nxt-bg py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="How We Build"
          title={
            <>
              FROM IDEA
              <br />
              TO PRODUCT.
            </>
          }
        />

        <div ref={ref} className="relative pl-10 md:pl-16">
          {/* Track + progress line */}
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[7px] top-2 w-px bg-nxt-border md:left-[11px]"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute bottom-4 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-nxt-accent via-nxt-accent to-nxt-accent/40 md:left-[11px]"
          />

          <div className="space-y-2">
            {stages.map((s, i) => {
              const isOpen = open === i
              return (
                <div key={s.name} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -left-10 top-7 h-[15px] w-[15px] rounded-full border-2 md:-left-16",
                      isOpen
                        ? "border-nxt-accent bg-nxt-accent/30"
                        : "border-nxt-border bg-nxt-bg",
                    )}
                  />
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-5 border-b border-nxt-border/50 py-6 text-left transition-colors hover:border-nxt-accent/30"
                  >
                    <span
                      className={cn(
                        "font-mono text-sm",
                        isOpen ? "text-nxt-accent" : "text-nxt-muted",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-display text-2xl font-semibold tracking-wide transition-colors md:text-4xl",
                        isOpen ? "text-nxt-text" : "text-nxt-text2 group-hover:text-nxt-text",
                      )}
                    >
                      {s.name}
                    </span>
                    <Plus
                      size={20}
                      className={cn(
                        "shrink-0 text-nxt-muted transition-transform duration-300",
                        isOpen && "rotate-45 text-nxt-accent",
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-10 md:pl-14">
                          <p className="max-w-xl leading-7 text-nxt-text2">{s.desc}</p>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {s.tags.map((t) => (
                              <li
                                key={t}
                                className="rounded-full border border-nxt-border px-3 py-1 text-xs text-nxt-muted"
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
