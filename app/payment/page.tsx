import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import PaymentContent from "@/components/payment/payment-content"

export const metadata: Metadata = {
  title: "Payment - Rentimade",
  description: "Complete your rental payment securely",
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PaymentContent />
      </main>
      <Footer />
    </div>
  )
}
