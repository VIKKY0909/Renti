import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AboutContent from "@/components/about/about-content"

export const metadata: Metadata = {
  title: "About Us - Rentimade",
  description: "Learn about Rentimade - India's premier clothing rental platform",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutContent />
      </main>
      <Footer />
    </div>
  )
}
