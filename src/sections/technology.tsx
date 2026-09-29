import { SectionHeading } from "@/components/ui/section-heading"
import { BlurredMarquee } from "@/components/ui/blurred-marquee"
import { TECH_LOGOS } from "@/lib/tech-logos"

export function Technology() {
  return (
    <section id="technology" className="relative bg-nxt-navy py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Stack"
          title={
            <>
              POWERED BY
              <br />
              MODERN TECHNOLOGY.
            </>
          }
          align="center"
          className="[&_p]:mx-auto"
        />
      </div>

      {/* infinite tech-logo strip — full-bleed, edge to edge */}
      <div className="mt-16 md:mt-20">
        <BlurredMarquee
          logos={TECH_LOGOS}
          className="w-full max-w-none md:border-x-0"
        />
      </div>

      <p className="mt-6 text-center text-xs uppercase tracking-[0.25em] text-nxt-muted">
        chosen per project — never for its own sake
      </p>
    </section>
  )
}
