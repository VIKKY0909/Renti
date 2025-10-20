"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/browse/product-card"
import { FilterSidebar } from "@/components/browse/filter-sidebar"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
// Using direct API call instead of server action
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
export function BrowseContent() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState<string>("featured")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    // Get search query from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const search = urlParams.get("search")
    if (search) {
      setSearchQuery(search)
    }
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.set('category', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
      if (priceRange[1] < 5000) params.set('maxPrice', priceRange[1].toString())
      if (sortBy !== 'featured') params.set('sortBy', sortBy)
      
      console.log('🔍 Frontend: Fetching products with params:', {
        selectedCategory,
        searchQuery,
        priceRange,
        sortBy,
        url: `/api/products?${params.toString()}`
      })
      
      try {
        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()
        
        console.log('📦 Frontend: API response:', data)
        console.log('📊 Frontend: Products count:', data.products?.length || 0)
        console.log('📈 Frontend: Total count:', data.count || 0)
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch products')
        }
        
        setProducts(data.products || [])
        setTotalCount(data.count || 0)
      } catch (error) {
        console.error('❌ Frontend: Error fetching products:', error)
        setProducts([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, priceRange, sortBy, searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Collection"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {searchQuery ? `Found ${totalCount} results` : "Discover your perfect outfit from our curated collection"}
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters & Sort
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {totalCount} products
            </p>
          </div>

          {loading ? (
            <SkeletonLoader type="grid" count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSelectedCategory("all")
                  setPriceRange([0, 5000])
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
