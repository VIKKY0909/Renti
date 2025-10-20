"use client"

import { useState, useEffect } from "react"
import { Package, Shirt, DollarSign, Settings, CreditCard, LogOut, Loader2, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyOrders } from "@/components/profile/my-orders"
import { MyDresses } from "@/components/profile/my-dresses"
import { MyEarnings } from "@/components/profile/my-earnings"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { BankDetails } from "@/components/profile/bank-details"
import { AddressManagement } from "@/components/profile/address-management"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useSearchParams } from "next/navigation"

export function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState("orders")
  const { user, profile, loading, signOut } = useAuth()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="font-serif text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} />
            <AvatarFallback className="text-2xl">
              {profile.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-serif text-3xl font-bold mb-2">
              {profile.full_name || "User"}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              {profile.city && profile.state ? `${profile.city}, ${profile.state}` : "Location not set"}
            </p>
          </div>
          <Button variant="outline" className="bg-transparent" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-muted h-auto">
          <TabsTrigger value="orders" className="flex items-center gap-2 py-3">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">My Orders</span>
          </TabsTrigger>
          <TabsTrigger value="dresses" className="flex items-center gap-2 py-3">
            <Shirt className="h-4 w-4" />
            <span className="hidden sm:inline">My Dresses</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2 py-3">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Addresses</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center gap-2 py-3">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 py-3">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2 py-3">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Bank Details</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-8">
          <MyOrders />
        </TabsContent>

        <TabsContent value="dresses" className="mt-8">
          <MyDresses />
        </TabsContent>

        <TabsContent value="addresses" className="mt-8">
          <AddressManagement />
        </TabsContent>

        <TabsContent value="earnings" className="mt-8">
          <MyEarnings />
        </TabsContent>

        <TabsContent value="settings" className="mt-8">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="bank" className="mt-8">
          <BankDetails />
        </TabsContent>
      </Tabs>
    </div>
  )
}
