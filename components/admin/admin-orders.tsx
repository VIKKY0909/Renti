"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Truck, CheckCircle, Loader2 } from "lucide-react"
import { getAllOrders } from "@/lib/actions/admin"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { formatDate } from "@/lib/utils"

const statusConfig = {
  pending: { label: "Pending", icon: Package, color: "bg-yellow-500" },
  confirmed: { label: "Confirmed", icon: Package, color: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-blue-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-gray-500" },
  cancelled: { label: "Cancelled", icon: Package, color: "bg-red-500" },
}

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { orders: data, error } = await getAllOrders({
          status: filterStatus !== "all" ? filterStatus : undefined,
        })
        if (error) {
          console.error("Error fetching orders:", error)
        } else {
          setOrders(data || [])
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [filterStatus])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Orders Management</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
        <SkeletonLoader type="grid" count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Orders Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track and update order statuses</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48 bg-transparent">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <Package className="h-16 w-16 sm:h-24 sm:w-24 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg sm:text-xl mb-2">No orders found</h3>
          <p className="text-sm sm:text-base text-muted-foreground">No orders match the current filter.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status?.icon || Package

            return (
              <div key={order.id} className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="w-full sm:w-32 h-40 sm:h-40 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={order.product?.images?.[0] || "/placeholder.svg"}
                      alt={order.product?.title || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Order ID: {order.id}</p>
                        <h3 className="font-semibold text-base sm:text-xl mb-1 line-clamp-2">{order.product?.title || "Unknown Product"}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Customer: {order.user?.full_name || order.user?.email || "Unknown"}</p>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold">₹{order.total_amount}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-muted-foreground">Rental Start</p>
                        <p className="font-medium">{formatDate(order.rental_start_date)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rental End</p>
                        <p className="font-medium">{formatDate(order.rental_end_date)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${status?.color}`} />
                        <span className="text-xs sm:text-sm font-medium">{status?.label || order.status}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Created: {formatDate(order.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}