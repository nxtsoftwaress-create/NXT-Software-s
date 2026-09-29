import * as React from "react"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  title: React.ReactNode
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-14 md:mb-20",
        align === "center" ? "text-center" : "",
        className,
      )}
    >
      <Reveal>
        <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-nxt-accent">
          <span className="h-px w-8 bg-nxt-accent/50" />
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-nxt-accent/50" />}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-nxt-text sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-7 text-nxt-text2 md:text-lg md:leading-8">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
