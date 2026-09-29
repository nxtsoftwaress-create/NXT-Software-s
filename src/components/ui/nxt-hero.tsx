import { useEffect, useState, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundPaths } from "@/components/ui/background-paths";

export type NXTHeroProps = {
  /** Ref for scroll-linked parallax on the background layer. */
  scrollRef?: RefObject<HTMLDivElement | null>;
  eyebrow?: string;
  /** First headline line — solid ink. */
  titleSolid?: string;
  /** Second headline line — chrome shimmer. */
  titleChrome?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/** Tracks the site theme (html.dark) without re-render storms. */
function useSiteTheme(): "dark" | "light" {
  const [mode, setMode] = useState<"dark" | "light">(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setMode(root.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

/**
 * NXT hero: chrome stage with flowing metallic paths, theme-aware —
 * black + silver in dark mode, ivory + graphite in light mode. The
 * background drifts gently on scroll for depth; the copy stays put.
 */
export function NXTHero({
  scrollRef,
  eyebrow = "NXT SOFTWARES",
  titleSolid = "WE ENGINEER",
  titleChrome = "WHAT'S NEXT",
  subtitle = "Digital products, AI systems, and technology solutions engineered for modern businesses.",
  ctaLabel = "Start a Project",
  ctaHref = "#consultation",
}: NXTHeroProps) {
  const mode = useSiteTheme();
  const dark = mode === "dark";

  const ink = dark
    ? {
        section: "bg-nxt-bg text-nxt-text",
        solid: "text-[#F5F5F5]",
        chrome: "bg-[linear-gradient(110deg,#666B70_0%,#FFFFFF_22%,#AEB2B7_42%,#FFFFFF_55%,#6F7378_78%,#D8DADD_100%)]",
        sub: "text-[#AEB2B7]",
        eyebrow: "text-[#AEB2B7]",
        rule: "to-[#73777D]",
        glow: "bg-white/[0.025]",
        vignette: "bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,5,5,0.55)_100%)]",
        fade: "from-nxt-bg",
      }
    : {
        section: "bg-nxt-bg text-nxt-text",
        solid: "text-[#17181A]",
        chrome: "bg-[linear-gradient(110deg,#565A61_0%,#17181A_22%,#4A4E54_42%,#17181A_55%,#565A61_78%,#3A3D42_100%)]",
        sub: "text-nxt-text2",
        eyebrow: "text-nxt-text2",
        rule: "to-[rgb(var(--nxt-accent))]",
        glow: "bg-black/[0.02]",
        vignette: "bg-[radial-gradient(circle_at_center,transparent_35%,rgba(250,250,249,0.6)_100%)]",
        fade: "from-nxt-bg",
      };

  const { scrollYProgress } = useScroll({
    target: scrollRef ?? undefined,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  return (
    <section
      id="hero"
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${ink.section}`}
    >
      {/* Flowing metallic paths — two mirrored curve families weaving across
          the stage. Drifts down + dims as the hero scrolls away. */}
      <motion.div
        style={{ y: bgY, opacity: bgOpacity }}
        className="absolute inset-0"
      >
        <BackgroundPaths mode={mode} />
      </motion.div>

      {/* Faint radial glow behind the headline */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] ${ink.glow}`}
        />
      </div>

      {/* Edge vignette + top/bottom fades for stage depth */}
      <div className={`pointer-events-none absolute inset-0 ${ink.vignette}`} />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent ${ink.fade}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent ${ink.fade}`}
      />

      {/* Hero content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto w-full max-w-6xl text-center">
          {/* Brand eyebrow */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <span
              className={`h-px w-10 bg-gradient-to-r from-transparent ${ink.rule}`}
            />
            <span
              className={`text-[11px] font-medium tracking-[0.45em] ${ink.eyebrow}`}
            >
              {eyebrow}
            </span>
            <span
              className={`h-px w-10 bg-gradient-to-l from-transparent ${ink.rule}`}
            />
          </div>

          {/* Headline — solid line + chrome shimmer line */}
          <h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.075em]">
            <span className={`block ${ink.solid}`}>{titleSolid}</span>
            <span
              className={`block animate-[shimmer_5s_linear_infinite] bg-[length:250%_100%] bg-clip-text text-transparent ${ink.chrome}`}
            >
              {titleChrome}
            </span>
          </h1>

          {/* Description */}
          <p
            className={`mx-auto mt-10 max-w-2xl text-base leading-7 md:text-lg ${ink.sub}`}
          >
            {subtitle}
          </p>

          {/* CTA — site-wide metal button + moving shine sweep */}
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              className="
                group relative overflow-hidden rounded-md
                metal-surface
                px-10 py-4 text-sm font-medium text-black
                transition-all duration-500
                hover:scale-[1.03]
                hover:shadow-[0_0_45px_rgba(216,218,221,0.18)]
              "
            >
              <a href={ctaHref}>
                <span
                  aria-hidden="true"
                  className="
                    absolute inset-y-0 -left-20 z-0 w-16 rotate-[20deg]
                    bg-white/70 blur-md transition-all duration-700
                    group-hover:left-[120%]
                  "
                />
                <span className="relative z-10">{ctaLabel}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NXTHero;
