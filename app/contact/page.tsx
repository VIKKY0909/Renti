import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ContactContent from "@/components/contact/contact-content"

export const metadata: Metadata = {
  title: "Contact Us - Rentimade",
  description: "Get in touch with Rentimade for any queries or support",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ContactContent />
      </main>
      <Footer />
    </div>
  )
}
