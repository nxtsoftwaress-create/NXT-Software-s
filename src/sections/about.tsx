import { motion, useReducedMotion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"

const cells = [
  {
    title: "OUR STORY",
    body: "NXT began with a simple observation: most businesses don't need more software — they need software that finally fits. We started small, stayed technical, and grew by shipping systems people actually use.",
  },
  {
    title: "MISSION",
    body: "Engineer digital products that remove friction between people and their work — quietly, reliably, long after launch.",
  },
  {
    title: "APPROACH",
    body: "One senior team. Direct communication. Working software early, improved continuously.",
  },
  {
    title: "WHAT MAKES US DIFFERENT",
    body: "We think in products, build full-stack, integrate AI where it measurably helps — and we stay after launch.",
  },
] as const

export function About() {
  const reduce = useReducedMotion()

  return (
    <section id="about" className="relative bg-nxt-section py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="About"
              title={
                <>
                  WE ARE <span className="text-nxt-accent">NXT.</span>
                </>
              }
            />

            {/* Mask reveal typography */}
            <div className="font-display text-xl font-medium leading-relaxed tracking-tight text-nxt-text2 md:text-2xl">
              {["A SOFTWARE TEAM", "BUILDING DIGITAL", "SYSTEMS FOR", "REAL BUSINESSES."].map(
                (line, i) => (
                  <div key={line} className="overflow-hidden">
                    <motion.div
                      initial={reduce ? undefined : { y: "110%" }}
                      whileInView={reduce ? undefined : { y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {line}
                    </motion.div>
                  </div>
                ),
              )}
            </div>

            {/* Equation */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm"
            >
              {["IDEAS", "TECHNOLOGY", "EXECUTION"].map((p, i) => (
                <span key={p} className="flex items-center gap-3">
                  <span className="rounded border border-nxt-border bg-nxt-card px-3 py-1.5 text-nxt-text2">
                    {p}
                  </span>
                  <span className="text-nxt-accent">{i < 2 ? "+" : "="}</span>
                </span>
              ))}
              <span className="rounded border border-nxt-accent/50 bg-nxt-accent/10 px-3 py-1.5 font-semibold text-nxt-accent">
                NXT
              </span>
            </motion.div>
          </div>

          <div className="grid content-start gap-4 sm:grid-cols-2">
            {cells.map((c, i) => (
              <motion.div
                key={c.title}
                initial={reduce ? undefined : { opacity: 0, y: 32 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-lg border border-nxt-border bg-nxt-card p-7"
              >
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-nxt-accent">
                  {c.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-nxt-text2">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
