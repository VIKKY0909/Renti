import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoriesContent } from "@/components/categories/categories-content"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoriesContent />
      </main>
      <Footer />
    </div>
  )
}
