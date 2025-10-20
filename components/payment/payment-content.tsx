"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Shield, ArrowLeft, Check, MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { createMultiItemOrder } from "@/lib/actions/orders"
import { getUserAddresses, type Address } from "@/lib/actions/addresses"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function PaymentContent() {
  const router = useRouter()
  const { items, getTotalPrice, getTotalDeposit, getGrandTotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  // Load user addresses
  useEffect(() => {
    const loadAddresses = async () => {
      setLoadingAddresses(true)
      const { addresses: userAddresses, error: addressError } = await getUserAddresses()
      if (!addressError && userAddresses) {
        setAddresses(userAddresses)
        // Auto-select default address
        const defaultAddress = userAddresses.find(addr => addr.is_default)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id)
        }
      }
      setLoadingAddresses(false)
    }
    loadAddresses()
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push("/cart")
    }
  }, [items, success, router])

  const orderSummary = {
    items: items.map(item => ({
      name: item.title,
      size: item.selectedSize || "M",
      rentalDays: item.rentalDays,
      price: item.rentalPrice,
    })),
    subtotal: getTotalPrice(),
    discount: 0,
    securityDeposit: getTotalDeposit(),
    deliveryCharge: 0,
    total: getGrandTotal(),
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setError(null)

    // Validate address is selected
    if (!selectedAddressId) {
      setError("Please select a delivery address")
      setProcessing(false)
      return
    }

    try {
      // Create form data for order
      const formData = new FormData()
      formData.append("items", JSON.stringify(items))
      formData.append("payment_method", paymentMethod)
      formData.append("total_amount", getGrandTotal().toString())
      formData.append("delivery_address_id", selectedAddressId)

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create order
      const { success: orderSuccess, error: orderError } = await createMultiItemOrder(formData)
      
      if (orderSuccess) {
        setSuccess(true)
        clearCart()
        // Redirect to profile page after 3 seconds
        setTimeout(() => {
          router.push("/profile")
        }, 3000)
      } else {
        setError(orderError || "Payment failed. Please try again.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card p-12 rounded-2xl border border-border shadow-lg text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-serif text-3xl mb-4">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your order has been confirmed. We'll send you tracking details via email.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to your orders...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="font-serif text-4xl md:text-5xl text-balance mb-2">Confirm Your Order</h1>
          <p className="text-muted-foreground">Cash on Delivery (COD) only</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card p-8 rounded-2xl border border-border"
            >
              {/* Delivery Address Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl">Delivery Address</h2>
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New
                    </Button>
                  </Link>
                </div>

                {loadingAddresses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No addresses found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please add a delivery address to continue
                    </p>
                    <Link href="/profile">
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Address
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <Card 
                        key={address.id}
                        className={`cursor-pointer transition-all ${
                          selectedAddressId === address.id 
                            ? 'border-primary border-2 bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                                selectedAddressId === address.id 
                                  ? 'border-primary bg-primary' 
                                  : 'border-muted-foreground'
                              }`}>
                                {selectedAddressId === address.id && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium capitalize">{address.address_type}</span>
                                  {address.is_default && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                  )}
                                </div>
                                <p className="font-medium text-sm">{address.full_name}</p>
                                <p className="text-sm text-muted-foreground">{address.phone}</p>
                                <p className="text-sm mt-1">
                                  {address.address_line_1}, {address.address_line_2 && `${address.address_line_2}, `}
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <h2 className="font-serif text-2xl mb-6">Payment Method</h2>

              <form onSubmit={handlePayment} className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary" />
                        <span className="font-medium">Cash on Delivery (COD)</span>
                      </div>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                  </div>
                </RadioGroup>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                {/* COD Notice */}
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Cash on Delivery</p>
                    <p>Pay in cash at the time of delivery. No online payment is required.</p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={processing || addresses.length === 0 || !selectedAddressId}
                  className="w-full py-6 text-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : addresses.length === 0 ? (
                    "Add Address to Continue"
                  ) : !selectedAddressId ? (
                    "Select Address to Continue"
                  ) : (
                    "Place Order (COD)"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card p-6 rounded-2xl border border-border sticky top-4"
            >
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="pb-4 border-b border-border">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} • {item.rentalDays} days
                    </p>
                    <p className="text-sm font-medium mt-2">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{orderSummary.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-₹{orderSummary.discount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span>₹{orderSummary.securityDeposit.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-serif text-xl">Total</span>
                  <span className="font-serif text-2xl">₹{orderSummary.total.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-muted-foreground">Security deposit will be refunded after return</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
