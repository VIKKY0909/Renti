import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EditProductForm } from "@/components/lend/edit-product-form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <EditProductForm productId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
