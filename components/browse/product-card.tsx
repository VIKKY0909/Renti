"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toggleWishlist } from "@/lib/actions/products"

interface ProductCardProps {
  product: any
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const truncateDescription = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.rental_price) / product.original_price) * 100)
    : 0

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await toggleWishlist(product.id)
    if (result.success) {
      setIsWishlisted(result.inWishlist || false)
    }
    setIsLoading(false)
  }

  return (
    <div
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images?.[0] || "/placeholder.svg?height=600&width=450&query=designer dress"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{discount}% OFF</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors ${
            isWishlisted ? "text-red-500" : "text-foreground"
          }`}
          onClick={handleWishlistToggle}
          disabled={isLoading}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs bg-transparent">
            {product.category?.name || "Fashion"}
          </Badge>
          {product.average_rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{product.average_rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.total_reviews || 0})</span>
            </div>
          )}
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
        </Link>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {truncateDescription(product.short_description || product.admin_description || product.description)}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold">₹{product.rental_price}</p>
            {product.original_price && (
              <p className="text-xs text-muted-foreground line-through">₹{product.original_price}</p>
            )}
          </div>
          <Link href={`/products/${product.id}`}>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
