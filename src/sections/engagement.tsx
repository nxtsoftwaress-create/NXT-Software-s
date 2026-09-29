import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Check, Plus } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

const projectTypes = ["Website", "Web App", "Mobile App", "AI Solution", "Custom Software"]

export function Engagement() {
  const [projectType, setProjectType] = useState(0)

  return (
    <section id="engagement" className="relative bg-nxt-navy py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Engagement"
          title="HOW CAN WE WORK TOGETHER?"
          description="Three ways in — each with its own rhythm, contract and outcome."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 1 · PROJECT — interactive selector */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-nxt-border bg-nxt-section p-8"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-nxt-muted">
              Option 01
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-wide text-nxt-text">
              PROJECT
            </h3>
            <p className="mt-2 text-sm text-nxt-text2">
              For businesses with a defined requirement.
            </p>

            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Project type">
              {projectTypes.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setProjectType(i)}
                  aria-pressed={projectType === i}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                    projectType === i
                      ? "border-nxt-accent/60 bg-nxt-accent/10 text-nxt-accent"
                      : "border-nxt-border text-nxt-text2 hover:border-nxt-accent/30 hover:text-nxt-text",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={projectType}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-6 border-l-2 border-nxt-accent/50 pl-4 text-sm leading-6 text-nxt-text2"
              >
                A fixed-scope build: {projectTypes[projectType].toLowerCase()} from
                kickoff to launch — with weekly demos and a single point of contact.
              </motion.p>
            </AnimatePresence>

            <a
              href="#consultation"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-nxt-accent transition-colors hover:text-nxt-accent-bright"
            >
              Start a project <ArrowRight size={15} />
            </a>
          </motion.article>

          {/* 2 · PARTNERSHIP — checklist */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-xl border border-nxt-accent/30 bg-nxt-section p-8"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-nxt-accent">
              Option 02 — Most chosen
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-wide text-nxt-text">
              PARTNERSHIP
            </h3>
            <p className="mt-2 text-sm text-nxt-text2">
              For businesses that need continuous development.
            </p>

            <ul className="mt-8 space-y-3">
              {["Monthly development capacity", "Maintenance & monitoring", "New features on roadmap", "Direct technical support"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-nxt-text2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-nxt-accent/40">
                    <Check size={12} className="text-nxt-accent" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#consultation"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-nxt-accent transition-colors hover:text-nxt-accent-bright"
            >
              Become a partner <ArrowRight size={15} />
            </a>
          </motion.article>

          {/* 3 · CONSULTING — accordion */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-nxt-border bg-nxt-section p-8"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-nxt-muted">
              Option 03
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-wide text-nxt-text">
              CONSULTING
            </h3>
            <p className="mt-2 text-sm text-nxt-text2">
              For businesses that need technical direction.
            </p>

            <div className="mt-8 space-y-1">
              {[
                ["Architecture", "System design reviews and scaling plans."],
                ["Technology selection", "Choosing stacks that fit — not trend."],
                ["AI strategy", "Where AI helps, where it doesn't."],
                ["Technical audit", "Risk, cost and quality assessment."],
              ].map(([title, body]) => (
                <details key={title} className="group border-b border-nxt-border/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm text-nxt-text2 transition-colors hover:text-nxt-text [&::-webkit-details-marker]:hidden">
                    {title}
                    <Plus
                      size={15}
                      className="text-nxt-muted transition-transform duration-300 group-open:rotate-45 group-open:text-nxt-accent"
                    />
                  </summary>
                  <p className="pb-4 text-sm leading-6 text-nxt-muted">{body}</p>
                </details>
              ))}
            </div>

            <a
              href="#consultation"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-nxt-accent transition-colors hover:text-nxt-accent-bright"
            >
              Get direction <ArrowRight size={15} />
            </a>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
