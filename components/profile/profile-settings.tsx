"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { updateProfile } from "@/lib/actions/profile"
import { toast } from "sonner"

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { profile } = useAuth()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const { success, error } = await updateProfile(formData)
      
      if (success) {
        toast.success("Profile updated successfully!")
      } else {
        toast.error(error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">Update your personal information</p>
      </div>

      <form onSubmit={handleSave} className="bg-card rounded-2xl border border-border p-6 space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="name" defaultValue={profile?.full_name || ""} className="pl-10 bg-transparent" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" defaultValue={profile?.email || ""} className="pl-10 bg-transparent" disabled />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="phone" type="tel" defaultValue={profile?.phone || ""} className="pl-10 bg-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="city" defaultValue={profile?.city || ""} className="pl-10 bg-transparent" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" defaultValue={profile?.state || ""} className="bg-transparent" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" defaultValue={profile?.pincode || ""} className="bg-transparent" maxLength={6} />
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" className="bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" className="bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" className="bg-transparent" />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}
