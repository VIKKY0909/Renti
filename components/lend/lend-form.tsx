"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { createProduct } from "@/lib/actions/products"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/ui/image-upload"

interface LendFormProps {
  onSubmit: () => void
  onCancel: () => void
}

export function LendForm({ onSubmit, onCancel }: LendFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()

  const parseRange = (value: string): { min: number | null; max: number | null } => {
    if (!value || !value.trim()) return { min: null, max: null }
    
    const trimmed = value.trim()
    // Match formats: "32", "28-44", "28 - 44"
    const rangeMatch = trimmed.match(/^\s*(\d+\.?\d*)\s*(?:-\s*(\d+\.?\d*))?\s*$/)
    
    if (!rangeMatch) return { min: null, max: null }
    
    const first = parseFloat(rangeMatch[1])
    const second = rangeMatch[2] ? parseFloat(rangeMatch[2]) : null
    
    if (isNaN(first)) return { min: null, max: null }
    if (second !== null && isNaN(second)) return { min: null, max: null }
    
    if (second !== null) {
      return {
        min: Math.min(first, second),
        max: Math.max(first, second)
      }
    }
    
    return { min: first, max: null }
  }

  const validateForm = (formData: FormData): Record<string, string> => {
    const errors: Record<string, string> = {}

    // Validate required fields
    const title = formData.get("title") as string
    if (!title || title.trim().length < 3) {
      errors.title = "Dress name must be at least 3 characters long"
    }

    const description = formData.get("description") as string
    if (!description || description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long"
    }

    const shortDescription = formData.get("short_description") as string
    if (!shortDescription || shortDescription.trim().length < 5) {
      errors.short_description = "Short description must be at least 5 characters long"
    }

    // Validate measurements with ranges
    const bustRaw = (formData.get("bust_size") as string) || ""
    const bustRange = parseRange(bustRaw)
    if (bustRange.min === null || bustRange.min < 28 || bustRange.min > 200) {
      errors.bust_size = "Enter bust like 34 or 32-36 (28-200 inches)"
    }
    if (bustRange.max !== null && (bustRange.max < 28 || bustRange.max > 200)) {
      errors.bust_size = "Bust max must be between 28-200 inches"
    }

    const waistRaw = (formData.get("waist_size") as string) || ""
    const waistRange = parseRange(waistRaw)
    if (waistRange.min === null || waistRange.min < 24 || waistRange.min > 150) {
      errors.waist_size = "Enter waist like 28 or 26-32 (24-150 inches)"
    }
    if (waistRange.max !== null && (waistRange.max < 24 || waistRange.max > 150)) {
      errors.waist_size = "Waist max must be between 24-150 inches"
    }

    const lengthRaw = (formData.get("length_size") as string) || ""
    const lengthRange = parseRange(lengthRaw)
    if (lengthRange.min === null || lengthRange.min < 20 || lengthRange.min > 300) {
      errors.length_size = "Length must be between 20-300 inches"
    }

    // Validate pricing
    const rentalPrice = parseFloat(formData.get("rental_price") as string)
    if (isNaN(rentalPrice) || rentalPrice < 100 || rentalPrice > 50000) {
      errors.rental_price = "Rental price must be between ₹100 and ₹50,000"
    }

    const originalPrice = parseFloat(formData.get("original_price") as string)
    if (isNaN(originalPrice) || originalPrice < 1000 || originalPrice > 1000000) {
      errors.original_price = "Original price must be between ₹1,000 and ₹10,00,000"
    }

    const securityDeposit = parseFloat(formData.get("security_deposit") as string)
    if (isNaN(securityDeposit) || securityDeposit < 500 || securityDeposit > 100000) {
      errors.security_deposit = "Security deposit must be between ₹500 and ₹1,00,000"
    }

    // Validate images
    if (images.length === 0) {
      errors.images = "Please upload at least one image"
    } else if (images.length > 8) {
      errors.images = "Maximum 8 images allowed"
    }

    // Validate category
    const category = formData.get("category") as string
    const validCategories = ["Lehenga", "Saree", "Gown", "Indo-Western"]
    if (!category || !validCategories.includes(category)) {
      errors.category = "Please select a valid category"
    }

    // Validate fabric and color
    const fabric = formData.get("fabric") as string
    if (!fabric || fabric.trim().length < 2) {
      errors.fabric = "Fabric type is required"
    }

    const color = formData.get("color") as string
    if (!color || color.trim().length < 2) {
      errors.color = "Color is required"
    }

    return errors
  }

  const scrollToFirstError = (errors: Record<string, string>) => {
    const firstErrorField = Object.keys(errors)[0]
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        element.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      
      // Validate form
      const errors = validateForm(formData)
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        setIsLoading(false)
        setTimeout(() => scrollToFirstError(errors), 100)
        return
      }

      // Parse ranges and add to formData
      const bustRange = parseRange(formData.get("bust_size") as string)
      if (bustRange.min !== null) {
        formData.set("bust_min", bustRange.min.toString())
        if (bustRange.max !== null) {
          formData.set("bust_max", bustRange.max.toString())
        }
      }

      const waistRange = parseRange(formData.get("waist_size") as string)
      if (waistRange.min !== null) {
        formData.set("waist_min", waistRange.min.toString())
        if (waistRange.max !== null) {
          formData.set("waist_max", waistRange.max.toString())
        }
      }

      const lengthRange = parseRange(formData.get("length_size") as string)
      if (lengthRange.min !== null) {
        formData.set("length_min", lengthRange.min.toString())
        if (lengthRange.max !== null) {
          formData.set("length_max", lengthRange.max.toString())
        }
      }

      // Append images as a JSON string
      formData.append("images", JSON.stringify(images))

      const { success, error } = await createProduct(formData)
      
      if (success) {
        router.push("/profile?tab=dresses")
        onSubmit()
      } else {
        setError(error || "Failed to create product. Please try again.")
        console.error("Error creating product:", error)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Error submitting form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">List Your Dress</h1>
          <p className="text-muted-foreground">Fill in the details below to list your dress for rent</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border p-8 space-y-8">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Validation Errors Summary */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <h3 className="text-destructive font-semibold">Please fix the following errors:</h3>
              </div>
              <ul className="text-destructive text-sm space-y-1">
                {Object.entries(validationErrors).map(([field, message]) => (
                  <li key={field} className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    <span>{message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Basic Information</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Dress Name *</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="e.g., Royal Blue Silk Lehenga" 
                className={`bg-transparent ${validationErrors.title ? 'border-destructive' : ''}`} 
                required 
              />
              {validationErrors.title && (
                <p className="text-destructive text-sm">{validationErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" required>
                <SelectTrigger className={`bg-transparent ${validationErrors.category ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lehenga">Lehenga</SelectItem>
                  <SelectItem value="Saree">Saree</SelectItem>
                  <SelectItem value="Gown">Gown</SelectItem>
                  <SelectItem value="Indo-Western">Indo-Western</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.category && (
                <p className="text-destructive text-sm">{validationErrors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description *</Label>
              <Input
                id="short_description"
                name="short_description"
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
              disabled={isLoading}
            />
            {validationErrors.images && (
              <p className="text-destructive text-sm">{validationErrors.images}</p>
            )}
          </div>

          {/* Measurements */}
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Measurements</h2>
            <p className="text-sm text-muted-foreground">Enter single values (e.g., 34) or ranges (e.g., 32-36)</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bust_size">Bust Size (inches) *</Label>
                <Input 
                  id="bust_size"
                  name="bust_size" 
                  type="text" 
                  placeholder="e.g., 34 or 32-36" 
                  className={`bg-transparent ${validationErrors.bust_size ? 'border-destructive' : ''}`} 
                  required 
                />
                <p className="text-xs text-muted-foreground">Single: 34 | Range: 32-36</p>
                {validationErrors.bust_size && (
                  <p className="text-destructive text-sm">{validationErrors.bust_size}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist_size">Waist Size (inches) *</Label>
                <Input 
                  id="waist_size"
                  name="waist_size" 
                  type="text" 
                  placeholder="e.g., 28 or 26-30" 
                  className={`bg-transparent ${validationErrors.waist_size ? 'border-destructive' : ''}`} 
                  required 
                />
                <p className="text-xs text-muted-foreground">Single: 28 | Range: 26-30</p>
                {validationErrors.waist_size && (
                  <p className="text-destructive text-sm">{validationErrors.waist_size}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="length_size">Length (inches) *</Label>
                <Input 
                  id="length_size" 
                  name="length_size" 
                  type="text" 
                  placeholder="e.g., 42 or 40-44" 
                  className={`bg-transparent ${validationErrors.length_size ? 'border-destructive' : ''}`} 
                  required 
                />
                <p className="text-xs text-muted-foreground">Single: 42 | Range: 40-44</p>
                {validationErrors.length_size && (
                  <p className="text-destructive text-sm">{validationErrors.length_size}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="sleeve_length">Sleeve Length *</Label>
                <Select name="sleeve_length" required>
                  <SelectTrigger className={`bg-transparent ${validationErrors.sleeve_length ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sleeveless">Sleeveless</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="3/4">3/4</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.sleeve_length && (
                  <p className="text-destructive text-sm">{validationErrors.sleeve_length}</p>
                )}
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
                  placeholder="e.g., 2999" 
                  className={`bg-transparent ${validationErrors.rental_price ? 'border-destructive' : ''}`} 
                  required 
                />
                <p className="text-xs text-muted-foreground">Price per day</p>
                {validationErrors.rental_price && (
                  <p className="text-destructive text-sm">{validationErrors.rental_price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price (₹) *</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  placeholder="e.g., 45000"
                  className={`bg-transparent ${validationErrors.original_price ? 'border-destructive' : ''}`}
                  required
                />
                <p className="text-xs text-muted-foreground">Actual purchase price</p>
                {validationErrors.original_price && (
                  <p className="text-destructive text-sm">{validationErrors.original_price}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="security_deposit">Security Deposit (₹) *</Label>
              <Input 
                id="security_deposit" 
                name="security_deposit" 
                type="number" 
                placeholder="e.g., 5000" 
                className={`bg-transparent ${validationErrors.security_deposit ? 'border-destructive' : ''}`} 
                required 
              />
              <p className="text-xs text-muted-foreground">Refundable deposit amount</p>
              {validationErrors.security_deposit && (
                <p className="text-destructive text-sm">{validationErrors.security_deposit}</p>
              )}
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
                placeholder="e.g., Silk, Cotton, Georgette" 
                className={`bg-transparent ${validationErrors.fabric ? 'border-destructive' : ''}`} 
                required 
              />
              {validationErrors.fabric && (
                <p className="text-destructive text-sm">{validationErrors.fabric}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input 
                id="color" 
                name="color" 
                placeholder="e.g., Royal Blue" 
                className={`bg-transparent ${validationErrors.color ? 'border-destructive' : ''}`} 
                required 
              />
              {validationErrors.color && (
                <p className="text-destructive text-sm">{validationErrors.color}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand/Designer</Label>
              <Input id="brand" name="brand" placeholder="e.g., Sabyasachi, Manish Malhotra" className="bg-transparent" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Input id="occasion" name="occasion" placeholder="e.g., Wedding, Party, Festival" className="bg-transparent" />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 bg-transparent"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || images.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}