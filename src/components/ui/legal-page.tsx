import { useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ShieldCheck, FileText, Cookie, ReceiptText } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { LEGAL_ROUTES, EMAIL_HELLO, PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/site"

type LegalDoc = {
  id: keyof typeof LEGAL_ROUTES
  title: string
  updated: string
  icon: LucideIcon
  intro: string
  sections: { heading: string; body: string[] }[]
}

const CONTACT_BLOCK = `Questions about this document? Contact us:
  · Email: ${EMAIL_HELLO}
  · Phone / WhatsApp: ${PHONE_DISPLAY} (https://wa.me/918500095512)
  · NXT Softwares, India`

const DOCS: LegalDoc[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    updated: "Last updated: September 2026",
    icon: ShieldCheck,
    intro:
      "NXT Softwares (“we”, “us”, “our”) respects your privacy. This policy explains what personal data we collect through nxtsoftwares.com, why we collect it, and the choices you have.",
    sections: [
      {
        heading: "1. Information we collect",
        body: [
          "Contact details you give us voluntarily — name, email address, phone number, company, and project details submitted through our contact or consultation forms.",
          "Usage data collected automatically — pages visited, time on site, approximate location (country/city level), device and browser type, collected via cookies and similar technologies.",
          "Communication records — messages you send us by email, WhatsApp, or through our forms, so we can respond and keep a history of the conversation.",
        ],
      },
      {
        heading: "2. How we use your information",
        body: [
          "To respond to enquiries and provide quotes, proposals, and project updates.",
          "To deliver and improve our website, services, and customer support.",
          "To send service-related communications. We do not sell your personal data, and we do not send marketing emails without your consent.",
        ],
      },
      {
        heading: "3. Form processing and third parties",
        body: [
          "Our contact forms are processed by Web3Forms (web3forms.com), which forwards your submission to our team inbox. Web3Forms acts as a data processor and stores submissions only as long as needed to deliver them to us.",
          "We use Google Fonts for typography. No advertising or social-media tracking pixels are installed on this site.",
        ],
      },
      {
        heading: "4. Cookies",
        body: [
          "We use a small number of cookies and local-storage entries for theme preference and anonymous traffic analytics. See our Cookie Policy for the full list and how to control them.",
        ],
      },
      {
        heading: "5. Data retention & security",
        body: [
          "Enquiry data is kept for up to 24 months, then deleted unless a client relationship exists. Project data for clients is governed by the individual service agreement.",
          "We apply reasonable technical and organisational measures (encryption in transit, access controls) to protect your data. No method of transmission over the internet is 100% secure.",
        ],
      },
      {
        heading: "6. Your rights",
        body: [
          "You may request access to, correction of, or deletion of your personal data at any time, and you may withdraw consent for us to contact you. Write to " + EMAIL_HELLO + " and we will respond within 30 days.",
        ],
      },
      {
        heading: "7. Children",
        body: [
          "Our services are directed at businesses. We do not knowingly collect data from children under 16.",
        ],
      },
    ],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    updated: "Last updated: September 2026",
    icon: FileText,
    intro:
      "These terms govern your use of nxtsoftwares.com and any engagement with NXT Softwares. By using this site you agree to them.",
    sections: [
      {
        heading: "1. Use of this website",
        body: [
          "You may browse this site and submit enquiries for lawful purposes only. You agree not to attempt to breach, probe, or disrupt the site, its forms, or its hosting infrastructure.",
          "All content on this site — text, design, graphics, and code — is the property of NXT Softwares unless stated otherwise, and may not be copied or reused commercially without permission.",
        ],
      },
      {
        heading: "2. Enquiries and proposals",
        body: [
          "Submitting a form or messaging us does not create a client relationship. Work begins only after both parties sign a written agreement or statement of work defining scope, timeline, and price.",
        ],
      },
      {
        heading: "3. Estimates and payment",
        body: [
          "Prices and timelines shared before a signed agreement are estimates. The signed agreement — including its payment schedule, revision limits, and change-request process — is the binding document for any project.",
          "Invoices are payable in the currency and within the period stated on the agreement. Late payments may pause work and accrue interest as agreed in the contract.",
        ],
      },
      {
        heading: "4. Intellectual property",
        body: [
          "On full payment, clients receive the rights to the deliverables defined in their agreement. We retain the right to reuse general techniques, internal tooling, and non-confidential know-how developed during the work.",
          "We may display completed work in our portfolio unless the agreement states otherwise.",
        ],
      },
      {
        heading: "5. Warranties and liability",
        body: [
          "This website is provided “as is” without warranties of any kind. To the maximum extent permitted by law, NXT Softwares is not liable for indirect or consequential damages arising from use of this site.",
          "Liability for client projects is limited to the fees paid for the specific deliverable, as set out in the project agreement.",
        ],
      },
      {
        heading: "6. Governing law",
        body: [
          "These terms are governed by the laws of India. Courts in the jurisdiction of our registered office have exclusive authority over disputes, unless the project agreement states otherwise.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    updated: "Last updated: September 2026",
    icon: Cookie,
    intro:
      "This site uses a minimal set of cookies and browser storage. We do not run advertising or cross-site tracking.",
    sections: [
      {
        heading: "1. What we store",
        body: [
          "nxt-theme (local storage) — remembers whether you chose dark or light mode. Essential for the preference to persist; contains no personal data.",
          "Analytics cookies (only if the analytics service is enabled) — anonymised page-view counts used to understand which sections are useful. IP addresses are truncated and no cross-site identifiers are set.",
          "No third-party advertising, retargeting, or social-media pixels are used.",
        ],
      },
      {
        heading: "2. Managing cookies",
        body: [
          "You can clear or block cookies and site data at any time in your browser settings. Blocking storage will not break the site — you will simply lose your saved theme preference.",
          "Use the cookie banner shown on your first visit to accept or decline optional cookies.",
        ],
      },
      {
        heading: "3. Changes",
        body: [
          "If we add any new cookie category, we will update this policy and re-prompt for consent.",
        ],
      },
    ],
  },
  {
    id: "refunds",
    title: "Refund Policy",
    updated: "Last updated: September 2026",
    icon: ReceiptText,
    intro:
      "NXT Softwares sells custom software services, not off-the-shelf products. This policy explains when refunds apply.",
    sections: [
      {
        heading: "1. Project deposits",
        body: [
          "Deposits reserve delivery capacity and cover discovery work already scheduled. If you cancel before discovery begins, the deposit is refundable minus payment-gateway fees. Once discovery has started, the deposit covers work performed and is non-refundable.",
        ],
      },
      {
        heading: "2. Milestone payments",
        body: [
          "Milestone payments are non-refundable once the milestone has been delivered and made available for review, because the work product transfers to you.",
          "If we fail to deliver an agreed milestone and cannot remedy it within 15 business days of written notice, the undelivered milestone fee is refunded in full.",
        ],
      },
      {
        heading: "3. Subscriptions and retainers",
        body: [
          "Monthly retainers can be cancelled with 15 days’ written notice before the next billing cycle. Part-months are not pro-rated unless the agreement says otherwise.",
        ],
      },
      {
        heading: "4. How refunds are processed",
        body: [
          "Approved refunds are returned via the original payment method within 10 business days of approval. Payment-gateway fees are deducted where the gateway does not return them to us.",
        ],
      },
      {
        heading: "5. Exceptions",
        body: [
          "Anything agreed differently in a signed statement of work overrides this policy for that project.",
        ],
      },
    ],
  },
]

function parseHash(): keyof typeof LEGAL_ROUTES | null {
  const m = window.location.hash.match(/^#\/legal\/(privacy|terms|cookies|refunds)/)
  return m ? (m[1] as keyof typeof LEGAL_ROUTES) : null
}

export function LegalPage() {
  const docId = parseHash()

  // Scroll to top when a legal route opens.
  useEffect(() => {
    if (docId) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [docId])

  if (!docId) return null

  const doc = DOCS.find((d) => d.id === docId)!
  const Icon = doc.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-nxt-bg font-body text-nxt-text"
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <a
          href="#hero"
          className="inline-flex items-center gap-2 text-sm text-nxt-muted transition-colors hover:text-nxt-accent"
        >
          <ArrowLeft size={15} /> Back to site
        </a>

        <div className="mt-10 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-nxt-border bg-nxt-card">
            <Icon size={20} strokeWidth={1.5} className="text-nxt-accent" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {doc.title}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-nxt-muted">
              {doc.updated}
            </p>
          </div>
        </div>

        <p className="mt-8 border-l-2 border-nxt-accent/50 pl-4 text-sm leading-7 text-nxt-text2">
          {doc.intro}
        </p>

        <div className="mt-10 flex flex-col gap-9">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-lg font-semibold tracking-tight text-nxt-text">
                {s.heading}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm leading-7 text-nxt-text2">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-nxt-border bg-nxt-card p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-nxt-text2">
            {CONTACT_BLOCK}
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center rounded-full border border-nxt-accent/40 bg-nxt-accent/10 px-5 py-2 text-xs font-medium text-nxt-accent transition-colors hover:bg-nxt-accent/20"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default LegalPage
