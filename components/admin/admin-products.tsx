"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Edit, Eye, Loader2 } from "lucide-react"
import { getAllProducts, approveProduct, rejectProduct } from "@/lib/actions/admin"
import { formatDate } from "@/lib/utils"

interface Product {
  id: string
  title: string
  images: string[]
  category: { name: string }
  rental_price: number
  owner: { full_name: string }
  status: string
  created_at: string
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch ALL products, not just pending ones
        const { products: data, error } = await getAllProducts()
        if (error) {
          console.error("Error fetching products:", error)
        } else {
          setProducts(data || [])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      const { success, error } = await approveProduct(id)
      if (success) {
        setProducts(products.map((product) => (product.id === id ? { ...product, status: "approved" } : product)))
      } else {
        console.error("Error approving product:", error)
      }
    } catch (error) {
      console.error("Error approving product:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      const { success, error } = await rejectProduct(id)
      if (success) {
        setProducts(products.map((product) => (product.id === id ? { ...product, status: "rejected" } : product)))
      } else {
        console.error("Error rejecting product:", error)
      }
    } catch (error) {
      console.error("Error rejecting product:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Products Management</h1>
          <p className="text-muted-foreground">Review and manage product listings</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Products Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Review and manage product listings</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <p className="text-base sm:text-lg text-muted-foreground">No pending products to review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden">
              <div className="relative aspect-[3/4]">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-2 sm:top-4 right-2 sm:right-4 text-xs sm:text-sm ${
                    product.status === "pending"
                      ? "bg-yellow-500"
                      : product.status === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                  } text-white`}
                >
                  {product.status}
                </Badge>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2 bg-transparent text-xs sm:text-sm">
                    {product.category?.name || "Unknown"}
                  </Badge>
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{product.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">by {product.owner?.full_name || "Unknown"}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-lg sm:text-2xl font-bold">₹{product.rental_price}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(product.created_at)}</p>
                </div>

                {product.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                      onClick={() => handleApprove(product.id)}
                      disabled={actionLoading === product.id}
                    >
                      {actionLoading === product.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      <span className="hidden sm:inline">Approve</span>
                      <span className="sm:hidden">✓</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent text-red-600 border-red-600 text-xs sm:text-sm"
                      onClick={() => handleReject(product.id)}
                      disabled={actionLoading === product.id}
                    >
                      {actionLoading === product.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      <span className="hidden sm:inline">Reject</span>
                      <span className="sm:hidden">✗</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs sm:text-sm">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs sm:text-sm">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
