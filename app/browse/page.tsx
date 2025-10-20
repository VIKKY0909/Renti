import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BrowseContent } from "@/components/browse/browse-content"

export default function BrowsePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BrowseContent />
      </main>
      <Footer />
    </div>
  )
}
