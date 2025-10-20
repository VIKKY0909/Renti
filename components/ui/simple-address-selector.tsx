"use client"

import { useState, useEffect } from "react"
import { Check, X, MapPin, Info, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { isValidPincode, getCityFromPincode, getPincodeValidationMessage } from "@/lib/utils/pincode-validation"

interface SimpleAddressSelectorProps {
  onAddressValidated: (pincode: string, city: string) => void
  onAddressInvalid: () => void
  disabled?: boolean
  className?: string
}

export function SimpleAddressSelector({
  onAddressValidated,
  onAddressInvalid,
  disabled = false,
  className
}: SimpleAddressSelectorProps) {
  const [pincode, setPincode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    city: string | null
    message: string
  } | null>(null)

  const handleValidate = async () => {
    if (!pincode.trim()) {
      setValidationResult({
        isValid: false,
        city: null,
        message: "Please enter a pincode"
      })
      onAddressInvalid()
      return
    }

    setIsValidating(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const isValid = isValidPincode(pincode)
    const city = getCityFromPincode(pincode)

    const result = {
      isValid,
      city,
      message: isValid 
        ? `✅ Delivery available in ${city}!`
        : getPincodeValidationMessage()
    }

    setValidationResult(result)

    if (isValid && city) {
      onAddressValidated(pincode, city)
    } else {
      onAddressInvalid()
    }

    setIsValidating(false)
  }

  const handlePincodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const cleanValue = value.replace(/\D/g, '').slice(0, 6)
    setPincode(cleanValue)
    
    // Clear validation result when user types
    if (validationResult) {
      setValidationResult(null)
      onAddressInvalid()
    }
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Pincode Input */}
        <div className="space-y-2">
          <Label htmlFor="pincode" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Pincode *
          </Label>
          <div className="flex gap-2">
            <Input
              id="pincode"
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              disabled={disabled}
              className="flex-1"
              maxLength={6}
            />
            <Button
              onClick={handleValidate}
              disabled={disabled || !pincode.trim() || pincode.length !== 6 || isValidating}
              className="px-6"
            >
              {isValidating ? "Checking..." : "Check"}
            </Button>
          </div>
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
      </div>
    </div>
  )
}
