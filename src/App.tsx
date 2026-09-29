import { useEffect, useState } from "react"
import { WelcomePopup } from "@/components/welcome/welcome-popup"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { LegalPage } from "@/components/ui/legal-page"
import { NavBar, HeroSection } from "@/sections"
import Faqs01 from "@/components/ui/faqs-01"
import {
  Services,
  Philosophy,
  Solutions,
  Industries,
  Work,
  Process,
  Technology,
  About,
  WhyNXT,
  Engagement,
  Consultation,
  Contact,
  Footer,
} from "@/sections"

function useLegalRoute() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const onChange = () => setTick((t) => t + 1)
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])
  return window.location.hash.startsWith("#/legal/")
}

export default function App() {
  const onLegal = useLegalRoute()

  return (
    <main className="min-h-screen bg-nxt-bg font-body text-nxt-text">
      {onLegal ? (
        <LegalPage />
      ) : (
        <>
          {/* Hero renders behind the welcome popup; the popup reveals it */}
          <NavBar />
          <HeroSection />
          <Services />
          <Philosophy />
          <Solutions />
          <Industries />
          <Work />
          <Process />
          <Technology />
          <About />
          <WhyNXT />
          <Faqs01 />
          <Engagement />
          <Consultation />
          <Contact />
          <Footer />
        </>
      )}
      <CookieConsent />
      <WelcomePopup />
    </main>
  )
}
