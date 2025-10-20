"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { UserAddress } from "@/lib/actions/addresses"

interface AddressFormProps {
  address?: UserAddress | null
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

export function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const [isDefault, setIsDefault] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address) {
      setIsDefault(address.is_default)
    }
  }, [address])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("is_default", isDefault.toString())
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {address ? 'Edit Address' : 'Add New Address'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Type */}
            <div className="space-y-2">
              <Label htmlFor="address_type">Address Type</Label>
              <Select name="address_type" defaultValue={address?.address_type || 'home'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  defaultValue={address?.full_name || ''}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  defaultValue={address?.phone || ''}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Address Lines */}
            <div className="space-y-2">
              <Label htmlFor="address_line_1">Address Line 1 *</Label>
              <Input
                id="address_line_1"
                name="address_line_1"
                required
                defaultValue={address?.address_line_1 || ''}
                placeholder="House number, street name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                name="address_line_2"
                defaultValue={address?.address_line_2 || ''}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  defaultValue={address?.city || ''}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  required
                  defaultValue={address?.state || ''}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  required
                  defaultValue={address?.pincode || ''}
                  placeholder="Enter pincode"
                />
              </div>
            </div>

            {/* Landmark */}
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                name="landmark"
                defaultValue={address?.landmark || ''}
                placeholder="Near which landmark? (optional)"
              />
            </div>

            {/* Delivery Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Delivery Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                defaultValue={address?.instructions || ''}
                placeholder="Any special instructions for delivery? (optional)"
                rows={3}
              />
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
              <Label htmlFor="is_default">
                Set as default address
              </Label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : (address ? 'Update Address' : 'Add Address')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}




