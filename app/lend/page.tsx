import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LendContent } from "@/components/lend/lend-content"

export default function LendPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LendContent />
      </main>
      <Footer />
    </div>
  )
}
