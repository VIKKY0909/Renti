"use client"

import { useState, useEffect } from "react"
import { Heart, Share2, Star, Calendar, Ruler, ShoppingCart, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SizeChart } from "@/components/product/size-chart"
import { Reviews } from "@/components/product/reviews"
import { SimpleCalendar } from "@/components/ui/simple-calendar"
import { SimpleAddressSelector } from "@/components/ui/simple-address-selector"
import { toggleWishlist } from "@/lib/actions/products"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { formatDateFull } from "@/lib/utils"
import { toast } from "sonner"
import { checkProductAvailability } from "@/lib/actions/availability"
import { addDays, differenceInDays } from "date-fns"

interface ProductDetailsProps {
  product: any
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState({
    bust: "",
    waist: "",
    length: "",
    sleeveLength: "",
  })
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [availabilityError, setAvailabilityError] = useState<string>("")
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  // Remove delivery validation - will be handled in checkout

  const { addItem } = useCart()
  const router = useRouter()

  // Check if current user is the owner of this product
  const isOwner = user && product?.owner_id === user.id
  
  // Debug logging
  console.log("Product owner_id:", product?.owner_id)
  console.log("Current user id:", user?.id)
  console.log("Is owner:", isOwner)

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (!startDate || !endDate || !product?.id || !user?.id) {
        setAvailabilityError("")
        return
      }

      setIsCheckingAvailability(true)
      setAvailabilityError("")

