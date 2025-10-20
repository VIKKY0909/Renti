import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import FAQContent from "@/components/faq/faq-content"

export const metadata: Metadata = {
  title: "FAQ - Rentimade",
  description: "Frequently asked questions about renting and lending clothes on Rentimade",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <FAQContent />
      </main>
      <Footer />
    </div>
  )
}
