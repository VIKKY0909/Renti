import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CartContent />
      </main>
      <Footer />
    </div>
  )
}
