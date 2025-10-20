"use client"

import { useState } from "react"
import { Trash2, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { format } from "date-fns"
import { useCart } from "@/lib/cart-context"

export function CartContent() {
  const { items, removeItem, updateItem, getTotalPrice, getTotalDeposit, getGrandTotal } = useCart()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleRemoveItem = (productId: string) => {
    setUpdating(productId)
    removeItem(productId)
    setUpdating(null)
  }

  const handleUpdateDays = (productId: string, newDays: number) => {
    if (newDays < 1) return
    
    setUpdating(productId)
    updateItem(productId, { rentalDays: newDays })
    setUpdating(null)
  }

  const subtotal = getTotalPrice()
  const discount = Math.round(subtotal * 0.1) // 10% discount
  const totalDeposit = getTotalDeposit()
  const grandTotal = getGrandTotal()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
          <h2 className="font-serif text-3xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">Start adding items to your cart to see them here!</p>
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
      <h1 className="font-serif text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-xl mb-6">
              Cart Items <span className="text-muted-foreground">({items.length})</span>
            </h2>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-6 pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="w-32 h-40 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: {item.selectedSize || "M"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={updating === item.productId}
                      >
                        {updating === item.productId ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Rental Start</p>
                        <p className="font-medium">{format(new Date(item.rentalStartDate), "PPP")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rental End</p>
                        <p className="font-medium">{format(new Date(item.rentalEndDate), "PPP")}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-2xl font-bold">₹{item.rentalPrice}</p>
                        <p className="text-xs text-muted-foreground">+ ₹{item.securityDeposit} deposit</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 space-y-6">
            <h2 className="font-semibold text-xl">Price Details</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rental Price</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-green-600">
                <span>Discount (10%)</span>
                <span className="font-medium">-₹{discount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Security Deposit</span>
                <span className="font-medium">₹{totalDeposit}</span>
              </div>
              <p className="text-xs text-muted-foreground">Security deposit will be refunded after return</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6">
                Proceed to Checkout
              </Button>
            </Link>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">✓ Free doorstep delivery</p>
              <p className="flex items-center gap-2">✓ Quality checked & dry-cleaned</p>
              <p className="flex items-center gap-2">✓ Hassle-free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
