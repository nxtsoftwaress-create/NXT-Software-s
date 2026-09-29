/** Shared site contact/constants — single source of truth. */

export const WHATSAPP_NUMBER = "918500095512"

/** WhatsApp chat link with a prefilled greeting. */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi NXT Softwares — I'd like to discuss a project.",
)}`

export const PHONE_DISPLAY = "+91 85000 95512"
export const PHONE_TEL = `tel:+${WHATSAPP_NUMBER}`

export const LINKEDIN_URL = "https://www.linkedin.com/company/nxt-softwares"
export const GITHUB_URL = "https://github.com/nxtsoftwares"
export const EMAIL_HELLO = "nxtsoftwaress@gmail.com"

/** Web3Forms public access key (safe for client-side use). */
export const WEB3FORMS_ACCESS_KEY = "70f7c385-b9b9-4d02-93fb-bd47519ef742"
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

/** Legal document routes. */
export const LEGAL_ROUTES = {
  privacy: "#/legal/privacy",
  terms: "#/legal/terms",
  cookies: "#/legal/cookies",
  refunds: "#/legal/refunds",
} as const

export type LegalDocId = keyof typeof LEGAL_ROUTES
