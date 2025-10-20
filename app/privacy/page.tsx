import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import PrivacyContent from "@/components/privacy/privacy-content"

export const metadata: Metadata = {
  title: "Privacy Policy - Rentimade",
  description: "Rentimade privacy policy and data protection information",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PrivacyContent />
      </main>
      <Footer />
    </div>
  )
}
