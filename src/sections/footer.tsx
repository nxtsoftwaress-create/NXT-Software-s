import { ArrowUp, Github, Linkedin, MessageCircle } from "lucide-react"
import { GITHUB_URL, LINKEDIN_URL, WHATSAPP_URL, LEGAL_ROUTES } from "@/lib/site"

const marqueeItems = [
  "Web Products",
  "AI Systems",
  "Mobile Apps",
  "Automation",
  "Consulting",
  "Built For Real Business",
]

const socials = [
  { icon: MessageCircle, label: "WhatsApp", href: WHATSAPP_URL },
  { icon: Linkedin, label: "LinkedIn", href: LINKEDIN_URL },
  { icon: Github, label: "GitHub", href: GITHUB_URL },
]

const legalLinks = [
  { label: "Privacy Policy", href: LEGAL_ROUTES.privacy },
  { label: "Terms & Conditions", href: LEGAL_ROUTES.terms },
  { label: "Cookie Policy", href: LEGAL_ROUTES.cookies },
  { label: "Refund Policy", href: LEGAL_ROUTES.refunds },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-nxt-border bg-nxt-bg">
      {/* marquee */}
      <div className="mask-fade-x overflow-hidden border-b border-nxt-border/60 py-5" aria-hidden="true">
        <div className="animate-marquee flex w-max items-center gap-8">
          {[...marqueeItems, ...marqueeItems].map((m, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-sm tracking-[0.2em] text-nxt-muted">
              {m.toUpperCase()}
              <span className="text-nxt-accent/60">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-3xl font-bold tracking-tight text-nxt-text md:text-4xl">
              Ready to build?
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#consultation"
                className="rounded-full border border-nxt-accent/40 bg-nxt-accent/10 px-5 py-2.5 text-sm text-nxt-accent transition-colors hover:bg-nxt-accent/20"
              >
                Book a Consultation
              </a>
              <a
                href="#consultation"
                className="rounded-full border border-nxt-border px-5 py-2.5 text-sm text-nxt-text2 transition-colors hover:border-nxt-accent/30 hover:text-nxt-text"
              >
                Start a Project
              </a>
            </div>

            {/* socials */}
            <div className="mt-8 flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-nxt-border text-nxt-text2 transition-all duration-300 hover:border-nxt-accent/50 hover:bg-nxt-accent/10 hover:text-nxt-accent"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
              <span className="ml-2 text-xs uppercase tracking-[0.2em] text-nxt-muted">
                +91 85000 95512
              </span>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
            {[
              ["Services", "#services"],
              ["Solutions", "#solutions"],
              ["Industries", "#industries"],
              ["Work", "#work"],
              ["About", "#about"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="py-1.5 text-nxt-text2 transition-colors hover:text-nxt-accent"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* giant wordmark */}
        <div className="pointer-events-none mt-16 select-none overflow-hidden" aria-hidden="true">
          <div className="text-stroke-faint text-center font-display text-[26vw] font-bold leading-[0.8] opacity-40 md:text-[20vw]">
            NXT
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-nxt-border/60 pt-8 text-xs text-nxt-muted md:flex-row">
          <span>© {new Date().getFullYear()} NXT Softwares · All rights reserved</span>

          {/* legal links */}
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-nxt-accent"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#hero"
              aria-label="Back to top"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-nxt-border text-nxt-text2 transition-colors hover:border-nxt-accent/40 hover:text-nxt-accent"
            >
              <ArrowUp size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
