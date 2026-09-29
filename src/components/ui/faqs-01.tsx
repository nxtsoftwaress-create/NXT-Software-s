import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL, EMAIL_HELLO } from "@/lib/site";

const faqs = [
  {
    q: "What does NXT Softwares build?",
    a: "Web platforms, AI systems, dashboards, and digital experiences — engineered end to end. Strategy, design, build, and launch live under one roof, so nothing gets lost between vendors.",
  },
  {
    q: "How do we start working together?",
    a: "Book a consultation through this site or message us on WhatsApp. We scope your idea in a free 30-minute call, then send a fixed proposal with milestones — usually within two business days.",
  },
  {
    q: "How much does a project cost?",
    a: "Fixed-scope projects start around ₹1L; retained product and AI work is quoted monthly. You get an exact number after the scoping call — no hourly surprises, no hidden line items.",
  },
  {
    q: "How long does a typical build take?",
    a: "A marketing site ships in 2–3 weeks. Product builds and AI systems typically run 6–12 weeks depending on scope. You see progress weekly, in a shared staging environment.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Yes. We regularly take founders from idea to first shipped version, and structure engagements so the MVP budget stays lean while the architecture stays scalable.",
  },
  {
    q: "What happens after launch?",
    a: "Every build includes a warranty window for fixes. Beyond that, most clients move to a support retainer — monitoring, improvements, and a direct line to the team that built it.",
  },
];

export default function Faqs01({ defaultValue }: { defaultValue?: string }) {
  return (
    <section id="faq" className="bg-nxt-bg py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-nxt-border bg-nxt-card px-3 py-1 text-xs font-medium text-nxt-text2">
            <Sparkles className="size-3 text-nxt-accent-bright" />
            FAQ
          </span>
          <h2
            className="text-balance font-display font-semibold tracking-tight text-nxt-text"
            style={{
              fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
            }}
          >
            Frequently asked questions
          </h2>
          <p className="max-w-xl text-balance text-nxt-text2">
            Quick answers to the questions we get the most. Can&apos;t find
            yours? Write to{" "}
            <a
              href={`mailto:${EMAIL_HELLO}`}
              className="font-medium text-nxt-text underline-offset-4 hover:underline"
            >
              {EMAIL_HELLO}
            </a>
            .
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-12"
          defaultValue={defaultValue}
        >
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="border-nxt-border"
            >
              <AccordionTrigger className="text-nxt-text">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-nxt-text2">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-nxt-border bg-nxt-card/40 p-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nxt-accent-bright to-nxt-accent text-black">
              <MessageCircle className="size-4" />
            </span>
            <div className="flex flex-col leading-tight">
              <p className="text-sm font-medium text-nxt-text">
                Still have a question?
              </p>
              <p className="text-xs text-nxt-muted">
                We reply within four business hours.
              </p>
            </div>
          </div>
          <Button size="sm" className="rounded-full" asChild>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Ask us anything
              <ArrowRight />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
