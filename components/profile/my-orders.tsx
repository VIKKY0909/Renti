"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { getUserOrders } from "@/lib/actions/orders"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { formatDate } from "@/lib/utils"

interface Order {
  id: string
  product: {
    id: string
    title: string
    images: string[]
  }
  rental_price: number
  status: string
  rental_start_date: string
  rental_end_date: string
  rental_days: number
  total_amount: number
  payment_status: string
  created_at: string
}

const statusConfig = {
  pending: { label: "Pending", icon: Package, color: "bg-yellow-500" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "bg-blue-500" },
  picked_up: { label: "Picked Up", icon: Truck, color: "bg-orange-500" },
  dispatched: { label: "Dispatched", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Delivered", icon: Package, color: "bg-green-500" },
  picked_up_for_return: { label: "Picked Up for Return", icon: Truck, color: "bg-orange-500" },
  returned: { label: "Returned", icon: CheckCircle, color: "bg-blue-500" },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-gray-500" },
  cancelled: { label: "Cancelled", icon: Package, color: "bg-red-500" },
  rejected: { label: "Rejected", icon: Package, color: "bg-red-500" },
}

export function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { orders: data, error } = await getUserOrders()
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
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold mb-2">My Orders</h2>
          <p className="text-muted-foreground">Track and manage your rental orders</p>
        </div>
        <SkeletonLoader type="list" count={3} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold mb-2">My Orders</h2>
        <p className="text-muted-foreground">Track and manage your rental orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-xl mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Start exploring our collection to place your first order</p>
          <Link href="/browse">
            <Button>Browse Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <div key={order.id} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-40 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={order.product.images?.[0] || "/placeholder.svg"}
                      alt={order.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Order ID: {order.id}</p>
                        <h3 className="font-semibold text-xl mb-2">{order.product.title}</h3>
                        <Badge className={`${status.color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold">₹{order.rental_price}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Rental Start</p>
                        <p className="font-medium">{formatDate(order.rental_start_date)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rental End</p>
                        <p className="font-medium">{formatDate(order.rental_end_date)}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {order.status === "in-transit" && (
                        <Button variant="outline" className="bg-transparent">
                          <Truck className="h-4 w-4 mr-2" />
                          Track Order
                        </Button>
                      )}
                      <Link href={`/products/${order.product.id}`}>
                        <Button variant="outline" className="bg-transparent">
                          View Details
                        </Button>
                      </Link>
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
