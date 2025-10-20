"use client"

import { useState, useEffect } from "react"
import { Check, X, MapPin, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { isValidPincode, getCityFromPincode, getPincodeValidationMessage } from "@/lib/utils/pincode-validation"
import { getUserAddresses } from "@/lib/actions/addresses"

interface DeliveryValidationProps {
  onValidationComplete: (isValid: boolean, pincode?: string, city?: string, addressId?: string) => void
  className?: string
}

export function DeliveryValidation({ onValidationComplete, className }: DeliveryValidationProps) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    city: string | null
    message: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const result = await getUserAddresses()
        
        if (result && result.addresses && Array.isArray(result.addresses)) {
          setAddresses(result.addresses)
          
          // Auto-select default address if available
          const defaultAddress = result.addresses.find(addr => addr.is_default)
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id)
            validateAddress(defaultAddress)
          }
        } else {
          setAddresses([])
        }
      } catch (error) {
        console.error("Error loading addresses:", error)
        setAddresses([])
      } finally {
        setIsLoading(false)
      }
    }
    loadAddresses()
  }, [])

  const validateAddress = async (address: any) => {
    try {
      // Call API to validate delivery
      const response = await fetch('/api/orders/validate-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: address.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Validation failed')
      }

      const result = {
        isValid: data.valid,
        city: data.city,
        message: data.valid ? data.message : data.error
      }

      setValidationResult(result)
      onValidationComplete(data.valid, address.pincode, data.city, address.id)

    } catch (error) {
      console.error("Error validating address:", error)
      const result = {
        isValid: false,
        city: null,
        message: "Error validating delivery address. Please try again."
      }
      setValidationResult(result)
      onValidationComplete(false)
    }
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    
    if (!addressId) {
      setValidationResult(null)
      onValidationComplete(false)
      return
    }

    const selectedAddress = addresses.find(addr => addr.id === addressId)
    if (selectedAddress) {
      validateAddress(selectedAddress)
    }
  }

  if (isLoading) {
    return (
      <div className={className}>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Loading addresses...</span>
          </div>
        </div>
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className={className}>
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-amber-800">
            <div className="space-y-2">
              <div className="font-medium">No delivery addresses found</div>
              <div className="text-sm">
                Please add a delivery address to continue with your order.
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.href = '/profile'}
              >
                Add Address
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Address Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            Delivery Address *
          </label>
          <select
            value={selectedAddressId}
            onChange={(e) => handleAddressSelect(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">Select delivery address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.full_name} - {address.address_line_1}, {address.city} - {address.pincode}
              </option>
            ))}
          </select>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <Alert className={validationResult.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {validationResult.isValid ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={validationResult.isValid ? "text-green-800" : "text-red-800"}>
                {validationResult.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Service Areas Info */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">Service Areas:</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              Khargone MP
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Indore MP
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Delivery is available only in these areas.
          </div>
        </div>
      </div>
    </div>
  )
}
