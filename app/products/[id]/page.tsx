import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product/product-details"
import { ProductLoading } from "@/components/ui/product-loading"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { getProductById } from "@/lib/actions/products"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { product, error } = await getProductById(params.id)

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<ProductLoading />}>
            <ProductDetails product={product} />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
