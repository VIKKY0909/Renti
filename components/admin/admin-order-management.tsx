"use client"

import { useState, useEffect } from "react"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Package, 
  RotateCcw,
  CreditCard,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"

interface Order {
  id: string
  rental_start_date: string
  rental_end_date: string
  rental_days: number
  rental_price: number
  security_deposit: number
  total_amount: number
  status: string
  payment_status: string
  tracking_number?: string
  admin_notes?: string
  customer_notes?: string
  pickup_address?: string
  delivery_address?: {
    id: string
    full_name: string
    phone: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    pincode: string
    landmark?: string
    instructions?: string
  }
  pickup_scheduled_date?: string
  delivery_scheduled_date?: string
  return_scheduled_date?: string
  actual_pickup_date?: string
  actual_delivery_date?: string
  actual_return_date?: string
  shipping_cost: number
  late_fee: number
  damage_fee: number
  final_amount?: number
  refund_amount: number
  created_at: string
  customer: {
    id: string
    full_name: string
    email: string
    phone: string
    city: string
    state: string
    pincode?: string
  }
  owner: {
    id: string
    full_name: string
    email: string
    phone: string
    city: string
    state: string
    pincode?: string
  }
  products: {
    id: string
    title: string
    images: string[]
    rental_price: number
    security_deposit: number
  }
  status_updated_by_profile?: {
    id: string
    full_name: string
  }
}

interface OrderManagementProps {
  initialOrders?: Order[]
}

