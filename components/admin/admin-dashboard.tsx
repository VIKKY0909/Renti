"use client"

import { useState } from "react"
import { LayoutDashboard, Star, Users, Package, Truck, FileText, Image as ImageIcon, LogOut, ClipboardList, ShoppingCart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminOverview } from "@/components/admin/admin-overview"
import { AdminReviews } from "@/components/admin/admin-reviews"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminProducts } from "@/components/admin/admin-products"
import { AdminOrders } from "@/components/admin/admin-orders"
import { AdminContent } from "@/components/admin/admin-content"
import { AdminProductManagement } from "@/components/admin/admin-product-management"
import { AdminOrderManagement } from "@/components/admin/admin-order-management"
import { AdminUserManagement } from "@/components/admin/admin-user-management"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 transition-all duration-300 hover:opacity-90 animate-logo-glow">
            <span className="rounded-full bg-background/80 shadow-lg p-1 border border-border overflow-hidden flex items-center justify-center">
              <Image
                src={require("@/public/logo.png")}
                alt="Rentimade"
                width={48}
                height={48}
                className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </span>
          </Link>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground hidden xs:block">Admin Panel</span>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent text-xs sm:text-sm px-2 sm:px-3">
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-4 sm:mb-8">
            {/* Mobile Navigation - Single Row */}
            <div className="block sm:hidden">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-4 bg-muted h-auto min-w-[320px]">
                  <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <LayoutDashboard className="h-3 w-3" />
                    <span className="text-[10px]">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="product-management" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <ClipboardList className="h-3 w-3" />
                    <span className="text-[10px]">Products</span>
                  </TabsTrigger>
                  <TabsTrigger value="order-management" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <ShoppingCart className="h-3 w-3" />
                    <span className="text-[10px]">Orders</span>
                  </TabsTrigger>
                  <TabsTrigger value="user-management" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <Users className="h-3 w-3" />
                    <span className="text-[10px]">Users</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Secondary Mobile Navigation */}
              <div className="overflow-x-auto mt-2">
                <TabsList className="grid w-full grid-cols-4 bg-muted h-auto min-w-[320px]">
                  <TabsTrigger value="reviews" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <Star className="h-3 w-3" />
                    <span className="text-[10px]">Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <Package className="h-3 w-3" />
                    <span className="text-[10px]">All Products</span>
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <Truck className="h-3 w-3" />
                    <span className="text-[10px]">All Orders</span>
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex flex-col items-center gap-1 py-2 text-xs px-1">
                    <FileText className="h-3 w-3" />
                    <span className="text-[10px]">Content</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            {/* Tablet Navigation */}
            <div className="hidden sm:block lg:hidden">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-4 bg-muted h-auto min-w-[600px]">
                  <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3 text-sm">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="product-management" className="flex items-center gap-2 py-3 text-sm">
                    <ClipboardList className="h-4 w-4" />
                    <span>Products</span>
                  </TabsTrigger>
                  <TabsTrigger value="order-management" className="flex items-center gap-2 py-3 text-sm">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Orders</span>
                  </TabsTrigger>
                  <TabsTrigger value="user-management" className="flex items-center gap-2 py-3 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="overflow-x-auto mt-2">
                <TabsList className="grid w-full grid-cols-4 bg-muted h-auto min-w-[600px]">
                  <TabsTrigger value="reviews" className="flex items-center gap-2 py-3 text-sm">
                    <Star className="h-4 w-4" />
                    <span>Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center gap-2 py-3 text-sm">
                    <Package className="h-4 w-4" />
                    <span>All Products</span>
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex items-center gap-2 py-3 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>All Orders</span>
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2 py-3 text-sm">
                    <FileText className="h-4 w-4" />
                    <span>Content</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <TabsList className="grid w-full grid-cols-8 bg-muted h-auto">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="product-management" className="flex items-center gap-2 py-3">
                  <ClipboardList className="h-4 w-4" />
                  <span>Product Review</span>
                </TabsTrigger>
                <TabsTrigger value="order-management" className="flex items-center gap-2 py-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Order Track</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2 py-3">
                  <Star className="h-4 w-4" />
                  <span>Reviews</span>
                </TabsTrigger>
                <TabsTrigger value="user-management" className="flex items-center gap-2 py-3">
                  <Users className="h-4 w-4" />
                  <span>User Mgmt</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2 py-3">
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2 py-3">
                  <Truck className="h-4 w-4" />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2 py-3">
                  <FileText className="h-4 w-4" />
                  <span>Content</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="dashboard">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="product-management">
            <AdminProductManagement />
          </TabsContent>

          <TabsContent value="order-management">
            <AdminOrderManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews />
          </TabsContent>

          <TabsContent value="user-management">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>

          <TabsContent value="content">
            <AdminContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
