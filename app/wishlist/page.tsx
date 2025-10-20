import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WishlistContent } from "@/components/wishlist/wishlist-content"

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <WishlistContent />
      </main>
      <Footer />
    </div>
  )
}
