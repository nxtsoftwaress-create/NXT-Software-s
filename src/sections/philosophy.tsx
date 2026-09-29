import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

const lines = [
  {
    text: "GOOD SOFTWARE",
    accent: "SOLVES PROBLEMS.",
    align: "text-left",
  },
  {
    text: "GREAT SOFTWARE",
    accent: "CHANGES HOW PEOPLE WORK.",
    align: "md:text-right",
  },
] as const

export function Philosophy() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const xA = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"])
  const xB = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-nxt-navy py-28 md:py-44"
      aria-label="NXT philosophy"
    >
      {/* faint oversized background word */}
      <span
        aria-hidden="true"
        className="text-stroke-faint pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[22vw] font-bold leading-none opacity-[0.06]"
      >
        THINK
      </span>

      <div className="relative mx-auto max-w-6xl px-6">
        {lines.map((l, i) => (
          <motion.div
            key={l.text}
            style={reduce ? undefined : { x: i === 0 ? xA : xB }}
            className={l.align}
          >
            <motion.p
              initial={reduce ? undefined : { opacity: 0, y: 40 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-nxt-text sm:text-6xl md:text-7xl"
            >
              {l.text}
              <br />
              <span className="text-nxt-accent">{l.accent}</span>
            </motion.p>
          </motion.div>
        ))}

        <motion.div
          initial={reduce ? undefined : { scaleX: 0 }}
          whileInView={reduce ? undefined : { scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="metal-line mt-16 h-px w-full origin-left md:mt-24"
        />

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs uppercase tracking-[0.25em] text-nxt-muted">
          <span>Think — before code</span>
          <span>Build — with precision</span>
          <span>Evolve — after launch</span>
        </div>
      </div>
    </section>
  )
}