export function AdminOrderManagement({ initialOrders = [] }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [notesText, setNotesText] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const url = `/api/admin/orders?status=${activeTab === 'all' ? '' : activeTab}`
      console.log('[Admin Orders] Fetching orders from:', url)
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('[Admin Orders] API Response:', {
        status: response.status,
        ok: response.ok,
        ordersCount: data.orders?.length || 0,
        data: data
      })
      
      if (response.ok) {
        setOrders(data.orders || [])
        console.log('[Admin Orders] Orders loaded:', data.orders?.length || 0)
        
        if (!data.orders || data.orders.length === 0) {
          console.warn('[Admin Orders] No orders found for status:', activeTab)
        }
      } else {
        console.error('[Admin Orders] API Error:', data)
        toast.error(data.error || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('[Admin Orders] Fetch error:', error)
      toast.error('Error fetching orders. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderAction = async (orderId: string, action: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          admin_notes: notes
        })
      })

      if (response.ok) {
        toast.success(`Order ${action} successfully`)
        fetchOrders()
        setSelectedOrder(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Error updating order')
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedOrder || !notesText.trim()) {
      toast.error('Please enter notes')
      return
    }

    setSavingNotes(true)
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_notes: notesText
        })
      })

      if (response.ok) {
        toast.success('Notes saved successfully')
        setNotesDialogOpen(false)
        setNotesText("")
        fetchOrders()
        // Update selected order
        if (selectedOrder) {
          setSelectedOrder({...selectedOrder, admin_notes: notesText})
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      toast.error('Error saving notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle, color: 'text-blue-600' },
      picked_up: { label: 'Picked Up', variant: 'default' as const, icon: Package, color: 'text-orange-600' },
      dispatched: { label: 'Dispatched', variant: 'default' as const, icon: Truck, color: 'text-purple-600' },
      delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      picked_up_for_return: { label: 'Picked Up for Return', variant: 'secondary' as const, icon: RotateCcw, color: 'text-orange-600' },
      returned: { label: 'Returned', variant: 'default' as const, icon: RotateCcw, color: 'text-blue-600' },
      completed: { label: 'Completed', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Pending', variant: 'secondary' as const, color: 'text-yellow-600' },
      paid: { label: 'Paid', variant: 'default' as const, color: 'text-green-600' },
      refunded: { label: 'Refunded', variant: 'default' as const, color: 'text-blue-600' }
    }

    const statusConfig = config[status as keyof typeof config] || config.pending

    return (
      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
        <CreditCard className={`h-3 w-3 ${statusConfig.color}`} />
        {statusConfig.label}
      </Badge>
    )
  }

  const getStats = () => {
    const stats = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      picked_up: orders.filter(o => o.status === 'picked_up').length,
      dispatched: orders.filter(o => o.status === 'dispatched').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      picked_up_for_return: orders.filter(o => o.status === 'picked_up_for_return').length,
      returned: orders.filter(o => o.status === 'returned').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      total: orders.length
    }
    return stats
  }

  const stats = getStats()

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'picked_up',
      picked_up: 'dispatched',
      dispatched: 'delivered',
      delivered: 'picked_up_for_return',
      picked_up_for_return: 'returned',
      returned: 'completed'
    }
    return statusFlow[currentStatus as keyof typeof statusFlow]
  }

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2">Order Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Track and manage rental orders</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchOrders}
          disabled={loading}
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </Button>
      </div>

      {/* Stats Cards - Complete Order Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2 sm:gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Confirmed</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Picked Up</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.picked_up}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Dispatched</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.dispatched}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Delivered</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Return Pickup</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.picked_up_for_return}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Returned</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.returned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 min-w-[600px]">
                <TabsTrigger value="pending" className="text-xs sm:text-sm">
                  <Clock className="h-3 w-3 mr-1 hidden sm:inline" />
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 mr-1 hidden sm:inline" />
                  Confirmed ({stats.confirmed})
                </TabsTrigger>
                <TabsTrigger value="picked_up" className="text-xs sm:text-sm">
                  <Package className="h-3 w-3 mr-1 hidden sm:inline" />
                  Picked Up ({stats.picked_up})
                </TabsTrigger>
                <TabsTrigger value="dispatched" className="text-xs sm:text-sm">
                  <Truck className="h-3 w-3 mr-1 hidden sm:inline" />
                  Dispatched ({stats.dispatched})
                </TabsTrigger>
                <TabsTrigger value="delivered" className="text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 mr-1 hidden sm:inline" />
                  Delivered ({stats.delivered})
                </TabsTrigger>
                <TabsTrigger value="picked_up_for_return" className="text-xs sm:text-sm">
                  <RotateCcw className="h-3 w-3 mr-1 hidden sm:inline" />
                  Return Pickup ({stats.picked_up_for_return})
                </TabsTrigger>
                <TabsTrigger value="returned" className="text-xs sm:text-sm">
                  <RotateCcw className="h-3 w-3 mr-1 hidden sm:inline" />
                  Returned ({stats.returned})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 mr-1 hidden sm:inline" />
                  Completed ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  <AlertTriangle className="h-3 w-3 mr-1 hidden sm:inline" />
                  All ({stats.total})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {order.products?.images && order.products.images.length > 0 ? (
                            <Image
                              src={order.products.images[0]}
                              alt={order.products.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <div className="flex gap-2">
                              {getStatusBadge(order.status)}
                              {getPaymentStatusBadge(order.payment_status)}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {order.products?.title}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-muted-foreground">Rental Period</p>
                              <p className="font-medium">
                                {new Date(order.rental_start_date).toLocaleDateString()} - {new Date(order.rental_end_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Amount</p>
                              <p className="font-medium">₹{order.total_amount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Order Date</p>
                              <p className="font-medium">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duration</p>
                              <p className="font-medium">{order.rental_days} days</p>
                            </div>
                          </div>

                          {/* Customer & Owner Info */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">Customer</span>
                              </div>
                              <div className="text-sm space-y-1">
                                <p className="font-medium">{order.customer?.full_name}</p>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">{order.customer?.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">{order.customer?.phone}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">Owner</span>
                              </div>
                              <div className="text-sm space-y-1">
                                <p className="font-medium">{order.owner?.full_name}</p>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">{order.owner?.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">{order.owner?.phone}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">{order.owner?.city}, {order.owner?.state} - {order.owner?.pincode}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Address */}
                          {order.delivery_address && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-green-700" />
                                <span className="font-medium text-sm text-green-900">Delivery Address</span>
                              </div>
                              <div className="text-sm space-y-1 text-green-800">
                                <p className="font-medium">{order.delivery_address.full_name}</p>
                                <p>{order.delivery_address.address_line_1}</p>
                                {order.delivery_address.address_line_2 && <p>{order.delivery_address.address_line_2}</p>}
                                {order.delivery_address.landmark && <p>Landmark: {order.delivery_address.landmark}</p>}
                                <p>{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
                                <p>Phone: {order.delivery_address.phone}</p>
                                {order.delivery_address.instructions && (
                                  <p className="text-xs italic mt-1">Note: {order.delivery_address.instructions}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Admin Notes */}
                          {order.admin_notes && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes</p>
                              <p className="text-sm text-blue-700">{order.admin_notes}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View Details
                            </Button>
                            
                            {getNextStatus(order.status) && (
                              <Button
                                size="sm"
                                onClick={() => handleOrderAction(order.id, getNextStatus(order.status)!)}
                              >
                                Move to {getNextStatus(order.status)}
                              </Button>
                            )}

                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleOrderAction(order.id, 'cancelled')}
                              >
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {orders.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                    <p className="text-muted-foreground mb-6">
                      {activeTab === 'all' 
                        ? 'No orders have been placed yet.' 
                        : `No orders with status "${activeTab}" found.`
                      }
                    </p>
                    
                    {activeTab === 'all' && (
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="bg-muted p-4 rounded-lg text-left">
                          <h4 className="font-semibold mb-2">To test orders:</h4>
                          <ol className="text-sm space-y-1 list-decimal list-inside">
                            <li>Login as a regular user (not admin)</li>
                            <li>Add a delivery address in profile</li>
                            <li>Browse products and place an order</li>
                            <li>Return here to manage the order</li>
                          </ol>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left">
                          <h4 className="font-semibold mb-2 text-blue-900">Database Check:</h4>
                          <p className="text-sm text-blue-800 mb-2">
                            Run this in Supabase SQL Editor:
                          </p>
                          <code className="text-xs bg-blue-100 p-2 rounded block">
                            SELECT COUNT(*) FROM orders;
                          </code>
                          <p className="text-xs text-blue-700 mt-2">
                            If this returns 0, no orders exist in database.
                          </p>
                        </div>
                        
                        <Button variant="outline" onClick={fetchOrders}>
                          Refresh Orders
                        </Button>
                      </div>
                    )}
                    
                    {activeTab !== 'all' && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Try viewing all orders instead:
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('all')}
                        >
                          View All Orders
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{selectedOrder.id.slice(0, 8)}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Status & Payment */}
              <div className="flex gap-4">
                {getStatusBadge(selectedOrder.status)}
                {getPaymentStatusBadge(selectedOrder.payment_status)}
              </div>

              {/* Product Details */}
              <div>
                <h4 className="font-semibold mb-3">Product Details</h4>
                <div className="flex gap-4">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
                    {selectedOrder.products?.images && selectedOrder.products.images.length > 0 ? (
                      <Image
                        src={selectedOrder.products.images[0]}
                        alt={selectedOrder.products.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">{selectedOrder.products?.title}</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <p className="text-muted-foreground">Rental Price</p>
                        <p className="font-medium">₹{selectedOrder.rental_price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Security Deposit</p>
                        <p className="font-medium">₹{selectedOrder.security_deposit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Period & Amount */}
              <div>
                <h4 className="font-semibold mb-3">Rental Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(selectedOrder.rental_start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(selectedOrder.rental_end_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedOrder.rental_days} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-medium">₹{selectedOrder.total_amount}</p>
                  </div>
                </div>
              </div>

              {/* Customer & Owner Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedOrder.customer?.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.customer?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.customer?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.customer?.city}, {selectedOrder.customer?.state}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Owner Information</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedOrder.owner?.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.owner?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.owner?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.owner?.city}, {selectedOrder.owner?.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h4 className="font-semibold mb-3">Full Addresses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Address */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-blue-700" />
                      <span className="font-medium text-sm text-blue-900">Customer Address</span>
                    </div>
                    <div className="text-sm space-y-1 text-blue-800">
                      <p className="font-semibold">{selectedOrder.customer?.full_name}</p>
                      <p>{selectedOrder.customer?.city}, {selectedOrder.customer?.state}</p>
                      {selectedOrder.customer?.pincode && <p>Pincode: {selectedOrder.customer.pincode}</p>}
                      <p className="pt-2 border-t border-blue-200">Phone: {selectedOrder.customer?.phone}</p>
                      <p>Email: {selectedOrder.customer?.email}</p>
                    </div>
                  </div>

                  {/* Owner Address */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-purple-700" />
                      <span className="font-medium text-sm text-purple-900">Owner Address</span>
                    </div>
                    <div className="text-sm space-y-1 text-purple-800">
                      <p className="font-semibold">{selectedOrder.owner?.full_name}</p>
                      <p>{selectedOrder.owner?.city}, {selectedOrder.owner?.state}</p>
                      {selectedOrder.owner?.pincode && <p>Pincode: {selectedOrder.owner.pincode}</p>}
                      <p className="pt-2 border-t border-purple-200">Phone: {selectedOrder.owner?.phone}</p>
                      <p>Email: {selectedOrder.owner?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address (if different) */}
                {selectedOrder.delivery_address && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4 text-green-700" />
                      <span className="font-medium text-sm text-green-900">Delivery Address (Customer Selected)</span>
                    </div>
                    <div className="text-sm space-y-1 text-green-800">
                      <p className="font-semibold">{selectedOrder.delivery_address.full_name}</p>
                      <p>{selectedOrder.delivery_address.address_line_1}</p>
                      {selectedOrder.delivery_address.address_line_2 && <p>{selectedOrder.delivery_address.address_line_2}</p>}
                      {selectedOrder.delivery_address.landmark && <p className="text-xs italic">Landmark: {selectedOrder.delivery_address.landmark}</p>}
                      <p>{selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state} - {selectedOrder.delivery_address.pincode}</p>
                      <p className="pt-2 border-t border-green-200">Phone: {selectedOrder.delivery_address.phone}</p>
                      {selectedOrder.delivery_address.instructions && (
                        <p className="text-xs bg-green-100 p-2 rounded mt-2">
                          <span className="font-medium">Instructions:</span> {selectedOrder.delivery_address.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              <div>
                <h4 className="font-semibold mb-3">Admin Actions</h4>
                <div className="flex gap-2 flex-wrap">
                  {getNextStatus(selectedOrder.status) && (
                    <Button
                      onClick={() => {
                        handleOrderAction(selectedOrder.id, getNextStatus(selectedOrder.status)!)
                        setSelectedOrder(null)
                      }}
                    >
                      Move to {getNextStatus(selectedOrder.status)}
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'pending' && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleOrderAction(selectedOrder.id, 'cancelled')
                        setSelectedOrder(null)
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {
                      setNotesText(selectedOrder.admin_notes || "")
                      setNotesDialogOpen(true)
                    }}
                  >
                    {selectedOrder.admin_notes ? 'Edit Notes' : 'Add Notes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder?.admin_notes ? 'Edit Order Notes' : 'Add Order Notes'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Admin Notes</Label>
              <Textarea
                id="notes"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add notes about this order (visible only to admins)..."
                className="min-h-32"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                These notes are only visible to admins and will be saved to the order.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setNotesDialogOpen(false)
                setNotesText("")
              }}
              disabled={savingNotes}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNotes}
              disabled={savingNotes || !notesText.trim()}
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

