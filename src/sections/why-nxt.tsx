import { motion, useReducedMotion } from "framer-motion"
import { CountUp } from "@/components/ui/count-up"

const reasons = [
  {
    num: 1,
    stat: 100,
    suffix: "%",
    title: "PRODUCT THINKING",
    body: "We start from the business problem, not the tech stack — every decision traces back to an outcome.",
  },
  {
    num: 2,
    stat: 1,
    suffix: "",
    title: "FULL-STACK TEAM",
    body: "One team from interface to infrastructure. No hand-offs, no gaps, no blame.",
  },
  {
    num: 3,
    stat: 38,
    suffix: "%",
    title: "MEASURABLE AI",
    body: "Practical AI where it measurably helps — agents and automation built into real workflows.",
  },
  {
    num: 4,
    stat: 0,
    suffix: "",
    title: "ABANDONED PROJECTS",
    body: "We build, then we stay. Systems that keep working as the business grows.",
  },
] as const

export function WhyNXT() {
  const reduce = useReducedMotion()

  return (
    <section id="why" className="relative bg-nxt-bg py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex items-end justify-between md:mb-24">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-nxt-accent">
              <span className="h-px w-8 bg-nxt-accent/50" />
              Why NXT
            </span>
            <h2 className="mt-5 font-display text-5xl font-semibold tracking-[-0.03em] text-nxt-text md:text-7xl">
              ONE TEAM.
            </h2>
          </div>
          <p className="hidden max-w-sm pb-2 text-sm leading-7 text-nxt-text2 md:block">
            Four reasons businesses choose us — and stay with us.
          </p>
        </div>

        <div className="divide-y divide-nxt-border/60 border-y border-nxt-border/60">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={reduce ? undefined : { opacity: 0, x: -32 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 py-10 md:grid-cols-[80px_160px_1fr] md:gap-x-10 md:py-14"
            >
              <span className="font-mono text-sm text-nxt-accent">
                0{r.num}
              </span>
              <span className="order-last col-span-2 font-display text-6xl font-bold tracking-tight text-nxt-text md:order-none md:col-span-1 md:text-7xl">
                {r.stat === 0 ? (
                  <span className="text-nxt-accent">ZERO</span>
                ) : (
                  <CountUp to={r.stat} suffix={r.suffix} />
                )}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-wide text-nxt-text md:text-2xl">
                  {r.title}
                </h3>
                <p className="mt-2 max-w-xl leading-7 text-nxt-text2">{r.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