      try {
        const availability = await checkProductAvailability(
          product.id,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          user.id
        )

        if (!availability.isAvailable) {
          setAvailabilityError(availability.reason || "Product not available for selected dates")
        } else {
          setAvailabilityError("")
        }
      } catch (error) {
        console.error("Error checking availability:", error)
        setAvailabilityError("Error checking availability")
      } finally {
        setIsCheckingAvailability(false)
      }
    }

    checkAvailability()
  }, [startDate, endDate, product?.id, user?.id])

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start)
    setEndDate(end)
  }

  // Delivery validation removed - will be handled in checkout

  const calculateRentalCost = () => {
    if (!startDate || !endDate) return { rentalCost: 0, totalDays: 0 }
    
    const totalDays = differenceInDays(endDate, startDate) + 1
    const rentalCost = product.rental_price * totalDays
    
    return { rentalCost, totalDays }
  }

  const calculateTotal = () => {
    const { rentalCost } = calculateRentalCost()
    // Security deposit is ONE-TIME only, not multiplied by days
    const securityDeposit = product.security_deposit
    return rentalCost + securityDeposit
  }

  // Add null check for product
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/browse')}>
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const discount = product?.original_price
    ? Math.round(((product.original_price - product.rental_price) / product.original_price) * 100)
    : 0

  const { rentalCost, totalDays } = calculateRentalCost()

  const handleWishlistToggle = async () => {
    if (!product?.id) return
    setIsWishlistLoading(true)
    const result = await toggleWishlist(product.id)
    if (result.success) {
      setIsWishlisted(result.inWishlist || false)
    }
    setIsWishlistLoading(false)
  }

  const handleAddToCart = () => {
    if (!product?.id) return
    if (!startDate || !endDate) {
      toast.error("Please select rental dates")
      return
    }
    // Delivery validation removed - will be handled in checkout
    if (availabilityError) {
      toast.error(availabilityError)
      return
    }

    addItem({
      productId: product.id,
      title: product.title || "Unknown Product",
      image: product.images?.[0] || "",
      rentalPrice: product.rental_price || 0,
      securityDeposit: product.security_deposit || 0,
      rentalStartDate: startDate.toISOString(),
      rentalEndDate: endDate.toISOString(),
      rentalDays: totalDays,
      selectedSize: JSON.stringify(selectedSize),
      // Delivery details will be collected in checkout
    })

    toast.success("Added to cart!")
  }

  const handleRentNow = () => {
    if (!product?.id) return
    if (!startDate || !endDate) {
      toast.error("Please select rental dates")
      return
    }
    // Delivery validation removed - will be handled in checkout
    if (availabilityError) {
      toast.error(availabilityError)
      return
    }

    addItem({
      productId: product.id,
      title: product.title || "Unknown Product",
      image: product.images?.[0] || "",
      rentalPrice: product.rental_price || 0,
      securityDeposit: product.security_deposit || 0,
      rentalStartDate: startDate.toISOString(),
      rentalEndDate: endDate.toISOString(),
      rentalDays: totalDays,
      selectedSize: JSON.stringify(selectedSize),
      // Delivery details will be collected in checkout
    })

    toast.success("Redirecting to checkout...")
    router.push("/checkout")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
            <img
              src={product.images?.[selectedImage] || "/placeholder.svg?height=800&width=600&query=designer dress"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-base px-4 py-2">
                {discount}% OFF
              </Badge>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg?height=200&width=200&query=designer dress"}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-3 bg-transparent">
              {product.category?.name || "Fashion"}
            </Badge>
            <h1 className="font-serif text-4xl font-bold mb-4">{product?.title || "Product Title"}</h1>
            <div className="flex items-center gap-4 mb-4">
              {product?.average_rating && product.average_rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.average_rating) ? "fill-primary text-primary" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{product.average_rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({product.total_reviews || 0} reviews)</span>
                </div>
              )}
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.short_description || product.description}
            </p>
            
            {/* Availability Dates */}
            {product.available_from && product.available_until && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Availability</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Available from <span className="font-medium">{formatDateFull(product.available_from)}</span> to <span className="font-medium">{formatDateFull(product.available_until)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="bg-muted/50 rounded-2xl p-6 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">₹{product?.rental_price || 0}</span>
              {product?.original_price && (
                <span className="text-xl text-muted-foreground line-through">₹{product.original_price}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Rental price per day</p>
            <p className="text-sm">
              Security Deposit: <span className="font-semibold">₹{product?.security_deposit || 0}</span> (One-time, refundable)
            </p>
            {startDate && endDate && (
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rental ({totalDays} days):</span>
                  <span>₹{rentalCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Security Deposit:</span>
                  <span>₹{product?.security_deposit || 0}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-1 border-t">
                  <span>Total Amount:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full bg-transparent ${isWishlisted ? "text-red-500 border-red-500" : ""}`}
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-transparent"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.title,
                    text: product.short_description || product.description,
                    url: window.location.href,
                  })
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(window.location.href)
                  toast.success("Link copied to clipboard!")
                }
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Delivery will be handled in checkout */}

          {/* Rental Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Rental Period
            </h3>
            <SimpleCalendar
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              minDate={new Date()}
              maxDate={addDays(new Date(), 365)}
              disabled={isOwner}
            />
          </div>

          {/* Availability Error Display */}
          {availabilityError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm font-medium">
                {availabilityError}
              </p>
            </div>
          )}

          {/* Availability Loading */}
          {isCheckingAvailability && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-sm">Checking availability...</p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {user && product.owner_id === user.id ? (
              <div className="flex-1 text-center py-6 px-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">This is your own dress</p>
                <p className="text-sm text-muted-foreground">You cannot rent your own items</p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {(!startDate || !endDate) && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Complete your selection:</span>
                    </div>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1">
                      {!startDate || !endDate && <li>• Select rental dates</li>}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                    onClick={handleRentNow}
                    disabled={!!availabilityError || isCheckingAvailability || !startDate || !endDate}
                  >
                    Rent Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 text-lg py-6 bg-transparent"
                    onClick={handleAddToCart}
                    disabled={!!availabilityError || isCheckingAvailability || !startDate || !endDate}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="size">
              <Ruler className="h-4 w-4 mr-2" />
              Size Chart
            </TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.total_reviews || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.admin_description || product.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-6 not-prose">
                {product.brand && (
                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-semibold">{product.brand}</p>
                  </div>
                )}
                {product.color && (
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-semibold">{product.color}</p>
                  </div>
                )}
                {product.fabric && (
                  <div>
                    <p className="text-sm text-muted-foreground">Fabric</p>
                    <p className="font-semibold">{product.fabric}</p>
                  </div>
                )}
                {product.occasion && (
                  <div>
                    <p className="text-sm text-muted-foreground">Occasion</p>
                    <p className="font-semibold">{product.occasion}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="size" className="mt-8">
            <SizeChart
              sizes={{
                bust: product.bust ? [product.bust.toString()] : [],
                waist: product.waist ? [product.waist.toString()] : [],
                length: product.length ? [product.length.toString()] : [],
                sleeveLength: product.sleeve_length ? [product.sleeve_length.toString()] : [],
                hip: product.hip ? [product.hip.toString()] : [],
                shoulder: product.shoulder ? [product.shoulder.toString()] : [],
              }}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </TabsContent>
          <TabsContent value="reviews" className="mt-8">
            <Reviews
              productId={product.id}
              rating={product.average_rating || 0}
              totalReviews={product.total_reviews || 0}
              reviews={product.reviews || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

