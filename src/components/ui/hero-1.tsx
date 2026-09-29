"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
}: HeroProps) {
  return (
    <section
      id="hero"
      className="
        relative mx-auto w-full
        min-h-screen
        overflow-hidden
        bg-transparent
        px-6 pt-40
        text-center
        md:px-8
      "
    >
      {/* Grid Background */}
      <div
        className="
          absolute inset-x-0 top-0 -z-10
          h-[600px] w-full
          opacity-30
          bg-[linear-gradient(to_right,rgb(var(--nxt-border))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--nxt-border))_1px,transparent_1px)]
          bg-[size:6rem_5rem]
          [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]
        "
      />

      {/* Silver Radial Accent */}
      <div
        className="
          absolute
          left-1/2
          top-[calc(100%-150px)]
          h-[500px]
          w-[1100px]
          -translate-x-1/2
          rounded-[100%]
          bg-[radial-gradient(closest-side,rgb(var(--nxt-glow)/0.08),transparent)]
          blur-2xl
        "
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href="#services" className="group">
          <span
            className="
              mx-auto flex w-fit
              items-center justify-center
              rounded-3xl
              border border-nxt-accent/20
              bg-nxt-card/80
              px-5 py-2
              text-sm uppercase
              tracking-[0.15em]
              text-nxt-text2
              backdrop-blur
            "
          >
            {eyebrow}

            <ChevronRight
              className="
                ml-2 h-4 w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </span>
        </a>
      )}

      {/* Hero Title */}
      <h1
        className="
          mx-auto
          max-w-6xl
          animate-fade-in
          py-8
          text-balance
          bg-gradient-to-br
          from-nxt-text
          via-nxt-text
          to-nxt-text2
          bg-clip-text
          text-5xl
          font-semibold
          leading-none
          tracking-[-0.06em]
          text-transparent
          opacity-0
          sm:text-6xl
          md:text-7xl
          lg:text-8xl
        "
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="
          mx-auto
          mb-12
          max-w-2xl
          animate-fade-in
          text-balance
          text-lg
          tracking-tight
          text-nxt-text2
          opacity-0
          md:text-xl
        "
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex justify-center">
          <Button
            asChild
            className="
              z-20
              w-fit
              metal-surface
              px-8
              py-6
              text-lg
              font-semibold
              tracking-tight
              transition-all
              duration-300
              hover:brightness-110
              hover:shadow-[0_0_40px_rgb(var(--nxt-glow)/0.15)]
            "
          >
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>
      )}

      {/* Bottom Fade */}
      <div
        className="
          relative
          mt-32
          h-40
          animate-fade-up
          opacity-0
          [perspective:2000px]
          after:absolute
          after:inset-0
          after:z-50
          after:bg-[linear-gradient(to_top,rgb(var(--nxt-bg))_10%,transparent)]
        "
      />
    </section>
  )
}
