"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { Loader2, ArrowLeft } from "lucide-react"
import { getProductById, updateProduct } from "@/lib/actions/products"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface EditProductFormProps {
  productId: string
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { product: data, error } = await getProductById(productId)
        if (error) {
          console.error("Error fetching product:", error)
          router.push("/manage-listings")
        } else {
          setProduct(data)
          setImages(data?.images || [])
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        router.push("/manage-listings")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      formData.append("images", JSON.stringify(images))

      const { success, error } = await updateProduct(productId, formData)

      if (success) {
        router.push("/manage-listings")
      } else {
        console.error("Error updating product:", error)
        alert("Failed to update product. Please try again.")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/manage-listings">
            <Button>Back to My Listings</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/manage-listings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to My Listings
          </Link>
          <h1 className="font-serif text-4xl font-bold mb-2">Edit Product</h1>
          <p className="text-muted-foreground">Update your product details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Basic Information</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Product Name *</Label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={product.title}
                placeholder="e.g., Royal Blue Silk Lehenga" 
                className="bg-transparent" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description *</Label>
              <Input
                id="short_description"
                name="short_description"
                defaultValue={product.short_description}
                placeholder="Brief description (2 lines)"
                className="bg-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product.description}
                placeholder="Detailed description including fabric, embellishments, occasion, etc."
                className="min-h-32 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Photos *</h2>
            <p className="text-sm text-muted-foreground">Upload at least 3 high-quality photos of your dress</p>

            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={8}
              disabled={saving}
            />
          </div>

          {/* Measurements */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Measurements</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bust_size">Bust Size or Range (inches) *</Label>
                <Input 
                  id="bust_size" 
                  name="bust_size" 
                  type="text" 
                  inputMode="numeric"
                  defaultValue={product.bust}
                  placeholder="e.g., 34 or 28-44" 
                  className="bg-transparent" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist_size">Waist Size or Range (inches) *</Label>
                <Input 
                  id="waist_size" 
                  name="waist_size" 
                  type="text" 
                  inputMode="numeric"
                  defaultValue={product.waist}
                  placeholder="e.g., 28 or 26-44" 
                  className="bg-transparent" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length_size">Length (inches) *</Label>
                <Input 
                  id="length_size" 
                  name="length_size" 
                  type="number" 
                  defaultValue={product.length}
                  placeholder="e.g., 42" 
                  className="bg-transparent" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleeve_length">Sleeve Length *</Label>
                <Select name="sleeve_length" defaultValue={product.sleeve_length} required>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sleeveless">Sleeveless</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="3/4">3/4</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Pricing</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rental_price">Rental Price (₹) *</Label>
                <Input 
                  id="rental_price" 
                  name="rental_price" 
                  type="number" 
                  defaultValue={product.rental_price}
                  placeholder="e.g., 2999" 
                  className="bg-transparent" 
                  required 
                />
                <p className="text-xs text-muted-foreground">Price for 3-4 days rental</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price (₹) *</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  defaultValue={product.original_price}
                  placeholder="e.g., 45000"
                  className="bg-transparent"
                  required
                />
                <p className="text-xs text-muted-foreground">Actual purchase price</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="security_deposit">Security Deposit (₹) *</Label>
              <Input 
                id="security_deposit" 
                name="security_deposit" 
                type="number" 
                defaultValue={product.security_deposit}
                placeholder="e.g., 5000" 
                className="bg-transparent" 
                required 
              />
              <p className="text-xs text-muted-foreground">Refundable deposit amount</p>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Availability</h2>
            <p className="text-sm text-muted-foreground">Set when your dress is available for rent</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="available_from">Available From *</Label>
                <Input 
                  id="available_from" 
                  name="available_from" 
                  type="date" 
                  defaultValue={product.available_from || ''}
                  className="bg-transparent" 
                  required 
                />
                <p className="text-xs text-muted-foreground">When the dress becomes available</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="available_until">Available Until *</Label>
                <Input 
                  id="available_until" 
                  name="available_until" 
                  type="date" 
                  defaultValue={product.available_until || ''}
                  className="bg-transparent" 
                  required 
                />
                <p className="text-xs text-muted-foreground">When the dress stops being available</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Additional Details</h2>

            <div className="space-y-2">
              <Label htmlFor="fabric">Fabric Type *</Label>
              <Input 
                id="fabric" 
                name="fabric" 
                defaultValue={product.fabric}
                placeholder="e.g., Silk, Cotton, Georgette" 
                className="bg-transparent" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input 
                id="color" 
                name="color" 
                defaultValue={product.color}
                placeholder="e.g., Royal Blue" 
                className="bg-transparent" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand/Designer</Label>
              <Input 
                id="brand" 
                name="brand" 
                defaultValue={product.brand}
                placeholder="e.g., Sabyasachi, Manish Malhotra" 
                className="bg-transparent" 
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Link href="/manage-listings" className="flex-1">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
                disabled={saving}
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
