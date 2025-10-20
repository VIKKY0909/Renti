"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, MapPin, Edit, Trash2, Star, Home, Building, MapPin as MapPinIcon } from "lucide-react"
import { toast } from "sonner"
import { getUserAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress, type Address } from "@/lib/actions/addresses"

export function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    address_type: "home" as "home" | "work" | "other",
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    instructions: "",
    is_default: false,
  })

  const loadAddresses = async () => {
    setLoading(true)
    const { addresses, error } = await getUserAddresses()
    if (error) {
      toast.error(error)
    } else {
      setAddresses(addresses)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value.toString())
    })

    let result
    if (editingAddress) {
      result = await updateAddress(editingAddress.id, form)
    } else {
      result = await createAddress(form)
    }

    if (result.success) {
      toast.success(editingAddress ? "Address updated successfully" : "Address added successfully")
      setIsDialogOpen(false)
      setEditingAddress(null)
      resetForm()
      loadAddresses()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    const result = await deleteAddress(addressId)
    if (result.success) {
      toast.success("Address deleted successfully")
      loadAddresses()
    } else {
      toast.error(result.error)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    const result = await setDefaultAddress(addressId)
    if (result.success) {
      toast.success("Default address updated")
      loadAddresses()
    } else {
      toast.error(result.error)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      address_type: address.address_type,
      full_name: address.full_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || "",
      instructions: address.instructions || "",
      is_default: address.is_default,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      address_type: "home",
      full_name: "",
      phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      instructions: "",
      is_default: false,
    })
  }

  const openAddDialog = () => {
    setEditingAddress(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const getAddressIcon = (addressType: string) => {
    switch (addressType) {
      case "home":
        return <Home className="h-4 w-4" />
      case "work":
        return <Building className="h-4 w-4" />
      default:
        return <MapPinIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Addresses
          </CardTitle>
          <CardDescription>Manage your delivery addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Addresses
            </CardTitle>
            <CardDescription>Manage your delivery addresses for orders</CardDescription>
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses added</h3>
            <p className="text-muted-foreground mb-4">Add your first delivery address to start placing orders</p>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getAddressIcon(address.address_type)}
                      <CardTitle className="text-lg capitalize">{address.address_type} Address</CardTitle>
                      {address.is_default && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(address)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{address.full_name}</div>
                    <div className="text-sm text-muted-foreground">{address.phone}</div>
                    <div className="text-sm">
                      {address.address_line_1}
                      {address.address_line_2 && <br />}
                      {address.address_line_2}
                      <br />
                      {address.city}, {address.state} - {address.pincode}
                      {address.landmark && (
                        <>
                          <br />
                          <span className="text-muted-foreground">Landmark: {address.landmark}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-3 w-full"
                    >
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update your address information" : "Add a new delivery address"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address_type">Address Type</Label>
                <Select
                  value={formData.address_type}
                  onValueChange={(value: "home" | "work" | "other") =>
                    setFormData({ ...formData, address_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_1">Address Line 1</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                placeholder="House/Flat No., Building Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                placeholder="Street, Area, Colony"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="Nearby landmark"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Any special instructions for delivery"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
              />
              <Label htmlFor="is_default">Set as default address</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setEditingAddress(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}