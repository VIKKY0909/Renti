"use client"

import { useState, useEffect } from "react"
import { Check, X, MapPin, Info, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { isValidPincode, getCityFromPincode, getPincodeValidationMessage } from "@/lib/utils/pincode-validation"
import { getUserAddresses } from "@/lib/actions/addresses"

interface AddressSelectorProps {
  onAddressValidated: (pincode: string, city: string, addressId: string) => void
  onAddressInvalid: () => void
  disabled?: boolean
  className?: string
}

export function AddressSelector({
  onAddressValidated,
  onAddressInvalid,
  disabled = false,
  className
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    city: string | null
    message: string
  } | null>(null)

  // Load user addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const result = await getUserAddresses()
        console.log("Addresses result:", result)
        
        // Handle different response formats
        if (result && typeof result === 'object') {
          if (Array.isArray(result)) {
            setAddresses(result)
          } else if (result.addresses && Array.isArray(result.addresses)) {
            setAddresses(result.addresses)
          } else if (result.data && Array.isArray(result.data)) {
            setAddresses(result.data)
          } else {
            console.warn("Unexpected addresses format:", result)
            setAddresses([])
          }
        } else {
          setAddresses([])
        }
      } catch (error) {
        console.error("Error loading addresses:", error)
        setAddresses([])
      }
    }
    loadAddresses()
  }, [])

  const handleAddressSelect = async (addressId: string) => {
    setSelectedAddressId(addressId)
    
    if (!addressId) {
      setValidationResult(null)
      onAddressInvalid()
      return
    }

    const selectedAddress = addresses.find(addr => addr.id === addressId)
    if (!selectedAddress) {
      setValidationResult(null)
      onAddressInvalid()
      return
    }

    setIsValidating(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const isValid = isValidPincode(selectedAddress.pincode)
    const city = getCityFromPincode(selectedAddress.pincode)

    const result = {
      isValid,
      city,
      message: isValid 
        ? `✅ Delivery available in ${city}!`
        : getPincodeValidationMessage()
    }

    setValidationResult(result)

    if (isValid && city) {
      onAddressValidated(selectedAddress.pincode, city, addressId)
    } else {
      onAddressInvalid()
    }

    setIsValidating(false)
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
          <Select
            value={selectedAddressId}
            onValueChange={handleAddressSelect}
            disabled={disabled || addresses.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                addresses.length === 0 
                  ? "No addresses found - Please add an address first" 
                  : "Select your delivery address"
              } />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(addresses) && addresses.length > 0 ? (
                addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{address.full_name || address.name || 'Address'}</div>
                        <div className="text-sm text-muted-foreground">
                          {address.address_line_1 || address.address}, {address.city} - {address.pincode}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-addresses" disabled>
                  <div className="text-center py-2 text-muted-foreground">
                    No addresses found
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
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

        {/* Loading State */}
        {isValidating && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              Checking delivery availability...
            </AlertDescription>
          </Alert>
        )}

        {/* Service Area Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Service Areas:</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  Khargone MP
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Indore MP
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Rental service is currently available only in these areas.
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* No Addresses Message */}
        {addresses.length === 0 && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-800">
              <div className="space-y-2">
                <div className="font-medium">No addresses found</div>
                <div className="text-sm">
                  Please add a delivery address in your profile to continue.
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
        )}
      </div>
    </div>
  )
}
