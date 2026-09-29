import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"
import { EMAIL_HELLO } from "@/lib/site"

const step1 = [
  "Website",
  "Web Application",
  "Mobile Application",
  "AI Solution",
  "Automation",
  "Custom Software",
  "Not Sure",
]
const step3 = ["Just an idea", "Planning", "Existing product", "Need improvements", "Need ongoing development"]
const step4 = ["ASAP", "This month", "1–3 months", "Just exploring"]

interface FormState {
  build: string
  idea: string
  stage: string
  start: string
  name: string
  email: string
  company: string
  phone: string
}

const initial: FormState = {
  build: "",
  idea: "",
  stage: "",
  start: "",
  name: "",
  email: "",
  company: "",
  phone: "",
}

const TOTAL = 5

export function Consultation() {
  const [step, setStep] = useState(0) // 0..4, 5 = done
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FormState>(initial)
  const [error, setError] = useState("")

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const canNext = () => {
    if (step === 0) return form.build !== ""
    if (step === 1) return form.idea.trim().length > 3
    if (step === 2) return form.stage !== ""
    if (step === 3) return form.start !== ""
    if (step === 4) return form.name.trim() !== "" && /\S+@\S+\.\S+/.test(form.email)
    return true
  }

  const go = (d: number) => {
    setError("")
    setDir(d)
    setStep((s) => Math.min(Math.max(s + d, 0), TOTAL))
  }

  const next = () => {
    if (!canNext()) {
      setError(step === 4 ? "Please add your name and a valid email." : "Choose an option to continue.")
      return
    }
    go(1)
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: 40 * d }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -40 * d }),
  }

  return (
    <section id="consultation" className="relative bg-nxt-bg py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Start Here"
          title="LET'S FIND YOUR PATH."
          align="center"
          className="[&_p]:mx-auto"
        />

        <div className="overflow-hidden rounded-xl border border-nxt-border bg-nxt-card">
          {/* Progress */}
          <div className="border-b border-nxt-border px-6 py-5 md:px-10">
            <div className="flex items-center gap-2" aria-hidden="true">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-nxt-border">
                  <motion.div
                    className="h-full bg-nxt-accent"
                    initial={false}
                    animate={{ scaleX: step > i ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs tracking-widest text-nxt-muted" aria-live="polite">
              {step < TOTAL ? `STEP ${step + 1} / ${TOTAL}` : "COMPLETE"}
            </p>
          </div>

          <div className="relative min-h-[380px] px-6 py-10 md:px-10">
            <AnimatePresence mode="wait" custom={dir}>
              {step === 0 && (
                <motion.fieldset key="s0" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <legend className="question">WHAT DO YOU WANT TO BUILD?</legend>
                  <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {step1.map((o) => (
                      <Choice key={o} label={o} active={form.build === o} onClick={() => set("build", o)} />
                    ))}
                  </div>
                </motion.fieldset>
              )}

              {step === 1 && (
                <motion.fieldset key="s1" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <legend className="question">TELL US ABOUT YOUR IDEA.</legend>
                  <label htmlFor="idea" className="sr-only">Your idea</label>
                  <textarea
                    id="idea"
                    rows={5}
                    value={form.idea}
                    onChange={(e) => set("idea", e.target.value)}
                    placeholder="A few sentences are enough — what should it do, and for whom?"
                    className="mt-6 w-full resize-none rounded-lg border border-nxt-border bg-nxt-bg px-4 py-3 text-sm leading-7 text-nxt-text placeholder:text-nxt-muted focus:border-nxt-accent/50 focus:outline-none"
                  />
                </motion.fieldset>
              )}

              {step === 2 && (
                <motion.fieldset key="s2" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <legend className="question">WHAT STAGE ARE YOU AT?</legend>
                  <div className="mt-6 flex flex-col gap-2.5">
                    {step3.map((o) => (
                      <Choice key={o} label={o} active={form.stage === o} onClick={() => set("stage", o)} />
                    ))}
                  </div>
                </motion.fieldset>
              )}

              {step === 3 && (
                <motion.fieldset key="s3" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <legend className="question">WHEN WOULD YOU LIKE TO START?</legend>
                  <div className="mt-6 flex flex-col gap-2.5">
                    {step4.map((o) => (
                      <Choice key={o} label={o} active={form.start === o} onClick={() => set("start", o)} />
                    ))}
                  </div>
                </motion.fieldset>
              )}

              {step === 4 && (
                <motion.fieldset key="s4" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <legend className="question">HOW CAN WE CONTACT YOU?</legend>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field id="cName" label="Name *" value={form.name} onChange={(v) => set("name", v)} autoComplete="name" />
                    <Field id="cEmail" label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} autoComplete="email" />
                    <Field id="cCompany" label="Company" value={form.company} onChange={(v) => set("company", v)} autoComplete="organization" />
                    <Field id="cPhone" label="Phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} autoComplete="tel" />
                  </div>
                </motion.fieldset>
              )}

              {step === TOTAL && (
                <motion.div key="done" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 160 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-nxt-accent/50 bg-nxt-accent/10"
                  >
                    <Check size={24} className="text-nxt-accent" />
                  </motion.span>
                  <h3 className="mt-8 font-display text-3xl font-bold tracking-tight text-nxt-text md:text-4xl">
                    THANK YOU.
                  </h3>
                  <p className="mt-3 font-display text-lg text-nxt-accent">
                    WE UNDERSTAND WHAT YOU'RE LOOKING FOR.
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-7 text-nxt-text2">
                    {form.build} · {form.stage} · starting {form.start.toLowerCase()}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <a
                      href={`mailto:${EMAIL_HELLO}?subject=${encodeURIComponent(`Consultation — ${form.build}`)}&body=${encodeURIComponent(`${form.idea}\n\n${form.name} · ${form.email} · ${form.company} ${form.phone}`)}`}
                      className="inline-flex items-center gap-2 metal-surface px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors hover:brightness-110"
                    >
                      BOOK A CONSULTATION <Send size={15} />
                    </a>
                    <button
                      onClick={() => {
                        setForm(initial)
                        setDir(-1)
                        setStep(0)
                      }}
                      className="text-sm text-nxt-muted underline-offset-4 hover:text-nxt-text2 hover:underline"
                    >
                      Start over
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav */}
          {step < TOTAL && (
            <div className="flex items-center justify-between border-t border-nxt-border px-6 py-4 md:px-10">
              <button
                onClick={() => go(-1)}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 text-sm text-nxt-muted transition-colors hover:text-nxt-text2 disabled:opacity-0"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={next}
                className="inline-flex items-center gap-2 metal-surface px-6 py-3 text-sm font-semibold tracking-wide transition-colors hover:brightness-110"
              >
                {step === TOTAL - 1 ? "Submit" : "Continue"} <ArrowRight size={15} />
              </button>
            </div>
          )}
          {error && (
            <p role="alert" className="px-6 pb-4 text-xs text-red-400 md:px-10">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function Choice({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-between rounded-lg border px-4 py-3.5 text-left text-sm transition-colors",
        active
          ? "border-nxt-accent/60 bg-nxt-accent/10 text-nxt-text"
          : "border-nxt-border bg-nxt-bg text-nxt-text2 hover:border-nxt-accent/30 hover:text-nxt-text",
      )}
    >
      {label}
      {active && <Check size={15} className="text-nxt-accent" />}
    </button>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-widest text-nxt-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-nxt-border bg-nxt-bg px-4 py-3 text-sm text-nxt-text placeholder:text-nxt-muted focus:border-nxt-accent/50 focus:outline-none"
      />
    </div>
  )
}
