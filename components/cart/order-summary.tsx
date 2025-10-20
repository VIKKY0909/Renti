"use client"

import { useState, useEffect } from "react"
import { format, differenceInDays } from "date-fns"
import { MapPin, Calendar, Package, Shield, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"

interface OrderSummaryProps {
  onProceedToCheckout?: () => void
  showCheckoutButton?: boolean
  className?: string
}

export function OrderSummary({ 
  onProceedToCheckout, 
  showCheckoutButton = true,
  className 
}: OrderSummaryProps) {
  const { items, removeItem, updateItemQuantity } = useCart()
  const [subtotal, setSubtotal] = useState(0)
  const [totalSecurityDeposit, setTotalSecurityDeposit] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    let rentalTotal = 0
    let securityTotal = 0

    items.forEach(item => {
      // Calculate rental cost for this item
      const rentalCost = item.rentalPrice * item.rentalDays
      rentalTotal += rentalCost
      
      // Security deposit is one-time per item (not multiplied by days)
      securityTotal += item.securityDeposit
    })

    setSubtotal(rentalTotal)
    setTotalSecurityDeposit(securityTotal)
    setTotalAmount(rentalTotal + securityTotal)
  }, [items])

  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Summary ({items.length} item{items.length > 1 ? 's' : ''})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => {
            const startDate = new Date(item.rentalStartDate)
            const endDate = new Date(item.rentalEndDate)
            const days = differenceInDays(endDate, startDate) + 1
            const itemRentalCost = item.rentalPrice * days
            
            return (
              <div key={item.productId} className="border rounded-lg p-4 space-y-3">
                {/* Item Header */}
                <div className="flex items-start gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{item.rentalPrice} per day
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </Button>
                </div>

                {/* Rental Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {days} day{days > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  {item.deliveryCity && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Delivery to {item.deliveryCity} ({item.deliveryPincode})</span>
                    </div>
                  )}
                </div>

                {/* Size Information */}
                {item.selectedSize && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Size: </span>
                    {(() => {
                      try {
                        const sizeData = JSON.parse(item.selectedSize)
                        const sizeParts = []
                        if (sizeData.bust) sizeParts.push(`Bust: ${sizeData.bust}"`)
                        if (sizeData.waist) sizeParts.push(`Waist: ${sizeData.waist}"`)
                        if (sizeData.length) sizeParts.push(`Length: ${sizeData.length}"`)
                        if (sizeData.sleeveLength) sizeParts.push(`Sleeve: ${sizeData.sleeveLength}"`)
                        return sizeParts.length > 0 ? sizeParts.join(", ") : "Not specified"
                      } catch {
                        return "Not specified"
                      }
                    })()}
                  </div>
                )}

                {/* Item Pricing */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Rental ({days} days):</span>
                    <span>{formatCurrency(itemRentalCost)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Security Deposit:</span>
                    <span>{formatCurrency(item.securityDeposit)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Item Total:</span>
                    <span>{formatCurrency(itemRentalCost + item.securityDeposit)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''}):</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Security Deposit:
            </span>
            <span className="text-muted-foreground">{formatCurrency(totalSecurityDeposit)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="h-3 w-3" />
              <span className="font-medium">Delivery Information:</span>
            </div>
            <p>• Security deposit will be refunded after successful return</p>
            <p>• Free delivery within service areas (Khargone & Indore)</p>
            <p>• Items will be delivered 1 day before rental start date</p>
          </div>
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && onProceedToCheckout && (
          <Button 
            onClick={onProceedToCheckout} 
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Proceed to Checkout
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
