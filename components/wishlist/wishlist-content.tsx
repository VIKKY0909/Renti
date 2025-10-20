"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductCard } from "@/components/browse/product-card"
import { getWishlist } from "@/lib/actions/products"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"

export function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const { wishlist: data, error } = await getWishlist()
        if (error) {
          console.error("Error fetching wishlist:", error)
        } else {
          // Extract products from wishlist items
          const products = data?.map(item => item.product) || []
          setWishlistItems(products)
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-4xl font-bold mb-8">My Wishlist</h1>
        <SkeletonLoader type="grid" count={6} />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Heart className="h-24 w-24 mx-auto text-muted-foreground" />
          <h2 className="font-serif text-3xl font-bold">Your wishlist is empty</h2>
          <p className="text-muted-foreground">Save your favorite items to your wishlist!</p>
          <Link href="/browse">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Browse Collection
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}
