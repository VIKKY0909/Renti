"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { getCategories } from "@/lib/actions/categories"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  product_count?: number
}

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { categories: data, error } = await getCategories()
        if (error) {
          console.error("Error fetching categories:", error)
        } else {
          setCategories(data || [])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Categories</h1>
          <p className="text-lg text-muted-foreground">Discover your perfect outfit for every occasion</p>
        </div>
        <SkeletonLoader type="grid" count={8} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Categories</h1>
        <p className="text-lg text-muted-foreground">Discover your perfect outfit for every occasion</p>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👗</div>
          <h3 className="font-semibold text-xl mb-2">No categories found</h3>
          <p className="text-muted-foreground">Categories will appear here once they are added to the platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/browse?category=${category.slug}`}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={category.image_url || "/placeholder.svg?height=600&width=450&query=designer dress"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-semibold text-xl text-white mb-1">{category.name}</h3>
                  {category.product_count && (
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {category.product_count} items
                    </Badge>
                  )}
                </div>
              </div>
              
              {category.description && (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Browse All Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8">
          <h2 className="font-serif text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Browse our complete collection to discover all available outfits
          </p>
          <Link href="/browse">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-semibold transition-colors">
              Browse All Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
